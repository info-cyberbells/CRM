import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getChatUsersService,
    getMyRoomsService,
    getOrCreateDirectService,
    getMessagesService,
    uploadFileService,
    createGroupService,
    addMemberService,
    removeMemberService,
    getAllRoomsAdminService,
    getRoomMembersService
} from "../../services/services";

// ── THUNKS 

export const getChatUsersThunk = createAsyncThunk(
    "chat/getUsers",
    async (_, { rejectWithValue }) => {
        try {
            return await getChatUsersService();
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to get users");
        }
    }
);

export const getMyRoomsThunk = createAsyncThunk(
    "chat/getMyRooms",
    async (_, { rejectWithValue }) => {
        try {
            return await getMyRoomsService();
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to get rooms");
        }
    }
);

export const getOrCreateDirectThunk = createAsyncThunk(
    "chat/getOrCreateDirect",
    async (otherUserId, { rejectWithValue }) => {
        try {
            return await getOrCreateDirectService(otherUserId);
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to open chat");
        }
    }
);

export const getMessagesThunk = createAsyncThunk(
    "chat/getMessages",
    async ({ roomId, offset = 0 }, { rejectWithValue }) => {
        try {
            return await getMessagesService(roomId, offset);
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to get messages");
        }
    }
);
export const uploadFileThunk = createAsyncThunk(
    "chat/uploadFile",
    async (file, { rejectWithValue }) => {
        try {
            return await uploadFileService(file);
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to upload file");
        }
    }
);

export const createGroupThunk = createAsyncThunk(
    "chat/createGroup",
    async ({ name, memberIds }, { rejectWithValue }) => {
        try {
            return await createGroupService(name, memberIds);
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to create group");
        }
    }
);

export const addMemberThunk = createAsyncThunk(
    "chat/addMember",
    async ({ roomId, userId }, { rejectWithValue }) => {
        try {
            return await addMemberService(roomId, userId);
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to add member");
        }
    }
);

export const removeMemberThunk = createAsyncThunk(
    "chat/removeMember",
    async ({ roomId, userId }, { rejectWithValue }) => {
        try {
            return await removeMemberService(roomId, userId);
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to remove member");
        }
    }
);

export const getAllRoomsAdminThunk = createAsyncThunk(
    "chat/getAllRoomsAdmin",
    async (_, { rejectWithValue }) => {
        try {
            return await getAllRoomsAdminService();
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to get all rooms");
        }
    }
);

export const getRoomMembersThunk = createAsyncThunk(
    "chat/getRoomMembers",
    async (roomId, { rejectWithValue }) => {
        try {
            return await getRoomMembersService(roomId);
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to get members");
        }
    }
);

// ── PERSISTENCE HELPERS ────────────────────────────────────────────────────────
const UNREAD_KEY = "chat_unread_counts";
const LAST_MSG_KEY = "chat_last_msg_timestamps";

function loadUnread() {
    try { return JSON.parse(localStorage.getItem(UNREAD_KEY)) || {}; }
    catch { return {}; }
}

function loadLastMsgTimestamps() {
    try { return JSON.parse(localStorage.getItem(LAST_MSG_KEY)) || {}; }
    catch { return {}; }
}

function persistUnread(state) {
    localStorage.setItem(UNREAD_KEY, JSON.stringify(state.unreadCounts));
}

function persistLastMsg(state) {
    localStorage.setItem(LAST_MSG_KEY, JSON.stringify(state.lastMessageTimestamps));
}

