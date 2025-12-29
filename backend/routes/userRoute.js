import express from "express";
import { createUser, getUsers, getUserById } from "../controllers/userController.js";
import { loginUser, verifyToken, logoutUser } from "../controllers/loginController.js";

const router = express.Router();

//login user route 
router.post("/login", loginUser);

//verify token
router.get('/verifyToken', verifyToken);

//logout
router.post('/logout', logoutUser);


//create user route
router.post("/createUser", createUser);
router.get("/getUsers", getUsers);
router.get("/getUser/:id", getUserById);

export default router;
