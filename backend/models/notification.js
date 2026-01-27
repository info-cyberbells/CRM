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
            "CASE_CREATED",
            "CASE_ASSIGNED",
            "CASE_UPDATED",
            "CASE_CLOSED"
        ),
        allowNull: false,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    caseDisplayId: {        // store "TD-0002"
    type: DataTypes.STRING,
    allowNull: true,
  },
});


Notification.belongsTo(User, { as: "recipient", foreignKey: "recipientId" });
Notification.belongsTo(User, { as: "actor", foreignKey: "actorId" });
Notification.belongsTo(Case, { foreignKey: "caseId" });

export default Notification;