// ── SLICE ─────────────────────────────────────────────────────────────────────

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        users: [],
        rooms: [],
        allRooms: [],   // admin only
        unreadCounts: loadUnread(),    // { [roomId]: { count, lastSender } } — persisted
        lastMessageTimestamps: loadLastMsgTimestamps(),  // { [userId]: timestamp } — persisted
        incomingAlert: null,
        activeRoomId: null,
        activeRoomName: "",
        activeRoomType: "",
        messages: [],
        isLoadingUsers: false,
        isLoadingRooms: false,
        isLoadingMsgs: false,
        isUploading: false,
        error: null,
    },
    reducers: {
        // set which room is open
        setActiveRoom(state, action) {
            state.activeRoomId = action.payload.roomId;
            state.activeRoomName = action.payload.roomName;
            state.activeRoomType = action.payload.roomType;
            state.messages = [];
            // clear unread when opening a room
            if (action.payload.roomId) {
                delete state.unreadCounts[String(action.payload.roomId)];
                persistUnread(state);
            }
        },
        // socket pushes a new message — add it to state
        addIncomingMessage(state, action) {
            const msg = action.payload;
            if (String(msg.room_id) === String(state.activeRoomId)) {
                const exists = state.messages.find((m) => m.id === msg.id);
                if (!exists) {
                    state.messages.push(msg);
                }
            }
        },
        updateUserStatus(state, action) {
            const { userId, status } = action.payload;
            const user = state.users.find(u => u.id === userId);
            if (user) user.status = status;
        },
        incrementUnread(state, action) {
            const { roomId, senderName } = action.payload;
            const id = String(roomId);
            const currentCount = state.unreadCounts[id]?.count || 0;
            state.unreadCounts[id] = { count: currentCount + 1, lastSender: senderName || "Someone" };
            persistUnread(state);
        },
        clearUnread(state, action) {
            const roomId = String(action.payload);
            delete state.unreadCounts[roomId];
            persistUnread(state);
        },
        setIncomingAlert(state, action) {
            state.incomingAlert = action.payload;
        },
        clearIncomingAlert(state) {
            state.incomingAlert = null;
        },
        updateLastMessageTime(state, action) {
            const { userId } = action.payload;
            state.lastMessageTimestamps[String(userId)] = Date.now();
            persistLastMsg(state);
        },
        clearMessages(state) {
            state.messages = [];
        },
        updateMessageStatus(state, action) {
            const { messageId, status } = action.payload;
            const msg = state.messages.find(m => m.id === messageId);
            if (msg) msg._status = status;
        },
        confirmSentMessage(state, action) {
            const { tempId, realMsg } = action.payload;
            const idx = state.messages.findIndex(m => m.id === tempId);
            if (idx !== -1) {
                realMsg._status = "sent";
                state.messages[idx] = realMsg;
            }
        },
        markMessagesAsRead(state, action) {
            const { messageIds } = action.payload;
            const idSet = new Set(messageIds.map(String));
            state.messages.forEach(m => {
                if (idSet.has(String(m.id))) {
                    m._status = "read";
                    m.read_at = new Date().toISOString();
                }
            });
        },

        resetChat(state) {
            state.users = [];
            state.rooms = [];
            state.allRooms = [];
            state.activeRoomId = null;
            state.activeRoomName = "";
            state.activeRoomType = "";
            state.messages = [];
            state.error = null;
            state.unreadCounts = {};
            state.incomingAlert = null;
            state.lastMessageTimestamps = {};
            localStorage.removeItem(UNREAD_KEY);
            localStorage.removeItem(LAST_MSG_KEY);
        },
    },
    extraReducers: (builder) => {
        // get users
        builder
            .addCase(getChatUsersThunk.pending, (state) => {
                state.isLoadingUsers = true;
            })
            .addCase(getChatUsersThunk.fulfilled, (state, action) => {
                state.isLoadingUsers = false;
                state.users = action.payload;
            })
            .addCase(getChatUsersThunk.rejected, (state, action) => {
                state.isLoadingUsers = false;
                state.error = action.payload;
            });

        // get my rooms
        builder
            .addCase(getMyRoomsThunk.pending, (state) => {
                state.isLoadingRooms = true;
            })
            .addCase(getMyRoomsThunk.fulfilled, (state, action) => {
                state.isLoadingRooms = false;
                state.rooms = action.payload;
            })
            .addCase(getMyRoomsThunk.rejected, (state, action) => {
                state.isLoadingRooms = false;
                state.error = action.payload;
            });

        // get messages
        builder
            .addCase(getMessagesThunk.pending, (state, action) => {
                if (action.meta.arg?.offset === 0) {
                    state.isLoadingMsgs = true;
                    state.messages = [];
                }
            })
            .addCase(getMessagesThunk.fulfilled, (state, action) => {
                state.isLoadingMsgs = false;
                // Derive _status for each message from read_at
                const myId = JSON.parse(localStorage.getItem("user") || "{}").id;
                const msgs = action.payload.map(m => {
                    if (String(m.sender_id) === String(myId) || String(m.sender?.id) === String(myId)) {
                        m._status = m.read_at ? "read" : "sent";
                    }
                    return m;
                });
                if (action.meta.arg.offset > 0) {
                    state.messages = [...msgs, ...state.messages];
                } else {
                    state.messages = msgs;
                }
            })
            .addCase(getMessagesThunk.rejected, (state, action) => {
                state.isLoadingMsgs = false;
                state.error = action.payload;
            });

        // upload file
        builder
            .addCase(uploadFileThunk.pending, (state) => {
                state.isUploading = true;
            })
            .addCase(uploadFileThunk.fulfilled, (state) => {
                state.isUploading = false;
            })
            .addCase(uploadFileThunk.rejected, (state) => {
                state.isUploading = false;
            });

        // open direct room — after creation set it as active
        builder.addCase(getOrCreateDirectThunk.fulfilled, (state, action) => {
            state.activeRoomId = action.payload.roomId;
        });

        // create group — refresh handled in component
        builder.addCase(createGroupThunk.fulfilled, (state, action) => {
            state.activeRoomId = action.payload.roomId;
            state.activeRoomName = action.payload.name;
            state.activeRoomType = "group";
        });

        // admin all rooms
        builder.addCase(getAllRoomsAdminThunk.fulfilled, (state, action) => {
            state.allRooms = action.payload;
        });
    },
});

export const {
    setActiveRoom, addIncomingMessage, clearMessages, resetChat, updateUserStatus,
    incrementUnread, clearUnread, setIncomingAlert, clearIncomingAlert, updateLastMessageTime,
    updateMessageStatus, confirmSentMessage, markMessagesAsRead
} = chatSlice.actions;
export default chatSlice.reducer;