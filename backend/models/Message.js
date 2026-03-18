import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Message = sequelize.define("Message", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    file_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    file_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    tableName: "messages",
    freezeTableName: true,
    timestamps: true,
    createdAt: "sent_at",
    updatedAt: false,
});

export default Message;