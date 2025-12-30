import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";
import Case from "./case.js";

const Notification = sequelize.define("Notification", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM(
            "NEW_CASE",
            "CASE_ASSIGNED",
            "STATUS_UPDATED",
            "ADMIN_UPDATE",
            "REMINDER"
        ),
        allowNull: false,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});


Notification.belongsTo(User, { as: "recipient", foreignKey: "recipientId" });
Notification.belongsTo(User, { as: "actor", foreignKey: "actorId" });
Notification.belongsTo(Case, { foreignKey: "caseId" });

export default Notification;
