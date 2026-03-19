import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "emoji-picker-element";
import {
    MessageSquare, Users, Send, Paperclip,
    Plus, X, Check, Search, ChevronDown
} from "lucide-react";
import {
    getChatUsersThunk,
    getMyRoomsThunk,
    getMessagesThunk,
    getOrCreateDirectThunk,
    uploadFileThunk,
    createGroupThunk,
    addMemberThunk,
    removeMemberThunk,
    getRoomMembersThunk,
    setActiveRoom,
    addIncomingMessage,
} from "../../features/chat/chatSlice.js";
import { useSocket } from "../../hooks/useSocket.js";
import { useToast } from "../../ToastContext/ToastContext.jsx";

const ROLE_COLORS = {
    Admin: "bg-rose-50 text-rose-600 border-rose-100",
    Sale: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Tech: "bg-teal-50 text-teal-600 border-teal-100",
    Tech_Lead: "bg-amber-50 text-amber-600 border-amber-100",
};

const ROLE_DOT = {
    Admin: "bg-rose-500",
    Sale: "bg-emerald-500",
    Tech: "bg-teal-500",
    Tech_Lead: "bg-amber-500",
};

// ── GROUP MODAL (admin only) ──────────────────────────────────────────────────
const GroupModal = ({ users, onClose, onCreated }) => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const [name, setName] = useState("");
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState("");

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    function toggle(id) {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }

    async function handleCreate() {
        if (!name.trim() || selected.length === 0) {
            showToast("Enter a group name and select at least one member", "error");
            return;
        }
        try {
            const data = await dispatch(createGroupThunk({ name: name.trim(), memberIds: selected })).unwrap();
            showToast("Group created successfully", "success");
            onCreated(data);
        } catch (err) {
            showToast(err || "Failed to create group", "error");
        }
    }

    return (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-emerald-600 p-5 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <Users size={20} />
                        <h3 className="text-base font-black tracking-tight">New Group Chat</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Group Name*
                        </label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Sales Team"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-semibold text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Add Members*
                        </label>
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search users..."
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="max-h-52 overflow-y-auto space-y-1 border border-slate-100 rounded-2xl p-2">
                        {filtered.map(u => (
                            <label key={u.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                  ${selected.includes(u.id) ? "bg-emerald-600 border-emerald-600" : "border-slate-300"}`}>
                                    {selected.includes(u.id) && <Check size={12} className="text-white" />}
                                </div>
                                <input type="checkbox" className="hidden" checked={selected.includes(u.id)} onChange={() => toggle(u.id)} />
                                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black text-white
                  ${u.role === "Admin" ? "bg-rose-500" : u.role === "Sale" ? "bg-emerald-500" : "bg-teal-500"}`}>
                                    {u.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-700 truncate">{u.name}</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-black">{u.role}</p>
                                </div>
                            </label>
                        ))}
                    </div>

                    {selected.length > 0 && (
                        <p className="text-[11px] text-emerald-600 font-black">
                            {selected.length} member{selected.length > 1 ? "s" : ""} selected
                        </p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose}
                            className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer">
                            Cancel
                        </button>
                        <button onClick={handleCreate}
                            className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-black text-[11px] uppercase tracking-widest hover:bg-emerald-700 transition-all cursor-pointer">
                            Create Group
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MessageBubble = ({ message, isOwn, showAvatar, showName }) => {
    const time = new Date(message.sent_at || message.createdAt).toLocaleTimeString([], {
        hour: "2-digit", minute: "2-digit"
    });

    return (
        <div className={`flex gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"} ${showAvatar ? "mt-3" : "mt-0.5"} items-end`}>

            {/* avatar — only show on last message of a group */}
            <div className="w-6 h-6 flex-shrink-0">
                {showAvatar && (
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white
                        ${message.sender?.role === "Admin" ? "bg-rose-400" :
                            message.sender?.role === "Sale" ? "bg-emerald-500" :
                                message.sender?.role === "Tech_Lead" ? "bg-amber-400" : "bg-teal-500"}`}>
                        {message.sender?.name?.[0] || "?"}
                    </div>
                )}
            </div>

            <div className={`flex flex-col max-w-[55%] ${isOwn ? "items-end" : "items-start"}`}>

                {/* name + role — only on first message of a group, only for others */}
                {!isOwn && showName && (
                    <div className="flex items-center gap-1.5 mb-1 px-0.5">
                        <span className="text-[11px] font-semibold text-slate-500">
                            {message.sender?.name || "Unknown"}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold ${ROLE_COLORS[message.sender?.role] || ""}`}>
                            {message.sender?.role}
                        </span>
                    </div>
                )}

                {/* bubble */}
                {(() => {
                    const isEmojiOnly = message.content &&
                        /^[\p{Emoji}\s]+$/u.test(message.content.trim()) &&
                        !message.file_url &&
                        message.content.trim().length <= 8;

                    return (
                        <div className={`px-3.5 py-2 text-sm leading-relaxed
            ${isEmojiOnly
                                ? ""
                                : isOwn
                                    ? "bg-emerald-600 text-white rounded-2xl rounded-br-none"
                                    : "bg-white text-slate-700 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm"}`}>
                            {message.content && (
                                <p className={`whitespace-pre-wrap ${isEmojiOnly ? "text-4xl leading-none" : ""}`}>
                                    {message.content}
                                </p>
                            )}
                            {message.file_url && (() => {
                                const name = message.file_name || "";
                                const ext = name.split(".").pop()?.toLowerCase();
                                const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);

                                return isImage ? (
                                    <a href={`${import.meta.env.VITE_API_URL}${message.file_url}`} target="_blank" rel="noreferrer">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}${message.file_url}`}
                                            alt={name}
                                            onError={e => {
                                                e.target.style.display = "none";
                                                e.target.nextSibling.style.display = "flex";
                                            }}
                                            className="max-w-[200px] max-h-[160px] rounded-xl mt-1 object-cover cursor-pointer"
                                        />
                                        <div style={{ display: "none" }}
                                            className="max-w-[200px] h-24 rounded-xl mt-1 bg-white/20 border border-white/30 flex-col items-center justify-center gap-1 cursor-pointer">
                                            <Paperclip size={20} />
                                            <span className="text-[10px] font-bold">{name}</span>
                                        </div>
                                        <span className="text-[10px] mt-1 block opacity-70">{name}</span>
                                    </a>
                                ) : (
                                    <a
                                        href={`${import.meta.env.VITE_API_URL}${message.file_url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`flex items-center gap-2 text-xs font-bold mt-1 ${isOwn ? "text-white/80" : "text-emerald-600"}`}
                                    >
                                        <Paperclip size={11} />
                                        {name || "Download file"}
                                    </a>
                                );
                            })()}
                        </div>
                    );
                })()}

                {/* time — only on last message of a group */}
                {showAvatar && (
                    <span className="text-[10px] text-slate-400 mt-1 px-0.5">{time}</span>
                )}
            </div>
        </div >
    );
};

