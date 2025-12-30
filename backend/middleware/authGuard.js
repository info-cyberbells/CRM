import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authGuard = async (req, res, next) => {
    try {
        const token = req.cookies?.authToken;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            res.clearCookie("authToken");
            return res.status(401).json({ message: "Session expired" });
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
