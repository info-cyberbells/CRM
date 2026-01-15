import jwt from "jsonwebtoken";
import Case from "../models/case.js";
import User from "../models/user.js";
import { Op } from 'sequelize';
import Notification from "../models/notification.js";


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

        await Notification.create({
            title: "New Case Created",
            message: "New case created by Sale user",
            type: "NEW_CASE",
            caseId: newCase.id,
            actorId: decoded.id,
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

// export const getAllCases = async (req, res) => {
//     try {
//         const cases = await Case.findAll({
//             include: [
//                 { model: User, as: "saleUser", attributes: ["id", "name", "email"] },
//                 { model: User, as: "techUser", attributes: ["id", "name", "email"] },
//             ],
//         });
//         res.json({ success: true, cases });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Failed to fetch cases", error });
//     }
// };


// Get all cases (Admin)
export const getAllCases = async (req, res) => {
    try {
        const token = req.cookies?.authToken || req.headers.authorization?.split(" ")[1] || req.headers.authToken;

        if(!token){
            return res.status(401).json({success: false, message: "No token Provided"});
        }


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
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        let where = {};

        const searchConditions = [];

        if(search){
            searchConditions.push(
                { customerName: { [Op.like] : `%${search}%`}},
                { customerID: {[  Op.like] : `%${search}%`}},
                { email: {[Op.like] : `%${search}%`}},
                { phone : { [Op.like] : `%${search}%`}},
            )
        }
         if (customerName) {
            searchConditions.push({ customerName: { [Op.like]: `%${customerName}%` } });
        }
        if(customerID){
            searchConditions.push({customerID: { [Op.like]: `%${customerID}%`}});
        }
        if(email){
            searchConditions.push({email: { [Op.like]: `%${email}%`}});
        }
        if(phone){
            searchConditions.push({phone: { [Op.like] :  `%${phone}%`}});
        }
        if(startDate && endDate){
            where.createdAt = {
                [Op.between] : [new Date(`${startDate}T00:00:00.000Z`),
                    new Date(`${endDate}T23:59:59.999Z`),
                ],
            };
        } else if (startDate) {
        where.createdAt = {
            [Op.gte]: new Date(`${startDate}T00:00:00.000Z`),
        };
        } else if (endDate) {
        where.createdAt = {
            [Op.lte]: new Date(`${endDate}T23:59:59.999Z`),
        };
        }

         if (searchConditions.length > 0) {
            where = {
                ...where,
                [Op.or]: searchConditions,
            };
        }



        const { rows: cases, count } = await Case.findAndCountAll({
            where,
            include: [
                { model: User, as: "saleUser", attributes: ["id", "name", "email"] },
                { model: User, as: "techUser", attributes: ["id", "name", "email"] },
            ],
             limit,
            offset,
            order: [["createdAt", "DESC"]],
        });

        const formattedCases = cases.map((c) => ({
            caseId: c.id,
            customerName: c.customerName,
            customerID: c.customerID,
            plan: c.plan,
            caseCreatedBy: c.saleUser?.name || "N/A",
            assignedTo: c.techUser?.name || "Unassigned",
            amount: c.amount || 0,
            deduction: c.deduction || 0,
            netAmount: (c.amount || 0) - (c.deduction || 0),
            saleAmount: c.saleAmount || 0,
            specialNotes: c.specialNotes || "N/A",
            saleStatus: c.saleStatus || "Pending",
            issueStatus: c.status || "Open",
            date: c.createdAt ? c.createdAt.toISOString().split("T")[0] : null,
        }));



        res.json({ success: true,
             pagination: {
                total: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                pageSize: limit,
            },
            cases: formattedCases,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch cases", error });
    }
};


// get cases (Sale User)
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
            specialNotes: c.specialNotes || "N/A",
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

// get Assigned cases for (tech user) 
export const getAssignedCases = async (req, res)=>{
    try {
        const token = req.cookies?.authToken || req.headers.authorization.split(" ")[1] || req.headers.authToken;

        if(!token){
            return res.status(401).json({success: false, message: "No token Provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const status = req.query.status ? req.query.status.trim() : "";


        const search = req.query.search ? req.query.search.trim() : "";
        const customerName = req.query.customerName ? req.query.customerName.trim() : "";
        const customerID = req.query.customerID ? req.query.customerID.trim() : "";
        const email = req.query.email ? req.query.email.trim() : "";
        const phone = req.query.phone ? req.query.phone.trim() : "";


        let where = {techUserId: userId};

        const searchConditions = [];

        if(search){
            searchConditions.push(
                {customerID: {[Op.like]: `%${search}%`}},
                {customerName: { [Op.like]: `%${search}%`}},
                { email : { [Op.like]: `%${search}%`}},
                {phone: {[Op.like]: `%${search}%`}}
            );
        }

        
        if(customerName){
            searchConditions.push({customerName: { [Op.like]: `%${customerName}%` }});
        }
        if(customerID){
            searchConditions.push({customerID: { [Op.like]: `%${customerID}%` }});
        }
        if(email){
            searchConditions.push({email: { [Op.like]: `%${email}%` }});
        }
        if(phone){
            searchConditions.push({phone: {[Op.like]: `%${phone}%`}});
        }

        if(searchConditions.length > 0){
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

        const {rows: cases, count} = await Case.findAndCountAll({
            where,
            include: [
                {model: User, as: 'techUser', attributes: ["id", 'name']},
                {model: User, as: 'saleUser', attributes: ["id", "name"]},
            ],
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });

        const formattedCases = cases.map((c)=>({
            caseId: c.id,
            customerID: c.customerID,
            customerName: c.customerName,
            email: c.email,
            phone: c.phone,
            plan: c.plan,
            caseCreatedBy: c.saleUser?.name || "N/A",
            amount: c.amount || 0,
            deduction: c.deduction || 0,
            netAmount: (c.amount || 0) - (c.deduction || 0),
            saleAmount: c.saleAmount || 0,
            specialNotes: c.specialNotes || "N/A",
            saleStatus: c.saleStatus || "Pending",
            issueStatus: c.status || "Open",
            date: c.createdAt ? c.createdAt.toISOString().split("T")[0] : null,

        }));

        res.json({
            success: true,
            pagination: {
                total: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                pageSize: limit,
            },
            cases: formattedCases, 
        });
    } catch (error) {
        
        console.error("Error fetching casese: ", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user's cases",
            error: error.message,
        });
    }
}


// Update case status or other editable fields
export const updateCase = async (req, res) => {
    try {
        const { id } = req.params;

        const token =
            req.cookies?.authToken ||
            req.headers.authorization?.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const oldCase = await Case.findByPk(id);
        if (!oldCase) {
            return res.status(404).json({ success: false, message: "Case not found" });
        }

        const [rowsUpdated] = await Case.update(req.body, { where: { id } });

        const updatedCase = await Case.findByPk(id, {
            include: [
                { model: User, as: "saleUser", attributes: ["id", "name", "email"] },
                { model: User, as: "techUser", attributes: ["id", "name", "email"] },
            ],
        });

        if (updatedCase.saleUserId) {
            await Notification.create({
                title: "Case Updated",
                message: "Admin updated your case",
                type: "CASE_UPDATED",
                caseId: updatedCase.id,
                actorId: decoded.id,
            });

        }

        if (
            req.body.techUserId &&
            req.body.techUserId !== oldCase.techUserId
        ) {
            await Notification.create({
                title: "New Case Assigned",
                message: "A case has been assigned to you",
                type: "CASE_ASSIGNED",
                caseId: updatedCase.id,
                recipientId: req.body.techUserId,
                actorId: decoded.id,
            });
        }

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

// Search tech user 
export const searchTechUser = async (req, res)=>{
    try {
        const token = req.cookies?.authToken || req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({success: false, message: "No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const keyword = req.query.keyword ? req.query.keyword?.trim() : "";

        if(!keyword){
            return res.status(200).json({success: true, users:[]});
        }

        const techUsers = await User.findAll({
            where: {
                role: "Tech",
                isActive: true,
                [Op.or]: [ 
                    {name: {[Op.like]: `%${keyword}%`}},
                    {id: {[Op.like]: `%${keyword}%`}},
            ]
            },
            attributes: ["id", "name", "email"],
            limit: 10,
            order: [["name", "ASC"]]
        });

        res.status(200).json({
            success: true,
            users: techUsers,
        })

    } catch (error) {
        res.status(500).json({
            success: true,
            message: "Failed to fetch tech Users",
        });
    }
};