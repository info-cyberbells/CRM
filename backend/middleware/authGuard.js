import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authGuard = async (req, res, next) => {
    try {
        const token = req.cookies?.authToken;

        if (!token) {
            return res.status(401).json({error: "AUTH_ERROR", code: "TOKEN_MISSING", message: "Unauthorized" });
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                error: "AUTH_ERROR",
                code: "TOKEN_EXPIRED",
                message: "Session expired. Please login again."
            });
        }

        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            res.clearCookie("authToken");
            return res.status(401).json({error: "AUTH_ERROR",code: "USER_NOT_FOUND", message: "Session expired" });
        }

        req.user = {
            id: user.id,
            role: decoded.role,
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default authGuard;
