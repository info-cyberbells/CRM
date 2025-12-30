import express from "express";
import { createUser, getUsers, getUserById } from "../controllers/userController.js";
import roleGuard from "../middleware/roleGuard.js";


const router = express.Router();

router.use(roleGuard("Admin"));

//create user route
router.post("/createUser", createUser);
router.get("/getUsers", getUsers);
router.get("/getUser/:id", getUserById);

export default router;
