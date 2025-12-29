import Customer from "../models/customer.js";
import { v4 as uuidv4 } from "uuid";


export const createCustomer = async (req, res) => {
    try {
        const { name, phone, altPhone, email, address, city, state, country } = req.body;

        const customerID = "CUST-" + uuidv4().slice(0, 8).toUpperCase();

        const newCustomer = await Customer.create({
            customerID,
            name,
            phone,
            altPhone,
            email,
            address,
            city,
            state,
            country,
        });

        res.status(201).json({ success: true, customer: newCustomer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create customer", error: error.message });
    }
};

export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json({ success: true, customers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch customers", error: error.message });
    }
};

export const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);
        if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });

        res.json({ success: true, customer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch customer", error: error.message });
    }
};

export const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Customer.update(req.body, { where: { id } });

        if (!updated) return res.status(404).json({ success: false, message: "Customer not found" });

        const updatedCustomer = await Customer.findByPk(id);
        res.json({ success: true, customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update customer", error: error.message });
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Customer.destroy({ where: { id } });

        if (!deleted) return res.status(404).json({ success: false, message: "Customer not found" });

        res.json({ success: true, message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete customer", error: error.message });
    }
};
