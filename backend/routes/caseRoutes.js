import express from "express";
import { createCase, getAllCases, getMyCases, getDashboardData, updateCase, getCaseById } from "../controllers/caseController.js";

const router = express.Router();

// Sale user endpoints
router.post("/createNewCase", createCase);            // Create new case
router.get("/saleUser", getMyCases); // Get all cases for a specific Sale user

// Admin or general endpoints
router.get("/getAllCases", getAllCases);            // Get all cases (Admin)
router.get("/getCaseById/:id", getCaseById);         // Get single case by ID
router.put("/updateCase/:id", updateCase);          // Update case

// get dashboard data
router.get("/dashboard", getDashboardData);

export default router;
