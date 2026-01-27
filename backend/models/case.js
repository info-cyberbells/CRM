import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const Case = sequelize.define("Case", {
    caseId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    caseType: {
        type: DataTypes.ENUM("DIG", "CBH", "TD", "PWS", "NOSALE"),
        allowNull: false
    },
    customerID: { type: DataTypes.STRING, unique: true, allowNull: false },
    customerName: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    altPhone: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    country: { type: DataTypes.STRING, defaultValue: "USA" },
    remoteID: { type: DataTypes.STRING, allowNull: true },
    remotePass: { type: DataTypes.STRING, allowNull: true },
    operatingSystem: { type: DataTypes.STRING, allowNull: true },
    computerPass: { type: DataTypes.STRING, allowNull: true },
    issue: { type: DataTypes.STRING, allowNull: true },
    modelNo: { type: DataTypes.STRING, allowNull: true },
    workToBeDone: { type: DataTypes.STRING, allowNull: true },
    specialNotes: { type: DataTypes.TEXT, allowNull: true },
    securitySoftware: { type: DataTypes.STRING, allowNull: true },
    plan: { type: DataTypes.STRING, allowNull: true },
    planDuration: { type: DataTypes.STRING, allowNull: true },
    validity: { type: DataTypes.DATE, allowNull: true },
    saleAmount: { type: DataTypes.FLOAT, allowNull: true },
    deductions: { type: DataTypes.FLOAT, allowNull: true },
    chargeBack: { type: DataTypes.FLOAT, allowNull: true },
    deviceAmount: { type: DataTypes.FLOAT, allowNull: true },
    status: {
        type: DataTypes.ENUM("Open", "Pending", "Closed", "Void", "Refund", "Chargeback"),
        defaultValue: "Open"
    },
    adminNoteType: {
        type: DataTypes.ENUM("General", "Urgent", "Follow-up"),
        allowNull: true,
    },
    adminNoteText: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    saleNoteType: {
        type: DataTypes.ENUM("General", "Urgent", "Follow-up"),
        allowNull: true,
    },
    saleNoteText: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    techNoteType: {
        type: DataTypes.ENUM("General", "Urgent", "Follow-up"),
        allowNull: true,
    },
    techNoteText: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    caseDurationTimer: { type: DataTypes.STRING, allowNull: true },
}, {
    tableName: "cases",
    freezeTableName: true
});

// Relations
Case.belongsTo(User, { as: "saleUser", foreignKey: "saleUserId" });
Case.belongsTo(User, { as: "techUser", foreignKey: "techUserId" });

export default Case;
