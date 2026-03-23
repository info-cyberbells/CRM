import ChatRoom from "../models/ChatRoom.js";
import ChatMember from "../models/ChatMember.js";
import Message from "../models/Message.js";
import User from "../models/user.js";
import sequelize from "../config/db.js";

// GET ALL USERS (for sidebar)
export async function getAllUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: ["id", "name", "email", "role", "status", "profileImage"],
            where: { isActive: true },
            order: [["role", "ASC"], ["name", "ASC"]],
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//GET MY ROOMS
export async function getMyRooms(req, res) {
    try {
        const memberships = await ChatMember.findAll({
            where: { user_id: req.user.id },
            attributes: ["room_id"],
        });

        const roomIds = memberships.map((m) => m.room_id);

        if (roomIds.length === 0) return res.json([]);

        const rooms = await ChatRoom.findAll({
            where: { id: roomIds },
            include: [
                {
                    model: ChatMember,
                    as: "members",
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "name", "role", "status"],
                        },
                    ],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// ADMIN: GET ALL ROOMS
export async function getAllRoomsAdmin(req, res) {
    try {
        const rooms = await ChatRoom.findAll({
            include: [
                {
                    model: ChatMember,
                    as: "members",
                    include: [{ model: User, as: "user", attributes: ["id", "name", "role"] }],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// GET MESSAGES FOR A ROOM
export async function getMessages(req, res) {
    const { roomId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    try {
        if (req.user.role !== "Admin") {
            const membership = await ChatMember.findOne({
                where: { room_id: roomId, user_id: req.user.id },
            });
            if (!membership) return res.status(403).json({ error: "Not a member" });
        }

        const messages = await Message.findAll({
            where: { room_id: roomId },
            include: [{ model: User, as: "sender", attributes: ["id", "name", "role"] }],
            order: [["sent_at", "DESC"]],   // newest first
            limit,
            offset,
        });

        res.json(messages.reverse());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



// GET OR CREATE DIRECT ROOM 
export async function getOrCreateDirect(req, res) {
    const myId = req.user.id;
    const { otherUserId } = req.body;
    if (!otherUserId) return res.status(400).json({ error: "otherUserId is required" });

    const t = await sequelize.transaction();
    try {
        const myRooms = await ChatMember.findAll({
            where: { user_id: myId },
            attributes: ["room_id"],
            transaction: t,
        });
        const myRoomIds = myRooms.map((m) => m.room_id);

        const shared = await ChatMember.findOne({
            where: { user_id: otherUserId, room_id: myRoomIds },
            include: [{ model: ChatRoom, where: { type: "direct" } }],
            transaction: t,
        });

        if (shared) {
            await t.commit();
            return res.json({ roomId: shared.room_id });
        }

        const room = await ChatRoom.create(
            { type: "direct", created_by: myId },
            { transaction: t }
        );

        await ChatMember.bulkCreate(
            [
                { room_id: room.id, user_id: myId, added_by: myId },
                { room_id: room.id, user_id: otherUserId, added_by: myId },
            ],
            { transaction: t }
        );

        await t.commit();
        res.json({ roomId: room.id });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
}

// ADMIN: CREATE GROUP 
export async function createGroup(req, res) {
    const { name, memberIds } = req.body;
    if (!name || !memberIds || memberIds.length === 0) {
        return res.status(400).json({ error: "Name and at least one member are required" });
    }

    const t = await sequelize.transaction();
    try {
        const room = await ChatRoom.create(
            { name, type: "group", created_by: req.user.id },
            { transaction: t }
        );

        const allIds = [...new Set([...memberIds, req.user.id])];
        await ChatMember.bulkCreate(
            allIds.map((uid) => ({ room_id: room.id, user_id: uid, added_by: req.user.id })),
            { transaction: t }
        );

        await t.commit();
        res.json({ roomId: room.id, name: room.name, type: "group" });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
}

// ADMIN: ADD MEMBER 
export async function addMember(req, res) {
    const { roomId } = req.params;
    const { userId } = req.body;
    try {
        await ChatMember.findOrCreate({
            where: { room_id: roomId, user_id: userId },
            defaults: { added_by: req.user.id },
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ADMIN: REMOVE MEMBER
export async function removeMember(req, res) {
    const { roomId, userId } = req.params;
    try {
        await ChatMember.destroy({ where: { room_id: roomId, user_id: userId } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// GET ROOM MEMBERS
export async function getRoomMembers(req, res) {
    const { roomId } = req.params;
    try {
        const members = await ChatMember.findAll({
            where: { room_id: roomId },
            include: [{ model: User, as: "user", attributes: ["id", "name", "role", "status"] }],
        });
        res.json(members.map((m) => m.user));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}