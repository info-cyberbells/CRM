import jwt from "jsonwebtoken"
import User from "../models/user.js";
import bcrypt from "bcrypt";
import ActivityLog from "../models/activitylogs.js";

// Login controller
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const { id, name, role } = user;

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
        );

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        if (user.role !== "Admin") {
            await ActivityLog.create({
                userId: user.id,
                userRole: user.role,
                action: "LOGIN",
                entityType: "auth",
                description: `${user.name} logged in.`,
            });
        }

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id,
                name,
                email,
                role
            },

        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


//logout
export const logoutUser = async (req, res) => {
    try {
        console.log("REQ.USER:", req.user);
        if (req.user && req.user.role !== "Admin") {
            await ActivityLog.create({
                userId: req.user.id,
                userRole: req.user.role,
                action: "LOGOUT",
                entityType: "auth",
                description: `User logged out.`,
            
            });
        }
        res.clearCookie('authToken');

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};