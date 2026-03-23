import Attendance from "../models/attendance.js";
import User from "../models/user.js";
import { Op } from "sequelize";


export const markAttendance = async (req, res) => {
    try {
        const { date, records } = req.body;

        if (!date || !records || !Array.isArray(records) || records.length === 0) {
            return res.status(400).json({
                success: false,
                message: "date and records array are required",
            });
        }

        const results = await Promise.all(
            records.map(({ userId, status, comments }) =>
                Attendance.upsert({ userId, date, status, comments })
            )
        );

        return res.status(200).json({
            success: true,
            message: "Attendance marked successfully",
            count: results.length,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to mark attendance",
            error: error.message,
        });
    }
};

export const getMonthlyAttendanceAdmin = async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) {
            return res.status(400).json({
                success: false,
                message: "month query param is required e.g. ?month=2026-03",
            });
        }

        const startDate = `${month}-01`;
        const endDate = new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth() + 1, 0)
            .toISOString().split("T")[0];

        const records = await Attendance.findAll({
            where: {
                date: { [Op.between]: [startDate, endDate] },
            },
            include: [
                { model: User, as: "user", attributes: ["id", "name", "email", "role", "profileImage"] },
            ],
            order: [["date", "ASC"]],
        });

        const grouped = {};
        for (const r of records) {
            const uid = r.userId;
            if (!grouped[uid]) {
                grouped[uid] = {
                    user: r.user,
                    summary: { P: 0, HD: 0, AB: 0, NCNS: 0, WO: 0, L: 0 },
                    days: [],
                };
            }
            grouped[uid].summary[r.status]++;
            grouped[uid].days.push({
                date: r.date,
                status: r.status,
                comments: r.comments,
            });
        }


        const report = Object.values(grouped).map((entry) => {
            const { P, HD, AB, NCNS, WO, L } = entry.summary;
            const effectiveDays = P + (HD * 0.5) + WO + L;
            const deductions = AB + (NCNS * 2);
            return {
                ...entry,
                effectiveDays,
                deductions,
            };
        });

        return res.status(200).json({
            success: true,
            month,
            report,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch monthly attendance",
            error: error.message,
        });
    }
};


export const getDailyAttendanceAdmin = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "date query param is required e.g. ?date=2026-03-13",
            });
        }

        const allUsers = await User.findAll({
            where: { isActive: true, role: ["Sale", "Tech"] },
            attributes: ["id", "name", "email", "role", "profileImage"],
        });

        const records = await Attendance.findAll({
            where: { date },
        });

        const recordMap = {};
        for (const r of records) {
            recordMap[r.userId] = r;
        }


        const result = allUsers.map((u) => ({
            userId: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            profileImage: u.profileImage || null,
            status: recordMap[u.id]?.status || null,
            comments: recordMap[u.id]?.comments || null,
            marked: !!recordMap[u.id],
        }));

        return res.status(200).json({
            success: true,
            date,
            attendance: result,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch daily attendance",
            error: error.message,
        });
    }
};


export const getMyAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const { month } = req.query;

        if (!month) {
            return res.status(400).json({
                success: false,
                message: "month query param is required e.g. ?month=2026-03",
            });
        }

        const startDate = `${month}-01`;
        const endDate = new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth() + 1, 0)
            .toISOString().split("T")[0];

        const records = await Attendance.findAll({
            where: {
                userId,
                date: { [Op.between]: [startDate, endDate] },
            },
            order: [["date", "ASC"]],
        });

        const summary = { P: 0, HD: 0, AB: 0, NCNS: 0, WO: 0, L: 0 };
        for (const r of records) {
            summary[r.status]++;
        }

        const effectiveDays = summary.P + (summary.HD * 0.5) + summary.WO + summary.L;
        const deductions = summary.AB + (summary.NCNS * 2);

        return res.status(200).json({
            success: true,
            month,
            summary,
            effectiveDays,
            deductions,
            days: records.map((r) => ({
                date: r.date,
                status: r.status,
                comments: r.comments,
            })),
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch your attendance",
            error: error.message,
        });
    }
};