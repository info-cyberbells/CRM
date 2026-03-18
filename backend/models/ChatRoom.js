import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ChatRoom = sequelize.define("ChatRoom", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM("direct", "group"),
        defaultValue: "direct",
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "chat_rooms",
    freezeTableName: true,
});

export default ChatRoom;