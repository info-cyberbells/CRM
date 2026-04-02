// models/activityLog.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const ActivityLog = sequelize.define("ActivityLog", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "user_id"
  },
  userRole: {
    type: DataTypes.ENUM("Sale", "Tech", "Tech_Lead"),
    allowNull: false,
    field: "user_role"
  },
  action: {
    type: DataTypes.ENUM(
      "LOGIN", "LOGOUT",
      "CLOCK_IN", "CLOCK_OUT", "BREAK_START", "BREAK_END",
      "CASE_CREATED", "CASE_UPDATED", "CASE_STATUS_CHANGED", "CASE_NOTE_ADDED",
      "PLAN_UPGRADED"
    ),
    allowNull: false,
  },
  entityType: {
    type: DataTypes.ENUM("case", "session", "plan", "auth"),
    allowNull: true,
    field: "entity_type"
  },
  entityId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "entity_id"
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: "activity_logs",
  freezeTableName: true,
  createdAt: "created_at",
  updatedAt: false,
});

ActivityLog.belongsTo(User, { as: "user", foreignKey: "user_id" });

export default ActivityLog;