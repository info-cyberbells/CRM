import express from "express";
import { createUser, getUsers, getUserById } from "../controllers/userController.js";
import { loginUser, logoutUser } from "../controllers/loginController.js";

const router = express.Router();

//login user route 
router.post("/login", loginUser);

//logout
router.post('/logout', logoutUser);


export default router;