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


const router = express.Router();
router.use(roleGuard("Tech"));


router.get("/dashboard", getDashboardData);


// router.post("/createCustomer", createCustomer);         //create customer
// router.get("/getAllCustomers", getCustomers);           //get all customer
// router.get("/getCustomerById/:id", getCustomerById);    //get customer by id
// router.put("/updateCustomer/:id", updateCustomer);      //update customer by id
// router.delete("deleteCustomer/:id", deleteCustomer);    //delete customer

export default router;
