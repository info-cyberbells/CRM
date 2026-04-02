import express from "express";
import { createUser, getUsers, getUserById, createAgent, updateAgentDetails, viewAgentDetails, getAllAgents } from "../controllers/userController.js";
import roleGuard from "../middleware/roleGuard.js";
import { getAgentsMonitor, getDashboardData } from "../controllers/dashbaordController.js";
import { addCaseNote, getAllCases, getCaseById, getCaseNotes, getOverallSummary, saleReportGraph, searchTechUser, updateCase } from "../controllers/caseController.js";
import { createAdminNotice, deleteAdminNotice, getAllAdminNotices, updateAdminNotice } from "../controllers/noticeController.js";
import { getAdminNotifications } from "../controllers/notificationController.js";
import { addPlanUpgrade, getPlanUpgrades } from "../controllers/planUpgradeController.js";
import { markAttendance, getMonthlyAttendanceAdmin, getDailyAttendanceAdmin } from "../controllers/attendanceController.js";
import { getActivityLogs } from "../controllers/activitylogController.js";




const router = express.Router();

router.use(roleGuard("Admin"));

router.get("/dashboard", getDashboardData);
router.get("/get-agent/status", getAgentsMonitor);

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

// admin note
router.post("/createNote/:caseId", addCaseNote);
router.get('/getCaseNotes/:caseId', getCaseNotes);

router.post("/upgrade-plan/:caseId", addPlanUpgrade);
router.get("/get-plan/:caseId", getPlanUpgrades);

router.post("/attendance/mark", markAttendance);
router.get("/attendance/monthly", getMonthlyAttendanceAdmin);
router.get("/attendance/daily", getDailyAttendanceAdmin);

router.get('/activitylogs', getActivityLogs);

export default router;
