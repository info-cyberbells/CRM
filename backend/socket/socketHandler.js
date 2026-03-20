import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import Message from "../models/Message.js";
import ChatMember from "../models/ChatMember.js";
import User from "../models/user.js";

export default function socketHandler(io) {

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("No token"));
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("decoded token:", decoded);
            socket.user = decoded;
            next();
        } catch {
            next(new Error("Invalid token"));
        }
    });
    io.on("connection", async (socket) => {
        console.log(`🟢 User ID: ${socket.user.id} Role: ${socket.user.role} connected`);

        // set user ONLINE
        await User.update(
            { status: "ONLINE" },
            { where: { id: socket.user.id } }
        );

        // broadcast to everyone that this user is now online
        io.emit("user_status_changed", { userId: socket.user.id, status: "ONLINE" });

        // Auto-join user to ALL their chat rooms so they receive new_message events
        // even for rooms they haven't actively opened (needed for unread notifications)
        try {
            const memberships = await ChatMember.findAll({
                where: { user_id: socket.user.id },
                attributes: ["room_id"],
            });
            for (const m of memberships) {
                socket.join(String(m.room_id));
            }
            console.log(`Auto-joined user ${socket.user.id} to ${memberships.length} rooms`);
        } catch (err) {
            console.error("Auto-join rooms error:", err.message);
        }

        // JOIN ROOM 
        socket.on("join_room", async (roomId) => {
            if (socket.user.role !== "Admin") {
                const membership = await ChatMember.findOne({
                    where: { room_id: roomId, user_id: socket.user.id },
                });
                if (!membership) return;
            }
            socket.join(String(roomId));
        });

        // ── LEAVE ROOM ────────────────────────────────────────────────────────────
        socket.on("leave_room", (roomId) => {
            socket.leave(String(roomId));
        });

        // ── SEND TEXT MESSAGE ─────────────────────────────────────────────────────
        socket.on("send_message", async ({ roomId, content, tempId }) => {
            if (!content?.trim()) return;

            const membership = await ChatMember.findOne({
                where: { room_id: roomId, user_id: socket.user.id },
            });
            if (!membership && socket.user.role !== "Admin") return;

            const msg = await Message.create({
                room_id: roomId,
                sender_id: socket.user.id,
                content: content.trim(),
            });

            const full = await Message.findByPk(msg.id, {
                include: [{ model: User, as: "sender", attributes: ["id", "name", "role"] }],
            });

            const payload = full.toJSON ? full.toJSON() : { ...full.dataValues };
            if (tempId) payload.tempId = tempId;

            // Broadcast to everyone in the room
            io.to(String(roomId)).emit("new_message", payload);

            // Confirm to sender that message was saved (single tick)
            socket.emit("message_sent", { tempId, messageId: msg.id, roomId });
        });

        // SEND FILE MESSAGE 
        socket.on("send_file", async ({ roomId, fileUrl, fileName }) => {
            const membership = await ChatMember.findOne({
                where: { room_id: roomId, user_id: socket.user.id },
            });
            if (!membership && socket.user.role !== "Admin") return;

            const msg = await Message.create({
                room_id: roomId,
                sender_id: socket.user.id,
                file_url: fileUrl,
                file_name: fileName,
            });

            const full = await Message.findByPk(msg.id, {
                include: [{ model: User, as: "sender", attributes: ["id", "name", "role"] }],
            });

            const payload = full.toJSON ? full.toJSON() : { ...full.dataValues };
            io.to(String(roomId)).emit("new_message", payload);

            // Confirm to sender that file message was saved (single tick)
            socket.emit("message_sent", { messageId: msg.id, roomId });
        });

        // ── MARK MESSAGES AS READ ─────────────────────────────────────────────────
        // Recipient emits this when they open a chat room to mark all unread
        // messages from other senders as read.
        socket.on("mark_read", async ({ roomId }) => {
            try {
                // Find all unread messages in this room that were NOT sent by
                // the current user (i.e. messages the current user should read)
                const unreadMessages = await Message.findAll({
                    where: {
                        room_id: roomId,
                        sender_id: { [Op.ne]: socket.user.id },
                        read_at: null,
                    },
                    attributes: ["id", "sender_id"],
                });

                if (unreadMessages.length === 0) return;

                const messageIds = unreadMessages.map(m => m.id);

                // Update read_at in DB
                await Message.update(
                    { read_at: new Date() },
                    {
                        where: {
                            id: messageIds,
                        },
                    }
                );

                // Notify everyone in the room that these messages have been read
                io.to(String(roomId)).emit("message_read", {
                    roomId,
                    readerId: socket.user.id,
                    messageIds,
                });
            } catch (err) {
                console.error("mark_read error:", err.message);
            }
        });

        // TYPING INDICATOR 
        socket.on("typing", ({ roomId }) => {
            socket.to(String(roomId)).emit("user_typing", {
                userId: socket.user.id,
                name: socket.user.name,
            });
        });

        socket.on("stop_typing", ({ roomId }) => {
            socket.to(String(roomId)).emit("user_stop_typing", { userId: socket.user.id });
        });

        socket.on("disconnect", async (reason) => {
            console.log(`🔴 User ID: ${socket.user?.id} disconnected — reason: ${reason}`);

            await User.update(
                { status: "OFFLINE" },
                { where: { id: socket.user.id } }
            );


            io.emit("user_status_changed", { userId: socket.user.id, status: "OFFLINE" });
        });
    });
}