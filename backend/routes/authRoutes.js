import express from "express";
import { createUser, getUsers, getUserById } from "../controllers/userController.js";
import { loginUser, logoutUser } from "../controllers/loginController.js";
import authGuard from "../middleware/authGuard.js";

const router = express.Router();

//login user route 
router.post("/login", loginUser);

//logout
router.post('/logout', authGuard, logoutUser);


export default router;