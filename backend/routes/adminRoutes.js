import express from "express";
import { createUser, getUsers, getUserById } from "../controllers/userController.js";
import roleGuard from "../middleware/roleGuard.js";
import { getDashboardData } from "../controllers/dashbaordController.js";
import { getAllCases, getCaseById, searchTechUser, updateCase } from "../controllers/caseController.js";
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


//create user route
router.post("/createUser", createUser);
router.get("/getUsers", getUsers);
router.get("/getUser/:id", getUserById);

export default router;
