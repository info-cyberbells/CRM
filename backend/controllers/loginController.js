import jwt from "jsonwebtoken"
import User from "../models/user.js";
import bcrypt from "bcrypt";

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

        const { id, name, role, phone, address, city, state, country } = user;

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

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


//verify token
export const verifyToken = async (req, res) => {
    try {
        const token = req.cookies.authToken;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const { id, name, email, role } = user;
        res.json({
            message: "Token valid",
            user: { id, name, email, role }
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

//logout
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('authToken');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};