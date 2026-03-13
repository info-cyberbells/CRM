import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import sequelize from "./config/db.js";
import saleRoutes from "./routes/saleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import techRoutes from "./routes/techRoutes.js"
import sessionRoutes from "./routes/userSessionRoutes.js"

import authGuard from "./middleware/authGuard.js";
import User from "./models/user.js";
import CaseNote from "./models/casenotes.js";
import UserSession from "./models/UserSession.js";
import "./models/planUpgrade.js";
import "./models/attendance.js";


dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

// Database connection
sequelize.sync({ alter: false }).then(() => {
  console.log("✅ Database connected and all tables synced");
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => {
  console.error("❌ Database connection failed:", err);
});