import jwt from "jsonwebtoken";
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
        socket.on("send_message", async ({ roomId, content }) => {
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

            io.to(String(roomId)).emit("new_message", full);
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

            io.to(String(roomId)).emit("new_message", full);
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