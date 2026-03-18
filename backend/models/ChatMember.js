import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ChatMember = sequelize.define("ChatMember", {
    room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    added_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "chat_members",
    freezeTableName: true,
    timestamps: true,
    createdAt: "added_at",
    updatedAt: false,
});

export default ChatMember;