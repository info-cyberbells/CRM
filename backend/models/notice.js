import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const AdminNotice = sequelize.define("AdminNotice", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    noticeType: {
        type: DataTypes.ENUM("ALL","TECH","SALE"),
        allowNull: false,
        defaultValue: "ALL",
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: "admin_notices",
});

// Relations
AdminNotice.belongsTo(User, {
    as: "createdBy",
    foreignKey: "createdById",
});

export default AdminNotice;
