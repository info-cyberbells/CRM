import User from "./user.js";
import ChatRoom from "./ChatRoom.js";
import ChatMember from "./ChatMember.js";
import Message from "./Message.js";

// ChatRoom <-> ChatMember
ChatRoom.hasMany(ChatMember, { foreignKey: "room_id", as: "members" });
ChatMember.belongsTo(ChatRoom, { foreignKey: "room_id" });

// ChatRoom <-> Message
ChatRoom.hasMany(Message, { foreignKey: "room_id", as: "messages" });
Message.belongsTo(ChatRoom, { foreignKey: "room_id" });

// ChatMember <-> User
ChatMember.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(ChatMember, { foreignKey: "user_id" });

// Message <-> User
Message.belongsTo(User, { foreignKey: "sender_id", as: "sender" });
User.hasMany(Message, { foreignKey: "sender_id" });