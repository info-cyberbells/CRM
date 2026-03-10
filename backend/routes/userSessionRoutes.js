import express from "express";
import { clockIn, ClockOut, endBreak, getMySessionStatus, startBreak } from "../controllers/userSessionController.js";


const router = express.Router();


router.post("/clockIn", clockIn);
router.post("/start-break", startBreak);
router.post("/end-break", endBreak);
router.post("/clock-out", ClockOut);
router.get("/get-my-session-status", getMySessionStatus);

export default router;