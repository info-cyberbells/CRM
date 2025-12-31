import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import sequelize from "./config/db.js";
import userRoutes from "./routes/adminRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/techRoutes.js"
import authGuard from "./middleware/authGuard.js";


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

// Routes
app.use("/api/auth", authRoutes);

app.use("/api", authGuard);
app.use("/api/sale-user", saleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);

// Database connection
sequelize.authenticate().then(() => {
    console.log("✅ Database connected");
}).catch(err => {
    console.error("❌ Database connection failed:", err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
