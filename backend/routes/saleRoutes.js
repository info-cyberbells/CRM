import express from "express";
import { createCase, getAllCases, getMyCases, updateCase, getCaseById, previewCaseID } from "../controllers/caseController.js";
import { getDashboardData } from "../controllers/dashbaordController.js";
import roleGuard from "../middleware/roleGuard.js";
import { getNotifications } from "../controllers/notificationController.js";

const router = express.Router();

router.use(roleGuard("Sale"));

// Sale user endpoints
router.post("/createNewCase", createCase);            // Create new case
router.get("/saleUser", getMyCases); // Get all cases for a specific Sale user
router.get("/getAllCases", getAllCases);
router.get("/getCaseById/:caseId", getCaseById);
router.put("/updateCase/:caseId", updateCase);

// preveiw case ID
router.get("/previewCaseId/:caseType", previewCaseID);

//dashbaord data
router.get("/dashboard", getDashboardData);

//notifications
router.get("/notifications", getNotifications);

export default router;
