import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const Attendance = sequelize.define("Attendance", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    status: {
        type: DataTypes.ENUM("P", "HD", "AB", "NCNS", "WO", "L"),
        allowNull: false,
    },
    comments: { type: DataTypes.TEXT, allowNull: true },
}, {
    tableName: "attendance",
    freezeTableName: true,
    indexes: [
        { unique: true, fields: ["userId", "date"] }
    ]
});

Attendance.belongsTo(User, { as: "user", foreignKey: "userId" });
User.hasMany(Attendance, { as: "attendances", foreignKey: "userId" });

export default Attendance;