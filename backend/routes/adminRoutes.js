import express from "express";
import { createUser, getUsers, getUserById, createAgent, updateAgentDetails, viewAgentDetails, getAllAgents } from "../controllers/userController.js";
import roleGuard from "../middleware/roleGuard.js";
import { getDashboardData } from "../controllers/dashbaordController.js";
import { getAllCases, getCaseById, getOverallSummary, saleReportGraph, searchTechUser, updateCase } from "../controllers/caseController.js";
import { createAdminNotice, deleteAdminNotice, getAllAdminNotices, updateAdminNotice } from "../controllers/noticeController.js";
import { getAdminNotifications } from "../controllers/notificationController.js";


const router = express.Router();

router.use(roleGuard("Admin"));

router.get("/dashboard", getDashboardData);

router.get('/all-cases', getAllCases);
router.get('/getCaseByID/:caseId', getCaseById);
router.put('/updateCase/:caseId', updateCase);

// search for tech user to assign in case
router.get('/searchTechUser', searchTechUser);



// notice routes
router.post("/notice", createAdminNotice);
router.put("/notice/:id", updateAdminNotice);
router.delete("/notice/:id", deleteAdminNotice);
router.get("/notices", getAllAdminNotices);


// notifications route
router.get("/notifications", getAdminNotifications);


// Sales Report 
router.get("/sale-report", saleReportGraph);
router.get("/overAllSummary", getOverallSummary);


//create user route
router.post("/createUser", createUser);
router.get("/getUsers", getUsers);
router.get("/getUser/:id", getUserById);


//AGENTS ROUTES
router.post("/createAgent", createAgent);
router.put("/updateAgent/:id", updateAgentDetails);
router.get("/getAgent/:id", viewAgentDetails);
router.get("/getAllAgents", getAllAgents);

export default router;
