import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
    getAllUsers,
    getMyRooms,
    getMessages,
    getOrCreateDirect,
    createGroup,
    addMember,
    removeMember,
    getRoomMembers,
    getAllRoomsAdmin,
} from "../controllers/chatController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads/");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, unique + ext);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = [
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/plain",
            "application/zip",
        ];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("File type not allowed"), false);
        }
    }
});

// ALL ROLES can access these 
router.get("/users", getAllUsers);
router.get("/rooms", getMyRooms);
router.get("/rooms/:roomId/messages", getMessages);
router.get("/rooms/:roomId/members", getRoomMembers);
router.post("/rooms/direct", getOrCreateDirect);
router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file received" });
    res.json({
        url: `/uploads/${req.file.filename}`,
        filename: req.file.originalname,
    });
});

// ADMIN ONLY controller handles the role check internally 
router.post("/rooms", createGroup);
router.post("/rooms/:roomId/members", addMember);
router.delete("/rooms/:roomId/members/:userId", removeMember);
router.get("/admin/rooms", getAllRoomsAdmin);

export default router;