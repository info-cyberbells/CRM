import AdminNotice from "../models/notice.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const createAdminNotice = async (req, res) => {
    try {
        const token =
            req.cookies?.authToken ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "Admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const { title, message, noticeType, isActive } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: "Title and message are required",
            });
        }

        const notice = await AdminNotice.create({
            title,
            message,
            noticeType,
            isActive,
            createdById: decoded.id,
        });

        res.status(201).json({
            success: true,
            notice,
        });

    } catch (error) {
        console.error("Create notice error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create notice",
        });
    }
};

export const getAllAdminNotices = async (req, res) => {
    try {
        const token =
            req.cookies?.authToken ||
            req.headers.authorization?.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "Admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const { rows, count } = await AdminNotice.findAndCountAll({
            include: [{ model: User, as: "createdBy", attributes: ["id", "name"] }],
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });

        res.json({
            success: true,
            pagination: {
                total: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                pageSize: limit,
            },
            notices: rows.map(n => ({
            ...n.toJSON(),
            createdAt: new Date(n.createdAt).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
            }),
            updatedAt: new Date(n.updatedAt).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
            }),
            })),
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch notices",
        });
    }
};

export const updateAdminNotice = async (req, res) => {
    try {
        const token =
            req.cookies?.authToken ||
            req.headers.authorization?.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "Admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const { id } = req.params;
        const { title, message, noticeType,isActive } = req.body;

        const notice = await AdminNotice.findByPk(id);

        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice not found" });
        }

        const updatedNotice = await notice.update({
            title,
            message,
            noticeType,
            isActive,
        });

        res.json({
            updatedNotice,
            success: true,
            message: "Notice updated successfully",
        });

    } catch (error) {
        console.error("Update notice error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update notice",
        });
    }
};


export const deleteAdminNotice = async (req, res) => {
    try {
        const token =
            req.cookies?.authToken ||
            req.headers.authorization?.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "Admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const { id } = req.params;

        const notice = await AdminNotice.findByPk(id);

        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice not found" });
        }

        await notice.destroy();

        res.json({
            success: true,
            message: "Notice deleted successfully",
        });

    } catch (error) {
        console.error("Delete notice error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete notice",
        });
    }
};
