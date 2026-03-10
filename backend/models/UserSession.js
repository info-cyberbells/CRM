import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserSession = sequelize.define(
  "UserSession",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    clockInTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    clockOutTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    breakStartTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    totalBreakSeconds: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "user_sessions",
    freezeTableName: true,
  }
);

export default UserSession;