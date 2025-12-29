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



//Get dashboard data of user/admin
export const getDashboardData = async (req, res) => {
    try {

        const token = req.headers.authtoken || req.cookies.authToken;

        if (token) {
            // ✅ Verify JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;
            const userRole = decoded.role;

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const endOfToday = new Date(startOfToday);
            endOfToday.setDate(endOfToday.getDate() + 1);

            // Fetch user details
            const user = await User.findByPk(userId, {
                attributes: { exclude: ["password"] },
            });

            //If user doesn't exist, clear the invalid cookie
            if (!user) {
                console.log("❌ User not found for token ID:", userId, "- Clearing cookie");
                res.clearCookie('authToken');
                return res.status(401).json({
                    message: "User not found. Please login again.",
                    action: "REDIRECT_TO_LOGIN"
                });
            }

            //admin dashboard
            if (userRole === "Admin") {
                const allCases = await Case.findAll({
                    include: [
                        { model: User, as: "saleUser", attributes: ["id", "name", "email"] },
                        { model: User, as: "techUser", attributes: ["id", "name", "email"] },
                    ],
                });

                // 📊 Monthly sales - use the specific query result
                const monthlySales = await Case.findAll({
                    where: {
                        createdAt: { [Op.gte]: startOfMonth }
                    }
                });

                // 💰 Today's refunds - use the specific query result
                const todayRefunds = await Case.findAll({
                    where: {
                        createdAt: { [Op.gte]: startOfToday, [Op.lt]: endOfToday },
                        status: 'Refunded'
                    }
                });

                return res.json({
                    user,
                    totalCases: allCases.length,
                    totalSales: allCases.reduce((sum, c) => sum + c.saleAmount, 0),
                    monthlySales: monthlySales.reduce((sum, c) => sum + c.saleAmount, 0), // ✅ Use monthlySales query
                    todayRefunds: todayRefunds.reduce((sum, c) => sum + c.saleAmount, 0), // ✅ Use todayRefunds query
                    cases: allCases,
                });
            }

            if (userRole === "Sale") {
                // Get all cases created by this sale user
                const saleCases = await Case.findAll({
                    where: { saleUserId: userId },
                });

                // Cases created today
                const todayCases = saleCases.filter(c =>
                    new Date(c.createdAt) >= startOfToday && new Date(c.createdAt) < endOfToday
                );

                // Cases created this month
                const monthlyCases = saleCases.filter(c => new Date(c.createdAt) >= startOfMonth);

                // Previous month calculation
                const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                const prevMonthlyCases = saleCases.filter(c =>
                    new Date(c.createdAt) >= startOfPrevMonth && new Date(c.createdAt) <= endOfPrevMonth
                );

                const todaySales = todayCases.reduce((sum, c) => sum + c.saleAmount, 0);
                const monthlySales = monthlyCases.reduce((sum, c) => sum + c.saleAmount, 0);
                const prevMonthlySales = prevMonthlyCases.reduce((sum, c) => sum + c.saleAmount, 0);

                return res.json({
                    user,
                    // Today's metrics
                    todayCases: todayCases.length,
                    todaySales: todaySales,

                    // This month's metrics
                    monthlyCases: monthlyCases.length,
                    monthlySales: monthlySales,

                    // Previous month comparison
                    prevMonthlyCases: prevMonthlyCases.length,
                    prevMonthlySales: prevMonthlySales,

                    // Comparison percentages
                    casesGrowth: prevMonthlyCases.length > 0 ?
                        ((monthlyCases.length - prevMonthlyCases.length) / prevMonthlyCases.length * 100).toFixed(2) : 0,
                    salesGrowth: prevMonthlySales > 0 ?
                        ((monthlySales - prevMonthlySales) / prevMonthlySales * 100).toFixed(2) : 0,

                    cases: saleCases,
                });
            }

            if (userRole === "Tech") {
                const techCases = await Case.findAll({
                    where: { techUserId: userId },
                });

                // Group cases by status
                const casesByStatus = techCases.reduce((acc, case_) => {
                    const status = case_.status || 'Unknown';
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                }, {});

                // Common status counts (adjust status names based on your Case model)
                const statusCounts = {
                    total: techCases.length,
                    open: casesByStatus['Open'] || 0,
                    pending: casesByStatus['Pending'] || 0,
                    inProgress: casesByStatus['In Progress'] || 0,
                    closed: casesByStatus['Closed'] || 0,
                    resolved: casesByStatus['Resolved'] || 0,
                    refunded: casesByStatus['Refunded'] || 0,
                    // Add other statuses as needed
                };

                return res.json({
                    user,
                    totalAssignedCases: techCases.length,
                    statusCounts: statusCounts,
                    casesByStatus: casesByStatus, // Full breakdown of all statuses
                    cases: techCases,
                });
            }

            if (userRole === "Tech_Lead") {
                const techCases = await Case.findAll({
                    where: { techUserId: userId },
                });

                return res.json({
                    user,
                    totalCases: techCases.length,
                    totalSales: techCases.reduce((sum, c) => sum + c.saleAmount, 0),
                    monthlySales: techCases.filter(c => new Date(c.createdAt) >= startOfMonth).reduce((sum, c) => sum + c.saleAmount, 0),
                    todayRefunds: techCases.filter(c => new Date(c.createdAt) >= startOfToday && c.status === 'Refunded').reduce((sum, c) => sum + c.saleAmount, 0),
                    cases: techCases,
                });
            }

            return res.json({ user, message: "No specific dashboard for this role" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