const GroupInfoPanel = ({ roomId, roomName, onClose }) => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);

    const users = useSelector(state => state.chat.users);
    const me = useSelector(state => state.user.user) || JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        dispatch(getRoomMembersThunk(roomId))
            .unwrap()
            .then(data => { setMembers(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [roomId, dispatch]);

    async function handleRemove(userId) {
        try {
            await dispatch(removeMemberThunk({ roomId, userId })).unwrap();
            setMembers(prev => prev.filter(m => m.id !== userId));
            dispatch(getMyRoomsThunk());
            showToast("Member removed", "success");
        } catch {
            showToast("Failed to remove member", "error");
        }
    }

    async function handleAdd(userId) {
        try {
            await dispatch(addMemberThunk({ roomId, userId })).unwrap();
            const user = users.find(u => u.id === userId);
            if (user) setMembers(prev => [...prev, user]);
            dispatch(getMyRoomsThunk());
            showToast("Member added", "success");
        } catch {
            showToast("Failed to add member", "error");
        }
    }

    const memberIds = members.map(m => m.id);
    const nonMembers = users.filter(u =>
        !memberIds.includes(u.id) &&
        u.id !== me.id &&
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[100] flex items-center justify-center">
            <div className="bg-white rounded-3xl w-96 max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">

                <div className="bg-emerald-600 p-5 flex items-center justify-between text-white flex-shrink-0">
                    <div>
                        <h3 className="font-black text-base">{roomName}</h3>
                        <p className="text-[11px] text-white/70 mt-0.5">{members.length} members</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                    >
                        <X size={14} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto chat-scroll">

                    <div className="p-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Members</p>
                        {loading ? (
                            <p className="text-xs text-slate-400 font-bold">Loading...</p>
                        ) : (
                            members.map(member => (
                                <div key={member.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0
                                        ${member.role === "Admin" ? "bg-rose-500" : member.role === "Sale" ? "bg-emerald-500" : "bg-teal-500"}`}>
                                        {member.name?.[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-700 truncate">{member.name}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-black">{member.role}</p>
                                    </div>
                                    {me.role === "Admin" && member.id !== me.id && (
                                        <button
                                            onClick={() => setConfirmAction({ type: "remove", userId: member.id, userName: member.name })}
                                            className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {me.role === "Admin" && (
                        <div className="p-4 border-t border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Add Members</p>
                            <div className="relative mb-3">
                                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search users..."
                                    className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-100 text-xs outline-none focus:border-emerald-400 transition-all"
                                />
                            </div>
                            {nonMembers.map(user => (
                                <div key={user.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0
                                        ${user.role === "Admin" ? "bg-rose-500" : user.role === "Sale" ? "bg-emerald-500" : "bg-teal-500"}`}>
                                        {user.name?.[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-700 truncate">{user.name}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-black">{user.role}</p>
                                    </div>
                                    <button
                                        onClick={() => setConfirmAction({ type: "add", userId: user.id, userName: user.name })}
                                        className="p-1.5 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {confirmAction && (
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl p-6 w-80">
                                <p className="font-black text-slate-800 text-sm mb-1">
                                    {confirmAction.type === "remove" ? "Remove member?" : "Add member?"}
                                </p>
                                <p className="text-xs text-slate-400 font-bold mb-5">
                                    {confirmAction.type === "remove"
                                        ? `Remove ${confirmAction.userName} from this group?`
                                        : `Add ${confirmAction.userName} to this group?`}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setConfirmAction(null)}
                                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (confirmAction.type === "remove") {
                                                await handleRemove(confirmAction.userId);
                                            } else {
                                                await handleAdd(confirmAction.userId);
                                            }
                                            setConfirmAction(null);
                                        }}
                                        className={`flex-1 py-2.5 rounded-xl text-white font-black text-[11px] uppercase tracking-widest transition-all cursor-pointer
                                    ${confirmAction.type === "remove" ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-600 hover:bg-emerald-700"}`}
                                    >
                                        {confirmAction.type === "remove" ? "Remove" : "Add"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── MAIN CHAT PAGE ────────────────────────────────────────────────────────────
const Chat = () => {
    const dispatch = useDispatch();
    const socket = useSocket();
    const { showToast } = useToast();
    const bottomRef = useRef(null);
    const fileRef = useRef(null);

    const [text, setText] = useState("");
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showGroupInfo, setShowGroupInfo] = useState(false);
    const [search, setSearch] = useState("");
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showScrollDown, setShowScrollDown] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);
    const msgContainerRef = useRef(null);

    const { users, rooms, messages, activeRoomId, activeRoomName, activeRoomType,
        isLoadingMsgs, isUploading } = useSelector(state => state.chat);

    const me = useSelector((state) => state.user.user) || JSON.parse(localStorage.getItem("user") || "{}");

    // load users and rooms on mount
    useEffect(() => {
        dispatch(getChatUsersThunk());
        dispatch(getMyRoomsThunk());
    }, [dispatch]);

    useEffect(() => {
        const picker = emojiPickerRef.current;
        if (!picker) return;

        const handler = (e) => {
            setText(prev => prev + e.detail.unicode);
        };

        picker.addEventListener("emoji-click", handler);
        return () => picker.removeEventListener("emoji-click", handler);
    }, [showEmojiPicker]);

    useEffect(() => {
        if (!showEmojiPicker) return;

        function handleClickOutside(e) {
            const pickerEl = emojiPickerRef.current;
            const buttonEl = document.getElementById("emoji-btn");
            if (
                pickerEl && !pickerEl.contains(e.target) &&
                buttonEl && !buttonEl.contains(e.target)
            ) {
                setShowEmojiPicker(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showEmojiPicker]);

    useEffect(() => {
        if (!activeRoomId) return;

        setOffset(0);
        setHasMore(true);
        dispatch(getMessagesThunk({ roomId: activeRoomId, offset: 0 }));

        if (socket) socket.emit("join_room", activeRoomId);

        return () => {
            if (socket) socket.emit("leave_room", activeRoomId);
        };
    }, [activeRoomId, socket, dispatch]);

    useEffect(() => {
        if (!messages.length) return;

        const container = msgContainerRef.current;
        if (!container) return;

        // scroll immediately
        container.scrollTop = container.scrollHeight;

        // also scroll after images load
        const images = container.querySelectorAll("img");
        if (images.length === 0) return;

        let loaded = 0;
        images.forEach(img => {
            if (img.complete) {
                loaded++;
                if (loaded === images.length) {
                    container.scrollTop = container.scrollHeight;
                }
            } else {
                img.addEventListener("load", () => {
                    loaded++;
                    if (loaded === images.length) {
                        container.scrollTop = container.scrollHeight;
                    }
                }, { once: true });
                img.addEventListener("error", () => {
                    loaded++;
                    if (loaded === images.length) {
                        container.scrollTop = container.scrollHeight;
                    }
                }, { once: true });
            }
        });
    }, [activeRoomId, messages.length]);

    const prevMessagesLength = useRef(0);

    useEffect(() => {
        if (messages.length > prevMessagesLength.current && prevMessagesLength.current > 0) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        prevMessagesLength.current = messages.length;
    }, [messages.length]);

    async function openDirect(user) {
        try {
            const data = await dispatch(getOrCreateDirectThunk(user.id)).unwrap();
            dispatch(setActiveRoom({
                roomId: data.roomId,
                roomName: user.name,
                roomType: "direct",
            }));
            dispatch(getMyRoomsThunk());
        } catch (err) {
            showToast("Failed to open chat", "error");
        }
    }

    function openRoom(room) {
        const otherMember = room.members?.find(m => m.user?.id !== me.id);
        const name = room.type === "group" ? room.name : otherMember?.user?.name || "Chat";
        dispatch(setActiveRoom({ roomId: room.id, roomName: name, roomType: room.type }));
    }

    function sendMessage() {
        if (!text.trim() || !socket || !activeRoomId) return;
        socket.emit("send_message", { roomId: activeRoomId, content: text.trim() });
        setText("");
    }
    async function handleFile(e) {
        const file = e.target.files[0];
        if (!file || !activeRoomId) return;

        const allowed = [
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/plain",
            "application/zip",
        ];

        if (!allowed.includes(file.type)) {
            showToast("File type not allowed. Supported: images, PDF, Word, Excel, TXT, ZIP", "error");
            e.target.value = "";
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showToast("File too large. Maximum size is 10MB", "error");
            e.target.value = "";
            return;
        }


        try {
            const data = await dispatch(uploadFileThunk(file)).unwrap();

            if (!data?.url) {
                showToast("Upload failed — no URL returned", "error");
                return;
            }

            if (!socket || !socket.connected) {
                showToast("Not connected. Please refresh and try again", "error");
                return;
            }

            socket.emit("send_file", {
                roomId: activeRoomId,
                fileUrl: data.url,
                fileName: data.filename,
            });

        } catch (err) {
            console.error("File upload error:", err);
            showToast(
                err?.message || "File upload failed. Check your connection and try again",
                "error"
            );
        }

        e.target.value = "";
    }
    function handleKey(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    async function handleScroll(e) {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollDown(!isNearBottom);

        if (scrollTop !== 0) return;

        setLoadingMore(true);
        const newOffset = offset + 50;
        const prevScrollHeight = e.target.scrollHeight;

        try {
            const result = await dispatch(
                getMessagesThunk({ roomId: activeRoomId, offset: newOffset })
            ).unwrap();

            if (result.length < 50) setHasMore(false);
            setOffset(newOffset);

            // keep scroll position after prepending old messages
            requestAnimationFrame(() => {
                const container = msgContainerRef.current;
                if (container) {
                    container.scrollTop = container.scrollHeight - prevScrollHeight;
                }
            });
        } catch {
            showToast("Failed to load older messages", "error");
        }

        setLoadingMore(false);
    }

    // group users by role for sidebar
    const ROLE_ORDER = ["Admin", "Sale", "Tech", "Tech_Lead"];
    const groupedUsers = ROLE_ORDER.reduce((acc, role) => {
        const filtered = users.filter(u =>
            u.role === role &&
            u.id !== me.id &&
            u.name.toLowerCase().includes(search.toLowerCase())
        );
        if (filtered.length > 0) acc[role] = filtered;
        return acc;
    }, {});

    const groupRooms = rooms.filter(r =>
        r.type === "group" &&
        (!search.trim() || r.name?.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="flex h-full overflow-hidden bg-slate-50 font-[Poppins]">

            {/* ── LEFT SIDEBAR ── */}
            <div className="w-72 bg-white border-r border-slate-100 flex flex-col flex-shrink-0">

                {/* header */}
                <div className="p-5 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600">
                                <MessageSquare size={18} />
                            </div>
                            <h2 className="text-base font-black text-slate-800">Team Chat</h2>
                        </div>
                        {me.role === "Admin" && (
                            <button
                                onClick={() => setShowGroupModal(true)}
                                className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all cursor-pointer"
                                title="New Group"
                            >
                                <Plus size={16} />
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search people..."
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-sm outline-none focus:border-emerald-400 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1 chat-scroll">

                    {search.trim() && groupRooms.length === 0 && Object.keys(groupedUsers).length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
                            <Search size={24} strokeWidth={1.5} />
                            <p className="text-xs font-bold">No agents found</p>
                        </div>
                    )}

                    {/* group rooms */}
                    {groupRooms.length > 0 && (
                        <div className="mb-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-2">
                                Groups
                            </p>
                            {groupRooms.map(room => (
                                <button
                                    key={room.id}
                                    onClick={() => openRoom(room)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer
                    ${activeRoomId === room.id ? "bg-emerald-50 border border-emerald-100" : "hover:bg-slate-50"}`}
                                >
                                    <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                                        {room.name?.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("")}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-black text-slate-700 truncate">{room.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold">
                                            {room.members?.length || 0} members
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* users by role */}
                    {Object.entries(groupedUsers).map(([role, roleUsers]) => (
                        <div key={role} className="mb-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-2">
                                {role.replace("_", " ")}
                            </p>
                            {roleUsers.map(user => {
                                const directRoom = rooms.find(r =>
                                    r.type === "direct" &&
                                    r.members?.some(m => m.user?.id === user.id)
                                );
                                const isActive = activeRoomId === directRoom?.id;

                                return (
                                    <button
                                        key={user.id}
                                        onClick={() => openDirect(user)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer
                      ${isActive ? "bg-emerald-50 border border-emerald-100" : "hover:bg-slate-50"}`}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs
                        ${user.role === "Admin" ? "bg-rose-500" : user.role === "Sale" ? "bg-emerald-500" : "bg-teal-500"}`}>
                                                {user.name[0]}
                                            </div>
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white
                        ${user.status === "ONLINE" ? "bg-emerald-500" : user.status === "ON_BREAK" ? "bg-amber-500" : "bg-slate-300"}`} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-black text-slate-700 truncate">{user.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold capitalize">
                                                {user.status?.toLowerCase().replace("_", " ") || "offline"}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── MAIN CHAT AREA ── */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {activeRoomId ? (
                    <>
                        {/* chat header */}
                        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm
    ${activeRoomType === "group" ? "bg-emerald-600" : "bg-emerald-600"}`}>
                                {activeRoomType === "group"
                                    ? activeRoomName?.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("")
                                    : activeRoomName?.[0]}
                            </div>
                            <div className="flex items-center justify-between flex-1">
                                <div
                                    className={`${activeRoomType === "group" ? "cursor-pointer hover:opacity-70 transition-all" : ""}`}
                                    onClick={() => activeRoomType === "group" && setShowGroupInfo(true)}
                                >
                                    <p className="font-black text-slate-800">{activeRoomName}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        {activeRoomType === "group" ? "Group Chat — tap to view members" : "Direct Message"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => dispatch(setActiveRoom({ roomId: null, roomName: "", roomType: "" }))}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* messages */}
                        <div className="flex-1 overflow-y-auto p-6 min-h-0 chat-scroll" ref={msgContainerRef} onScroll={handleScroll}>
                            {loadingMore && (
                                <div className="text-center py-3 text-xs text-slate-400 font-bold">
                                    Loading older messages...
                                </div>
                            )}
                            {!hasMore && messages.length > 0 && (
                                <div className="flex items-center gap-3 my-4 px-4">
                                    <div className="flex-1 h-px " />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        Start of conversation
                                    </span>
                                    <div className="flex-1 h-px" />
                                </div>
                            )}
                            {isLoadingMsgs ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-slate-400 text-sm font-bold">Loading messages...</div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                                    <MessageSquare size={32} strokeWidth={1.5} />
                                    <p className="text-sm font-bold">No messages yet. Say hello!</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isOwn = Number(msg.sender_id) === Number(me.id) || Number(msg.sender?.id) === Number(me.id);
                                    const nextMsg = messages[index + 1];
                                    const prevMsg = messages[index - 1];
                                    const senderId = msg.sender_id || msg.sender?.id;
                                    const nextSenderId = nextMsg?.sender_id || nextMsg?.sender?.id;
                                    const prevSenderId = prevMsg?.sender_id || prevMsg?.sender?.id;

                                    // show avatar + time on last message of a consecutive group
                                    const showAvatar = String(senderId) !== String(nextSenderId);
                                    // show name on first message of a consecutive group
                                    const showName = String(senderId) !== String(prevSenderId);

                                    return (
                                        <MessageBubble
                                            key={msg.id}
                                            message={msg}
                                            isOwn={isOwn}
                                            showAvatar={showAvatar}
                                            showName={showName}
                                        />
                                    );
                                })
                            )}
                            <div ref={bottomRef} />
                        </div>
                        {showScrollDown && (
                            <button
                                onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
                                className="absolute bottom-24 right-8 bg-emerald-600 text-white p-2.5 rounded-full shadow-lg hover:bg-emerald-700 transition-all cursor-pointer z-10"
                            >
                                <ChevronDown size={18} />
                            </button>
                        )}

                        {/* input bar */}
                        <div className="bg-white border-t border-slate-100 p-4 flex-shrink-0">
                            <div className="flex items-end gap-3 bg-slate-50 rounded-2xl border border-slate-200 p-2">
                                <input
                                    type="file"
                                    ref={fileRef}
                                    className="hidden"
                                    accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
                                    onChange={handleFile}
                                />
                                <div className="flex items-center flex-shrink-0">
                                    <button
                                        onClick={() => fileRef.current?.click()}
                                        disabled={isUploading}
                                        className={`p-2 rounded-xl transition-all flex-shrink-0
        ${isUploading
                                                ? "text-slate-300 cursor-not-allowed"
                                                : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer"}`}
                                    >
                                        <Paperclip size={18} />
                                    </button>

                                    <div className="relative flex-shrink-0">
                                        <button
                                            id="emoji-btn"
                                            onClick={() => setShowEmojiPicker(prev => !prev)}
                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                                <line x1="9" y1="9" x2="9.01" y2="9" />
                                                <line x1="15" y1="9" x2="15.01" y2="9" />
                                            </svg>
                                        </button>
                                        {showEmojiPicker && (
                                            <div className="absolute bottom-12 left-0 z-50 shadow-xl rounded-2xl overflow-hidden">
                                                <emoji-picker
                                                    ref={emojiPickerRef}
                                                    style={{ '--num-columns': 8 }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <textarea
                                    value={text}
                                    onChange={e => {
                                        setText(e.target.value);
                                        e.target.style.height = "auto";
                                        e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px";
                                    }}
                                    onKeyDown={handleKey}
                                    placeholder="Type a message..."
                                    rows={1}
                                    style={{ height: "36px" }}
                                    className="flex-1 bg-transparent resize-none outline-none text-sm text-slate-700 placeholder-slate-400 py-2 max-h-20 overflow-y-auto"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!text.trim() || isUploading}
                                    className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                            {isUploading && (
                                <div className="flex items-center gap-2 mt-2 ml-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-[11px] text-emerald-600 font-bold">Uploading file — please wait...</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    // empty state
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-400">
                        <div className="bg-slate-100 p-6 rounded-3xl">
                            <MessageSquare size={40} strokeWidth={1.5} />
                        </div>
                        <div className="text-center">
                            <p className="text-base font-black text-slate-600">Select a conversation</p>
                            <p className="text-sm font-bold mt-1">Choose a person or group from the left panel</p>
                        </div>
                    </div>
                )}
            </div>

            {showGroupModal && (
                <GroupModal
                    users={users.filter(u => u.id !== me.id)}
                    onClose={() => setShowGroupModal(false)}
                    onCreated={(data) => {
                        setShowGroupModal(false);
                        dispatch(getMyRoomsThunk());
                        dispatch(setActiveRoom({
                            roomId: data.roomId,
                            roomName: data.name,
                            roomType: "group",
                        }));
                    }}
                />
            )}
            {showGroupInfo && activeRoomType === "group" && (
                <GroupInfoPanel
                    roomId={activeRoomId}
                    roomName={activeRoomName}
                    onClose={() => setShowGroupInfo(false)}
                />
            )}
        </div>
    );
};

export default Chat;