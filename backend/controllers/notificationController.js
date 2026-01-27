import jwt from "jsonwebtoken";
import Notification from "../models/notification.js";
import User from "../models/user.js";
import Case from "../models/case.js";
import { Op } from "sequelize";

export const getNotifications = async (req, res) => {
    try {
        const token =
            req.cookies?.authToken ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let where = {};

        if (decoded.role !== "Admin") {
            where.recipientId = decoded.id;
        }

        const notifications = await Notification.findAll({
            where,
            include: [
                { model: User, as: "actor", attributes: ["id", "name", "role"] },
                { model: Case, attributes: ["id", "caseId","customerName", "status"] },
            ],
            order: [["createdAt", "DESC"]],
            limit: 50,
        });

        res.json({
            success: true,
            notifications: notifications.map(n => ({
                id: n.id,
                title: n.title,
                message: n.message,
                type: n.type,
                isRead: n.isRead,
                caseId: n.Case?.caseId || null,
                customerName: n.Case?.customerName,
                status: n.Case?.status,
                actor: n.actor?.name || "System",
                date: n.createdAt,
            })),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load notifications" });
    }
};


// tech user notification

export const getTechUserNotifications = async (req, res) => {
    try {
        const token =
            req.cookies?.authToken ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "Tech") {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        const techUserId = decoded.id;

        const notifications = await Notification.findAll({
            where: {
                recipientId: techUserId,
                type: {
                    [Op.in]: [
                        "CASE_ASSIGNED",   // new case assigned
                        "CASE_UPDATED",
                        "ADMIN_UPDATE",    // admin edited case
                    ],
                },
            },
            include: [
                {
                    model: User,
                    as: "actor",
                    attributes: ["id", "name", "role"],
                    where: {
                        role: {
                            [Op.in]: ["Admin", "Sales"],
                        },
                    },
                    required: false,
                },
                {
                    model: Case,
                    attributes: ["id", "caseId","customerName", "status"],
                },
            ],
            order: [["createdAt", "DESC"]],
            limit: 50,
        });

        res.json({
            success: true,
            notifications: notifications.map((n) => ({
                id: n.id,
                title: n.title,
                message: n.message,
                type: n.type,
                isRead: n.isRead,
                caseId: n.Case?.caseId || null,
                customerName: n.Case?.customerName || null,
                status: n.Case?.status || null,
                actor: n.actor?.name || "System",
                actorRole: n.actor?.role || "System",
                date: n.createdAt,
            })),
        });

    } catch (error) {
        console.error("Tech notification error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load tech notifications",
        });
    }
};

export const getAdminNotifications = async (req, res) => {
    try {
        const token = req.cookies?.authToken || req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({success: false, message: "No token provided"});
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if(decode.role !== "Admin"){
            return res.status(403).json({success: false, message: "Access Denied"});
        }

        const adminId = decode.id;

        const notification = await Notification.findAll({
            where: {
                type: {
                    [Op.in]: [   "CASE_CREATED",
            "CASE_UPDATED",
            "CASE_CLOSED",]
                },
                recipientId: null,
            },
            include: [
                {model: User, as: "actor", attributes: ["id","name"]},
                {model: User, as: "recipient", attributes: ["id", "name"]},
                {model: Case, attributes: ["caseId","customerName", "status"]},
            ],
            order: [["createdAt", "DESC"]],
        });

        const formattedNotification = notification.map((n)=>({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type,
            isRead: n.isRead,
            caseId: n.Case?.caseId || null,
            customerName: n.Case?.customerName || null,
            status: n.Case?.status || null,
            actor: n.actor?.name || null,
            recipient: n.recipient?.name || null,
            date: n.createdAt, 
        }));


        res.status(200).json({
            success: true,
            notifications: formattedNotification
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        })
    }
}
