import User from "../models/user.js";
import UserSession from "../models/UserSession.js";
import { Op } from "sequelize";

export const clockIn = async (req, res) => {
  try {

    const userId = req.user.id;

    const activeSession = await UserSession.findOne({
      where: {
        userId,
        clockOutTime: null,
      },
    });

    if (activeSession) {
      return res.status(400).json({
        success: false,
        message: "User already clocked in",
      });
    }

    const lastSession = await UserSession.findOne({
      where: {
        userId,
        clockOutTime: { [Op.ne]: null },
      },
      order: [["clockOutTime", "DESC"]],
    });

    if (lastSession) {
      const lastClockOut = new Date(lastSession.clockOutTime);
      const now = new Date();

      const hoursSinceClockOut = (now - lastClockOut) / (1000 * 60 * 60);

      if (hoursSinceClockOut < 5) {
        const hoursRemaining = (5 - hoursSinceClockOut).toFixed(2);

        return res.status(400).json({
          success: false,
          message: `You cannot clock in yet. Please wait ${hoursRemaining} more hour(s) after your last clock-out.`,
        });
      }
    }

    const createSession = await UserSession.create({
      userId,
      clockInTime: new Date(),
    });

    await User.update({ status: "ONLINE" }, { where: { id: userId } });

    return res.status(200).json({
      status: true,
      message: "Clock In Successful",
      data: createSession,
    });
  } catch (error) {
    console.error("Clock in error", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const ClockOut = async (req, res) => {
  try {

    const userId = req.user.id;

    const session = await UserSession.findOne({
      where: {
        userId,
        clockOutTime: null,
      }
    });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "No active session found",
      });
    }

    let totalBreakSeconds = session.totalBreakSeconds || 0;

    if (session.breakStartTime) {
      const breakStart = new Date(session.breakStartTime);
      const breakEnd = new Date();

      const breakSeconds = Math.floor((breakEnd - breakStart) / 1000);

      totalBreakSeconds += breakSeconds;
    }

    await session.update({
      clockOutTime: new Date(),
      breakStartTime: null,
      totalBreakSeconds,
    });

    await User.update({ status: "OFFLINE" }, { where: { id: userId } });

    return res.status(200).json({
      success: true,
      message: "Clock Out successful",
    });
  } catch (error) {
    console.error("Clock out error", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const startBreak = async (req, res) => {
  try {

    const userId = req.user.id;

    const session = await UserSession.findOne({
      where: {
        userId,
        clockOutTime: null,
      },
    });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "No active session found",
      });
    }

    if (session.breakStartTime) {
      return res.status(400).json({
        success: false,
        message: "Break already started",
      });
    }

    await session.update({
      breakStartTime: new Date(),
    });

    await User.update({ status: "ON_BREAK" }, { where: { id: userId } });

    return res.status(200).json({
      success: true,
      message: "Break started successfully",
    });
  } catch (error) {
    console.error("Start Break Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const endBreak = async (req, res) => {
  try {

    const userId = req.user.id;

    const session = await UserSession.findOne({
      where: {
        userId,
        clockOutTime: null
      }
    });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "No active session found"
      });
    }

    if (!session.breakStartTime) {
      return res.status(400).json({
        success: false,
        message: "Break not started"
      });
    }

    const breakStart = new Date(session.breakStartTime);
    const breakEnd = new Date();

    const breakSeconds = Math.floor(
      (breakEnd - breakStart) / 1000
    );

    const totalBreakSeconds = (session.totalBreakSeconds || 0) + breakSeconds;

    await session.update({
      breakStartTime: null,
      totalBreakSeconds
    });

    await User.update(
      { status: "ONLINE" },
      { where: { id: userId } }
    );

    return res.status(200).json({
      success: true,
      message: "Break ended successfully",
      breakSeconds,
      totalBreakSeconds
    });

  } catch (error) {
    console.error("End Break Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

export const getMySessionStatus = async (req, res) => {
  try {

    const userId = req.user.id;

    // Get user info
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "status"]
    });

    // Find active session
    let session = await UserSession.findOne({
      where: {
        userId,
        clockOutTime: null
      }
    });

    let isActiveSession = true;

    // If no active session, return latest session
    if (!session) {

      isActiveSession = false;

      session = await UserSession.findOne({
        where: { userId },
        order: [["clockInTime", "DESC"]]
      });
    }

    if (!session) {
      return res.status(200).json({
        success: true,
        message: "No session found",
        data: null
      });
    }

    const isOnBreak = !!session.breakStartTime;

    return res.status(200).json({
      success: true,

      data: {
        userId: user.id,
        name: user.name,
        status: user.status,

        clockInTime: session.clockInTime,
        clockOutTime: session.clockOutTime,

        totalBreakSeconds: session.totalBreakSeconds,

        isOnBreak,

        breakStartTime: session.breakStartTime,

        activeSession: isActiveSession
      }

    });

  } catch (error) {

    console.error("Session status error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};