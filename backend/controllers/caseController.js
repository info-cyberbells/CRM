import jwt from "jsonwebtoken";
import Case from "../models/case.js";
import User from "../models/user.js";
import { col, fn, literal, Op, Sequelize, where } from 'sequelize';
import Notification from "../models/notification.js";
import sequelize from "../config/db.js";
import CaseCounter from "../models/caseCounter.js";


// Generate CaseID
export const generateCaseId = async (caseType) => {
    return await sequelize.transaction(async(t)=>{
        const counter = await CaseCounter.findOne({
            where: {caseType},
            lock: t.LOCK.UPDATE,
            transaction: t
        });

        if (!counter){
            throw new Error(`Invalid case type: ${caseType}`);
        }

        counter.caseNumber += 1;
        await counter.save({transaction: t});

        return `${caseType}-${String(counter.caseNumber).padStart(4,"0")}`;
    })
};

// preview caseID on UI
export const previewCaseID = async (req, res) => {
    try {
        const {caseType} = req.params;

        const ALLOWED_CASE_TYPES =  ["DIG", "CBH", "TD", "PWS", "NOSALE"];
        const normalizedCaseType = caseType?.toUpperCase();

        if(!ALLOWED_CASE_TYPES.includes(normalizedCaseType)){
            return res.status(400).json({success: false, message: "Invalid Case Type", allowedCaseTypes: ALLOWED_CASE_TYPES});
        }

        const counter = await CaseCounter.findOne({
            where: { caseType: normalizedCaseType}
        });

        if(!counter){
            return res.status(404).json({
                success: false,
                message: "Case counter not found"
            })
        }

        const nextNumber = (Number(counter.caseNumber) || 0) + 1;

        const previewCaseID = `${normalizedCaseType}-${String(nextNumber).padStart(4,"0")}`;

        return res.status(200).json({
            success: true,
            previewCaseID
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Failed to preview caseID"});
    }
}

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

        const { caseType, ...rest} = req.body;

        if(!caseType){
            return res.status(400).json({sucess: false, message: "CaseType is required!"});
        }

        const normalizedCaseType = caseType.toUpperCase();
        const ALLOWED_CASE_TYPES = ["DIG", "CBH", "TD", "PWS", "NOSALE"];

        if (!ALLOWED_CASE_TYPES.includes(normalizedCaseType)) {
        return res.status(400).json({
            success: false,
            message: "Invalid case type",
            allowedCaseTypes: ALLOWED_CASE_TYPES
        });
        }

        const caseId = await generateCaseId(normalizedCaseType);

        const newCase = await Case.create({
            ...rest,
            caseId,
            caseType,
            customerID: `CUST-${Date.now()}`,
            saleUserId: decoded.id,
        });

        await Notification.create({
            title: "New Case Created",
            message: `New ${caseType} case is created by `,
            type: "CASE_CREATED",
            caseId: newCase.id,
            caseDisplayId: newCase.caseId,
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
            id: c.id,
            caseId: c.caseId,
            caseType: c.caseType,
            customerName: c.customerName,
            caseDurationTimer: c.caseDurationTimer,
            email: c.email,
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
            // date: c.createdAt ? c.createdAt.toISOString().split("T")[0] : null,
            date: c.createdAt ? c.createdAt.toLocaleString("sv-SE",{timeZone: "Asia/Kolkata"}) : null,

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
            id: c.id,
            caseId: c.caseId,
            caseType: c.caseType,
            customerID : c.customerID,
            customerName: c.customerName,
            caseDurationTimer: c.caseDurationTimer,
            plan: c.plan,
            caseCreatedBy: c.saleUser?.name || "N/A",
            assignedTo: c.techUser?.name || "Unassigned",
            amount: c.amount || 0,
            deduction: c.deduction || 0,
            netAmount: (c.amount || 0) - (c.deduction || 0),
            planDuration: c.planDuration,
            saleAmount: c.saleAmount || 0,
            specialNotes: c.specialNotes || "N/A",
            saleStatus: c.saleStatus || "Pending",
            issueStatus: c.status || "Open",
            saleNoteType: c.saleNoteType,
            saleNoteText: c.saleNoteText || "",
            techNoteType: c.techNoteType,
            techNoteText: c.techNoteText || "",
            adminNoteType: c.adminNoteType,
            adminNoteText: c.adminNoteText || "",
            // date: c.createdAt ? c.createdAt.toISOString().split("T")[0] : null,
            // YYYY-MM-DD HH:mm:ss
            // date: c.createdAt ? c.createdAt.toLocaleString("sv-SE") : null,
            date: c.createdAt ? c.createdAt.toLocaleString("sv-SE",{timeZone: "Asia/Kolkata"}) : null,

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
            id: c.id,
            caseId: c.caseId,
            caseType: c.caseType,
            customerID: c.customerID,
            customerName: c.customerName,
            caseDurationTimer: c.caseDurationTimer,
            email: c.email,
            phone: c.phone,
            plan: c.plan,
            caseCreatedBy: c.saleUser?.name || "N/A",
            amount: c.amount || 0,
            deduction: c.deduction || 0,
            netAmount: (c.amount || 0) - (c.deduction || 0),
            planDuration: c.planDuration,
            saleAmount: c.saleAmount || 0,
            specialNotes: c.specialNotes || "N/A",
            saleStatus: c.saleStatus || "Pending",
            issueStatus: c.status || "Open",
            saleNoteType: c.saleNoteType,
            saleNoteText: c.saleNoteText || "",
            techNoteType: c.techNoteType,
            techNoteText: c.techNoteText || "",
            adminNoteType: c.adminNoteType,
            adminNoteText: c.adminNoteText || "",
            // date: c.createdAt ? c.createdAt.toISOString().split("T")[0] : null,
            // date: c.createdAt ? c.createdAt.toLocaleString("sv-SE") : null,
            date: c.createdAt ? c.createdAt.toLocaleString("sv-SE",{timeZone: "Asia/Kolkata"}) : null,

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
        const { caseId } = req.params;

        const token =
            req.cookies?.authToken ||
            req.headers.authorization?.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const oldCase = await Case.findOne({
            where: {caseId}
        });
        if (!oldCase) {
            return res.status(404).json({ success: false, message: "Case not found" });
        }

        const updatedData = { ...req.body };

        if(req.body.status === "Closed" && oldCase.status !== "Closed"){

            const inSeconds = Math.floor((new Date() - new Date(oldCase.createdAt)) / 1000);

            const day = Math.floor(inSeconds / 86400);
            const hours = Math.floor((inSeconds % 86400) / 3600);
            const minutes = Math.floor((inSeconds % 3600) / 60);
            const seconds = inSeconds % 60;

            updatedData.caseDurationTimer = `${day}D ${hours}H ${minutes}M ${seconds}S`;
        }

        const [rowsUpdated] = await Case.update(updatedData, { where: { caseId } });

        const updatedCase = await Case.findOne({
            where: {caseId},
            include: [
                { model: User, as: "saleUser", attributes: ["id", "name", "email"] },
                { model: User, as: "techUser", attributes: ["id", "name", "email"] },
            ],
        });

            if (
      req.body.techUserId &&
      req.body.techUserId !== oldCase.techUserId
    ) {
      // Tech notification
      await Notification.create({
        title: "Case Assigned",
        message: "A case has been assigned to you",
        type: "CASE_ASSIGNED",
        caseId: updatedCase.id,
        caseDisplayId: updatedCase.caseId, 
        recipientId: req.body.techUserId,
        actorId: decoded.id, // admin
      });

      // Sale notification
      await Notification.create({
        title: "Case Assigned",
        message: `Your case has been assigned to ${updatedCase.techUser?.name}`,
        type: "CASE_ASSIGNED",
        caseId: updatedCase.id,
         caseDisplayId: updatedCase.caseId, 
        recipientId: updatedCase.saleUserId,
        actorId: decoded.id,
      });
    }

    //ADMIN UPDATED CASE DETAILS (not assignment, not status change)
if (
  decoded.role === "Admin" &&
  !req.body.techUserId &&
   (!req.body.status || req.body.status === oldCase.status)
) {
  await Notification.create({
    title: "Case Details Updated",
    message: `Admin updated details for case ${updatedCase.caseId}`,
    type: "CASE_UPDATED",
    caseId: updatedCase.id,
    caseDisplayId: updatedCase.caseId,
    recipientId: updatedCase.saleUserId,
    actorId: decoded.id,
  });
   // Tech notification (only if assigned)
  if (updatedCase.techUserId) {
    await Notification.create({
      title: "Case Details Updated",
      message: `Admin updated details for case ${updatedCase.caseId}`,
      type: "CASE_UPDATED",
      caseId: updatedCase.id,
      caseDisplayId: updatedCase.caseId,
      recipientId: updatedCase.techUserId,
      actorId: decoded.id,
    });
  }  
}

// ADMIN CHANGED STATUS (notify Sale + Tech)
if (
  decoded.role === "Admin" &&
  req.body.status &&
  req.body.status !== oldCase.status
) {
  // Sale notification
  await Notification.create({
    title: "Case Status Updated",
    message: `Admin changed case ${updatedCase.caseId} status to ${req.body.status}`,
    type: "CASE_UPDATED",
    caseId: updatedCase.id,
    caseDisplayId: updatedCase.caseId,
    recipientId: updatedCase.saleUserId,
    actorId: decoded.id,
  });

  // Tech notification (only if assigned)
  if (updatedCase.techUserId) {
    await Notification.create({
      title: "Case Status Updated",
      message: `Admin changed case ${updatedCase.caseId} status to ${req.body.status}`,
      type: "CASE_UPDATED",
      caseId: updatedCase.id,
      caseDisplayId: updatedCase.caseId,
      recipientId: updatedCase.techUserId,
      actorId: decoded.id,
    });
  }
}


    // CASE STATUS UPDATED (Tech → Admin + Sale)
    if (
      req.body.status &&
      req.body.status !== oldCase.status &&
      req.body.status !== "Closed"
    ) {
      // Admin
      await Notification.create({
        title: "Case Updated",
        message: `Case status updated to ${req.body.status}`,
        type: "CASE_UPDATED",
        caseId: updatedCase.id,
         caseDisplayId: updatedCase.caseId, 
        actorId: decoded.id, // tech
      });

      // Sale
      await Notification.create({
        title: "Case Updated",
        message: `Your case status updated to ${req.body.status}`,
        type: "CASE_UPDATED",
        caseId: updatedCase.id,
         caseDisplayId: updatedCase.caseId, 
        recipientId: updatedCase.saleUserId,
        actorId: decoded.id,
      });
    }

    // CASE CLOSED NOTIFICATION (Tech → Admin + Sale)
    if (req.body.status === "Closed" && oldCase.status !== "Closed") {
      // Admin
      await Notification.create({
        title: "Case Closed",
        message: "A case has been closed",
        type: "CASE_CLOSED",
        caseId: updatedCase.id,
         caseDisplayId: updatedCase.caseId, 
        actorId: decoded.id,
      });

      // Sale
      await Notification.create({
        title: "Case Closed",
        message: "Your case has been closed successfully",
        type: "CASE_CLOSED",
        caseId: updatedCase.id,
         caseDisplayId: updatedCase.caseId, 
        recipientId: updatedCase.saleUserId,
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
        const { caseId } = req.params;
        const caseData = await Case.findOne( {
            where: {caseId},
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

        const whereCondition = {
            role: "Tech",
            isActive: true
        };

        // if(!keyword){
        //     return res.status(200).json({success: true, users:[]});
        // }

        if(keyword){
            whereCondition[Op.or] = [
                {name: {[Op.like]: `%${keyword}%`}},
                {id: {[Op.like]: `%${keyword}%`}},
                {email: {[Op.like]: `%${keyword}%`}}
            ];
        }

        const techUsers = await User.findAll({
            where: whereCondition,
            attributes: ["id", "name", "email"],
            limit: 20,
            order: [["name", "ASC"]]
        });
        res.status(200).json({
            success: true,
            users: techUsers,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch tech Users",
        });
    }
};

// Sales Reports Daily, weekly and monthly
export const saleReportGraph = async(req, res)=>{
    try {
        const token = req.cookies?.authToken || req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({success: false, message: "No token Provided"});
        }

        const {type = "daily"} = req.query;

        let attributes = [];
        let group = [];
        let order = [];
        let labelFormatter = () => {};

        let whereCondition = {};

        const now = new Date();

        if(type === "daily"){
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

	    whereCondition.createdAt = {
		    [Op.between]: [startOfDay, now]
	    };

        attributes = [
            [fn("HOUR", col("createdAt")), "hour"],
            [fn("COUNT", col("id")), "totalCases"],
            [fn("SUM", col("saleAmount")), "totalSales"]
        ];

        group = [fn("HOUR", col("createdAt"))];

        order = [[literal("hour"), "ASC"]];

        labelFormatter = d => `${String(d.get("hour")).padStart(2, "0")}:00`;

        } else if (type === "weekly"){
            attributes = [
                [fn("DATE", col("createdAt")), "label"],
                [fn("COUNT", col("id")), "totalCases"],
                [fn("SUM", col('saleAmount')), "totalSales"],
            ]

            whereCondition.createdAt = {
                [Op.gte]: fn("DATE_SUB", fn("CURDATE"), literal("INTERVAL 6 DAY"))
            };

            group = [fn("DATE", col("createdAt"))];
            order = [[literal("label"), "ASC"]];

            labelFormatter = d => d.get("label");

        }  else if (type === "monthly") {
            attributes = [
                [fn("DATE", col("createdAt")), "label"],
                [fn("COUNT", col("id")), "totalCases"],
                [fn("SUM", col("saleAmount")), "totalSales"]
            ];

            whereCondition.createdAt = {
                [Op.gte]: fn("DATE_SUB", fn("CURDATE"), literal("INTERVAL 29 DAY"))
            };

            group = [fn("DATE", col("createdAt"))];
            order = [[literal("label"), "ASC"]];

            labelFormatter = d => d.get("label");
            }

            else {
            return res.status(400).json({
                success: false,
                message: "Invalid type. Use daily | weekly | monthly"
            });
            }


        const data = await Case.findAll({
            attributes,
            where: whereCondition,
            group,
            order
        });

        const summary = await Case.findOne({
            attributes: [
                [fn("COUNT", col("id")), "totalCases"],
                [fn("SUM", col("saleAmount")), "totalSales"]
            ],
            where: whereCondition
        });

        res.json({
            success: true,
            data: {
                type,
            summary: {
                totalCases: Number(summary.get("totalCases")) || 0,
                totalSales: Number(summary.get("totalSales")) || 0
            },
            labels: data.map(labelFormatter),
            totalCases: data.map(d => Number(d.get("totalCases"))),
            totalSales: data.map(d => Number(d.get("totalSales")))
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: error.message,
        });
    }
}


// Summary avg time taken, sales, chargebacks
export const getOverallSummary = async (req, res) => {
  try {

    const token =
      req.cookies?.authToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token Provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only",
      });
    }

    const totalCases = await Case.count();

    const avgClosingTime = await Case.findOne({
      attributes: [
        [
          Sequelize.fn(
            "AVG",
            Sequelize.literal(
              "TIMESTAMPDIFF(MINUTE, createdAt, updatedAt)"
            )
          ),
          "avgMinutes",
        ],
      ],
      where: { status: "Closed" },
    });

    const salesSummary = await Case.findOne({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("saleAmount")), "totalSalesCases"],
        [Sequelize.fn("SUM", Sequelize.col("saleAmount")), "totalSalesAmount"],
      ],
      where: {
        saleAmount: {
          [Op.ne]: null,
          [Op.gt]: 0,
        },
      },
    });

    const chargebackSummary = await Case.findOne({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("id")), "chargebackCount"],
        [Sequelize.fn("SUM", Sequelize.col("chargeBack")), "totalChargebackAmount"],
        [Sequelize.fn("AVG", Sequelize.col("chargeBack")), "avgChargebackAmount"],
      ],
      where: {
        status: "Chargeback",
        chargeBack: {
          [Op.ne]: null,
          [Op.gt]: 0,
        },
      },
    });

    const totalSalesUsers = await User.count({
    where: { role: "Sale" },
    });

    const totalTechUsers = await User.count({
    where: { role: "Tech" },
    });

    const totalSalesCases = await Case.count({
    where: {
        saleUserId: {
        [Op.ne]: null,
        },
    },
    });

    const totalTechCases = await Case.count({
    where: {
        techUserId: {
        [Op.ne]: null,
        },
    },
    });

    const avgCasesPerSalesUser = totalSalesUsers > 0 ? (totalSalesCases / totalSalesUsers).toFixed(2) : "0.00";

    const avgCasesPerTechUser = totalTechUsers > 0 ? (totalTechCases / totalTechUsers).toFixed(2) : "0.00";


    return res.status(200).json({
      success: true,
      data: {
        totalCases,

        avgCloseTimeMinutes: Number(
          avgClosingTime?.dataValues?.avgMinutes || 0
        ).toFixed(2),

        sales: {
          totalCases: Number(
            salesSummary?.dataValues?.totalSalesCases || 0
          ),
          totalAmount: Number(
            salesSummary?.dataValues?.totalSalesAmount || 0
          ),
        },

        chargebacks: {
          count: Number(
            chargebackSummary?.dataValues?.chargebackCount || 0
          ),
          totalAmount: Number(
            chargebackSummary?.dataValues?.totalChargebackAmount || 0
          ),
          avgAmount: Number(
            chargebackSummary?.dataValues?.avgChargebackAmount || 0
          ).toFixed(2),
        },
        users: {
        sales: {
            totalUsers: totalSalesUsers,
            avgCasesPerUser: avgCasesPerSalesUser,
        },
        tech: {
            totalUsers: totalTechUsers,
            avgCasesPerUser: avgCasesPerTechUser,
        },
        },
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};