import ActivityLog from "../models/activitylogs.js";
import User from "../models/user.js";
import { Op } from "sequelize";

export const getActivityLogs = async (req, res) => {
  try {
    const {
      page = 1,
      userId,
      userRole,
      action,
      entityType,
      search,
      startDate,
      endDate,
    } = req.query;

    const limit = parseInt(req.query.limit) || 20;
    const offset = (parseInt(page) - 1) * limit;

    // Build filter
    const where = {};

    if (userId)     where.userId     = userId;
    if (userRole)   where.userRole   = userRole;
    if (action)     where.action     = action;
    if (entityType) where.entityType = entityType;

    // Date range filter
    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at[Op.gte] = new Date(startDate);
      if (endDate)   where.created_at[Op.lte] = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    }

    // Search by description
    if (search) {
      where.description = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await ActivityLog.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role", "profileImage"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      data: {
          pagination: {
            total: count,
            page: parseInt(page),
            limit,
            totalPages: Math.ceil(count / limit),
            hasNextPage: offset + limit < count,
            hasPrevPage: parseInt(page) > 1,
          },
        logs: rows,
      },
    });

  } catch (error) {
    console.error("Get activity logs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs",
      error: error.message,
    });
  }
};