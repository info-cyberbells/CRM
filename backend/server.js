import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import sequelize from "./config/db.js";
import saleRoutes from "./routes/saleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import techRoutes from "./routes/techRoutes.js"

import authGuard from "./middleware/authGuard.js";
import User from "./models/user.js";
import CaseNote from "./models/casenotes.js";


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

// Routes
app.use("/api/auth", authRoutes);

app.use("/api", authGuard);
app.use("/api/sale-user", saleRoutes);
app.use("/api/tech-user", techRoutes);
// app.use("/api/customers", customerRoutes);
app.use("/api/admin", adminRoutes);

// Database connection
sequelize.authenticate().then(() => {
    console.log("✅ Database connected");
}).catch(err => {
    console.error("❌ Database connection failed:", err);
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
