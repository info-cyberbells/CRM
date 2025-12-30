import jwt from "jsonwebtoken";
import Case from "../models/case.js";
import User from "../models/user.js";
import { Op } from 'sequelize';


// Create new case
export const createCase = async (req, res) => {
    try {
        const token =
            req.cookies?.authToken ||
            req.headers.authorization?.split(" ")[1] ||
            req.headers.authtoken;

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const newCase = await Case.create({
            ...req.body,
            customerID: `CUST-${Date.now()}`,
            saleUserId: decoded.id,
        });

        res.status(201).json({ success: true, case: newCase });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create case",
            error,
        });
    }
};


// Get all cases (Admin)
export const getAllCases = async (req, res) => {
    try {
        const cases = await Case.findAll({
            include: [
                { model: User, as: "saleUser", attributes: ["id", "name", "email"] },
                { model: User, as: "techUser", attributes: ["id", "name", "email"] },
            ],
        });
        res.json({ success: true, cases });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch cases", error });
    }
};

// Get cases by Sale User
// export const getMyCases = async (req, res) => {
//     try {
//         const token =
//             req.cookies?.authToken ||
//             req.headers.authorization?.split(" ")[1] ||
//             req.headers.authtoken;

//         if (!token) {
//             return res.status(401).json({ success: false, message: "No token provided" });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const userId = decoded.id;

//         const cases = await Case.findAll({
//             where: { saleUserId: userId },
//             include: [
//                 { model: User, as: "techUser", attributes: ["id", "name"] },
//                 { model: User, as: "saleUser", attributes: ["id", "name"] },
//             ],
//         });

//         // Transform into custom response
//         const formattedCases = cases.map((c) => ({
//             caseId: c.id,
//             customerName: c.customerName,   // <-- make sure this field exists in Case model
//             plan: c.plan,                   // <-- field in Case model
//             caseCreatedBy: c.saleUser?.name || "N/A",
//             assignedTo: c.techUser?.name || "Unassigned",
//             amount: c.amount || 0,
//             deduction: c.deduction || 0,
//             netAmount: (c.amount || 0) - (c.deduction || 0),
//             saleAmount: c.saleAmount || 0,
//             saleStatus: c.saleStatus || "Pending",
//             issueStatus: c.status || "Open",
//             date: c.createdAt ? c.createdAt.toISOString().split("T")[0] : null,
//         }));

//         res.json({ success: true, cases: formattedCases });
//     } catch (error) {
//         console.error("Error fetching cases:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch user's cases",
//             error,
//         });
//     }
// };

export const getMyCases = async (req, res) => {
    try {
        const token =
            req.cookies?.authToken ||
            req.headers.authorization?.split(" ")[1] ||
            req.headers.authtoken;

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const status = req.query.status ? req.query.status.trim() : "";

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const search = req.query.search ? req.query.search.trim() : "";
        const customerName = req.query.customerName ? req.query.customerName.trim() : "";
        const customerID = req.query.customerID ? req.query.customerID.trim() : "";
        const email = req.query.email ? req.query.email.trim() : "";
        const phone = req.query.phone ? req.query.phone.trim() : "";

        let where = { saleUserId: userId };

        const searchConditions = [];

        if (search) {
            searchConditions.push(
                { customerID: { [Op.like]: `%${search}%` } },
                { customerName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } }
            );
        }

        if (customerName) {
            searchConditions.push({ customerName: { [Op.like]: `%${customerName}%` } });
        }
        if (customerID) {
            searchConditions.push({ customerID: { [Op.like]: `%${customerID}%` } });
        }
        if (email) {
            searchConditions.push({ email: { [Op.like]: `%${email}%` } });
        }
        if (phone) {
            searchConditions.push({ phone: { [Op.like]: `%${phone}%` } });
        }


        if (searchConditions.length > 0) {
            where = {
                ...where,
                [Op.or]: searchConditions,
            };
        }
        if (status) {
            if (status === "ongoing") {
                where = { ...where, status: "Open" };
            } else {
                where = { ...where, status };
            }
        }



        const { rows: cases, count } = await Case.findAndCountAll({
            where,
            include: [
                { model: User, as: "techUser", attributes: ["id", "name"] },
                { model: User, as: "saleUser", attributes: ["id", "name"] },
            ],
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });


        const formattedCases = cases.map((c) => ({
            caseId: c.id,
            customerName: c.customerName,
            plan: c.plan,
            caseCreatedBy: c.saleUser?.name || "N/A",
            assignedTo: c.techUser?.name || "Unassigned",
            amount: c.amount || 0,
            deduction: c.deduction || 0,
            netAmount: (c.amount || 0) - (c.deduction || 0),
            saleAmount: c.saleAmount || 0,
            saleStatus: c.saleStatus || "Pending",
            issueStatus: c.status || "Open",
            date: c.createdAt ? c.createdAt.toISOString().split("T")[0] : null,
        }));

        res.json({
            success: true,
            cases: formattedCases,
            pagination: {
                total: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                pageSize: limit,
            },
        });
    } catch (error) {
        console.error("Error fetching cases:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user's cases",
            error: error.message,
        });
    }
};



// Update case status or other editable fields
export const updateCase = async (req, res) => {
    try {
        const { id } = req.params;

        const [rowsUpdated] = await Case.update(req.body, {
            where: { id },
        });

        if (rowsUpdated === 0) {
            return res.status(404).json({ success: false, message: "Case not found" });
        }

        const updatedCase = await Case.findByPk(id, {
            include: [
                { model: User, as: "saleUser", attributes: ["id", "name", "email"] },
                { model: User, as: "techUser", attributes: ["id", "name", "email"] },
            ],
        });

        res.json({ success: true, case: updatedCase });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update case", error });
    }
};

// Get case by ID
export const getCaseById = async (req, res) => {
    try {
        const { id } = req.params;
        const caseData = await Case.findByPk(id, {
            include: [
                { model: User, as: "saleUser", attributes: ["id", "name"] },
                { model: User, as: "techUser", attributes: ["id", "name"] },
            ],
        });
        res.json({ success: true, case: caseData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch case", error });
    }
};



