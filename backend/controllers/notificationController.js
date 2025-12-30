import jwt from "jsonwebtoken";
import Notification from "../models/notification.js";
import User from "../models/user.js";
import Case from "../models/case.js";

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
                { model: Case, attributes: ["id", "customerName", "status"] },
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
                caseId: n.Case?.id,
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
