import express from "express";
import {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
} from "../controllers/customerController.js";

const router = express.Router();

router.post("/createCustomer", createCustomer);         //create customer
router.get("/getAllCustomers", getCustomers);           //get all customer
router.get("/getCustomerById/:id", getCustomerById);    //get customer by id
router.put("/updateCustomer/:id", updateCustomer);      //update customer by id
router.delete("deleteCustomer/:id", deleteCustomer);    //delete customer

export default router;
