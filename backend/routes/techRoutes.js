import express from "express";
import roleGuard from "../middleware/roleGuard.js";
import {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
} from "../controllers/customerController.js";
import { getDashboardData } from "../controllers/dashbaordController.js";
import { getAssignedCases, getCaseById, updateCase } from "../controllers/caseController.js";
import { getTechUserNotifications } from "../controllers/notificationController.js";


const router = express.Router();
router.use(roleGuard("Tech"));


router.get("/dashboard", getDashboardData);
router.get('/my-cases', getAssignedCases);
router.get('/getCaseByID/:caseId', getCaseById);
router.put('/updateCase/:caseId', updateCase);


router.get('/notifications', getTechUserNotifications);


// router.post("/createCustomer", createCustomer);         //create customer
// router.get("/getAllCustomers", getCustomers);           //get all customer
// router.get("/getCustomerById/:id", getCustomerById);    //get customer by id
// router.put("/updateCustomer/:id", updateCustomer);      //update customer by id
// router.delete("deleteCustomer/:id", deleteCustomer);    //delete customer

export default router;
