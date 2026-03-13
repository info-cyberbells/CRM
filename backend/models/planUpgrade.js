import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";

const PlanUpgrade = sequelize.define("PlanUpgrade", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    caseId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    product: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    validity: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    addedById: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "plan_upgrades",
    freezeTableName: true,
});

PlanUpgrade.belongsTo(User, { as: "addedBy", foreignKey: "addedById" });

export default PlanUpgrade;