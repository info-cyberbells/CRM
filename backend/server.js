import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import sequelize from "./config/db.js";
import saleRoutes from "./routes/saleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import techRoutes from "./routes/techRoutes.js"
import sessionRoutes from "./routes/userSessionRoutes.js"
import chatRoutes from "./routes/chatRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";


import authGuard from "./middleware/authGuard.js";
import User from "./models/user.js";
import CaseNote from "./models/casenotes.js";
import UserSession from "./models/UserSession.js";
import ChatRoom from "./models/ChatRoom.js";
import ChatMember from "./models/ChatMember.js";
import Message from "./models/Message.js";
import socketHandler from "./socket/socketHandler.js";
import cleanupJob from "./cron/cleanupOldMessages.js";
import "./models/planUpgrade.js";
import "./models/attendance.js";
import "./models/associations.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  }
});

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CaseNote → User
CaseNote.belongsTo(User, {
  foreignKey: "createdById",
  as: "creator"
});
// User → CaseNote
User.hasMany(CaseNote, {
  foreignKey: "createdById"
});
User.hasMany(UserSession, {
  foreignKey: "userId",
});
UserSession.belongsTo(User, {
  foreignKey: "userId",
});

// Routes
app.use("/api/auth", authRoutes);

app.use("/api", authGuard);
app.use("/api/sale-user", saleRoutes);
app.use("/api/tech-user", techRoutes);
// app.use("/api/customers", customerRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/user-session', sessionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/profile", profileRoutes);


socketHandler(io);
cleanupJob();

// Database connection
sequelize.sync({ alter: false }).then(() => {
  console.log("✅ Database connected and all tables synced");
  const PORT = process.env.PORT || 9000;
  server.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
}).catch(err => {
  console.error("❌ Database connection failed:", err);
});