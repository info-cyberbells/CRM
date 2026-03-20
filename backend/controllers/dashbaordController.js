import jwt from "jsonwebtoken";
import Case from "../models/case.js";
import User from "../models/user.js";
import { Op, where } from 'sequelize';
import AdminNotice from "../models/notice.js";
import UserSession from "../models/UserSession.js";
import Attendance from "../models/attendance.js";
import { Sequelize } from "sequelize";



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

        const totalCases = await Case.count();
        const totalSales = await Case.sum("saleAmount");
        const openCases = await Case.count({
          where: {
            status: 'Open',
          }
        });
        const closedCases = await Case.count({
          where: {
            status: 'Closed',
          }
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

        const todaySales = await Case.findAll({
          where: {
            createdAt: { [Op.gte]: startOfToday, [Op.lt]: endOfToday }
          }
        })

        const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const todayAttendance = await Attendance.findAll({
          where: { date: todayDate },
          include: [{ model: User, as: "user", attributes: ["id", "name", "role"] }]
        });
        const presentToday = todayAttendance.filter(a => ["P", "HD"].includes(a.status)).length;
        const totalActiveEmployees = await User.count({ where: { role: ["Sale", "Tech"] } });


        return res.json({
          user,
          totalCases: totalCases,
          // totalSales: allCases.reduce((sum, c) => sum + c.saleAmount, 0),
          totalSales: totalSales,
          monthlySales: monthlySales.reduce((sum, c) => sum + c.saleAmount, 0), // ✅ Use monthlySales query
          todayRefunds: todayRefunds.reduce((sum, c) => sum + c.saleAmount, 0), // ✅ Use todayRefunds query
          todaySales: todaySales.reduce((sum, c) => sum + c.saleAmount, 0),
          presentToday,
          totalActiveEmployees,
          openCases: openCases,
          closedCases: closedCases,
          cases: allCases,
        });
      }

      if (userRole === "Sale") {
        // Get all cases created by this sale user
        const saleCases = await Case.findAll({
          where: { saleUserId: userId },
        });

        const notices = await AdminNotice.findAll({
          where: {
            noticeType: {
              [Op.in]: ["SALE", "ALL"],
            },
            isActive: true,
          }
        })

        // Cases created today
        const todayCases = saleCases.filter(c =>
          new Date(c.createdAt) >= startOfToday && new Date(c.createdAt) < endOfToday
        );

        const openCases = saleCases.filter(c => c.status === "Open");

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

        const todayDateStr = startOfToday.toISOString().split("T")[0];
        const myAttendance = await Attendance.findOne({
          where: { userId, date: todayDateStr }
        });

        // Refund amount
        const refundChargebackTotal = saleCases.reduce((sum, c) => {
          if (c.status === "Refund") {
            return sum + (c.saleAmount || 0);
          }
          return sum + (c.chargeBack || 0);
        }, 0);

        return res.json({
          user,
          // admin notices
          notices,
          // Today's metrics
          todayCases: todayCases.length,
          todaySales: todaySales,

          // This month's metrics
          monthlyCases: monthlyCases.length,
          monthlySales: monthlySales,

          openCases: openCases.length,
          refundChargeBackAmount: refundChargebackTotal,

          // Previous month comparison
          prevMonthlyCases: prevMonthlyCases.length,
          prevMonthlySales: prevMonthlySales,

          // Comparison percentages
          casesGrowth: prevMonthlyCases.length > 0 ?
            ((monthlyCases.length - prevMonthlyCases.length) / prevMonthlyCases.length * 100).toFixed(2) : 0,
          salesGrowth: prevMonthlySales > 0 ?
            ((monthlySales - prevMonthlySales) / prevMonthlySales * 100).toFixed(2) : 0,
          myAttendance: myAttendance || null,
          cases: saleCases,
        });
      }

      if (userRole === "Tech") {
        const techCases = await Case.findAll({
          where: { techUserId: userId },
        });


        const todayDateStr = startOfToday.toISOString().split("T")[0];
        const myAttendance = await Attendance.findOne({
          where: { userId, date: todayDateStr }
        });
        const notices = await AdminNotice.findAll({
          where: {
            noticeType: {
              [Op.in]: ["Tech", "ALL"]
            },
            isActive: true,
          },
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
          notices,
          totalAssignedCases: techCases.length,
          statusCounts: statusCounts,
          casesByStatus: casesByStatus, // Full breakdown of all statuses
          myAttendance: myAttendance || null,
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



export const getAgentsMonitor = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const roles = ["Tech", "Sale"];

    const statsData = await User.findAll({
      attributes: [
        "role",
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      where: { role: roles },
      group: ["role", "status"],
      raw: true,
    });

    let stats = {
      totalAgents: 0,
      totalTech: 0,
      totalSale: 0,

      online: { total: 0, tech: 0, sale: 0 },
      offline: { total: 0, tech: 0, sale: 0 },
      onBreak: { total: 0, tech: 0, sale: 0 },
    };

    statsData.forEach((item) => {
      const role = item.role;
      const status = item.status;
      const count = parseInt(item.count);

      stats.totalAgents += count;

      if (role === "Tech") stats.totalTech += count;
      if (role === "Sale") stats.totalSale += count;

      if (status === "ONLINE") {
        stats.online.total += count;
        stats.online[role.toLowerCase()] += count;
      }

      if (status === "OFFLINE") {
        stats.offline.total += count;
        stats.offline[role.toLowerCase()] += count;
      }

      if (status === "ON_BREAK") {
        stats.onBreak.total += count;
        stats.onBreak[role.toLowerCase()] += count;
      }
    });

    const { rows, count } = await User.findAndCountAll({
      where: { role: roles },
      distinct: true, 
      col: 'id',
      attributes: ["id", "name", "role", "status"],

      include: [
        {
          model: UserSession,
          attributes: [
            "clockInTime",
            "clockOutTime",
            "breakStartTime",
            "totalBreakSeconds",
          ],
          required: false,
        },
      ],

      order: [
        [
          Sequelize.literal(`
      CASE 
        WHEN status = 'ON_BREAK' THEN 1
        WHEN status = 'ONLINE' THEN 2
        WHEN status = 'OFFLINE' THEN 3
      END
    `),
          "ASC",
        ],
        [{ model: UserSession }, "clockInTime", "DESC"],
      ],

      limit,
      offset,
    });

    const agents = rows.map((agent) => {
      let session = null;

      if (agent.status === "ONLINE" || agent.status === "ON_BREAK") {
        session = agent.UserSessions?.find((s) => s.clockOutTime === null);
      } else {
        session = agent.UserSessions?.sort(
          (a, b) => new Date(b.clockInTime) - new Date(a.clockInTime),
        )[0];
      }

      return {
        id: agent.id,
        name: agent.name,
        role: agent.role,
        status: agent.status,

        clockInTime: session?.clockInTime || null,
        clockOutTime: session?.clockOutTime || null,

        date: session?.clockInTime
          ? new Date(session.clockInTime).toISOString().split("T")[0]
          : null,

        breakStartTime: session?.breakStartTime || null,
        totalBreakSeconds: session?.totalBreakSeconds || 0,
      };
    });

    return res.status(200).json({
      success: true,

      stats,

      pagination: {
        totalRecords: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit,
      },

      agents,
    });
  } catch (error) {
    console.error("Admin monitor error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};