import jwt from "jsonwebtoken";
import Case from "../models/case.js";
import User from "../models/user.js";
import { Op } from 'sequelize';


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
                     limit: 50,                          
                        order: [["createdAt", "DESC"]],
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


