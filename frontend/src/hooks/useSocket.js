import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { addIncomingMessage, updateUserStatus, incrementUnread, setIncomingAlert, updateLastMessageTime, updateMessageStatus, confirmSentMessage, markMessagesAsRead } from "../features/chat/chatSlice.js";

let socketInstance = null;

export function disconnectSocket() {
    if (socketInstance) {
        socketInstance.removeAllListeners();
        socketInstance.disconnect();
        socketInstance = null;
    }
}

// Use a reliable actual audio file in the public folder
let notificationAudio = null;

function playNotificationSound() {
    try {
        if (!notificationAudio) {
            notificationAudio = new Audio("/notification.wav");
            notificationAudio.volume = 0.7;
        }
        notificationAudio.currentTime = 0;

        const playPromise = notificationAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Audio play prevented by browser policy. User needs to interact with page first.");
            });
        }
    } catch (e) {
        // Ignore
    }
}

export function useSocket() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        if (!token) return;

        // Already connected — don't recreate
        if (socketInstance?.connected) return;

        // Clean up stale instance
        if (socketInstance) {
            socketInstance.removeAllListeners();
            socketInstance.disconnect();
            socketInstance = null;
        }

        socketInstance = io(
            import.meta.env.VITE_API_URL || "http://localhost:9000",
            {
                auth: { token },
                withCredentials: true,
                transports: ["websocket"],
            }
        );

        socketInstance.on("connect", () => {
            console.log("Socket connected:", socketInstance.id);
        });

        socketInstance.on("connect_error", (err) => {
            console.error("Socket error:", err.message);
        });

        socketInstance.on("new_message", (msg) => {
            const myId = JSON.parse(localStorage.getItem("user") || "{}").id;
            const senderId = msg.sender_id || msg.sender?.id;
            const isMine = String(senderId) === String(myId);

            if (isMine && msg.tempId) {
                // This is handled by "message_sent" event below
                // Just replace temp message with real one, keep "sending" status
                // until "message_sent" confirms it
                dispatch(confirmSentMessage({ tempId: msg.tempId, realMsg: msg }));
            } else {
                dispatch(addIncomingMessage(msg));

                // Auto-mark as read if recipient has the chat open
                const activeRoomId = window.__chatActiveRoomId__;
                if (String(msg.room_id) === String(activeRoomId) && socketInstance) {
                    socketInstance.emit("mark_read", { roomId: msg.room_id });
                }
            }

            if (String(senderId) !== String(myId)) {
                playNotificationSound();
                dispatch(updateLastMessageTime({ userId: senderId }));
            }

            const activeRoomId = window.__chatActiveRoomId__;
            if (String(msg.room_id) !== String(activeRoomId)) {
                dispatch(incrementUnread({ roomId: msg.room_id, senderName: msg.sender?.name || "Someone" }));
                dispatch(setIncomingAlert({
                    roomId: msg.room_id,
                    senderName: msg.sender?.name || "Someone",
                    preview: msg.content ? msg.content.slice(0, 50) : msg.file_name || "Sent a file",
                }));
            }
        });

        socketInstance.on("user_status_changed", ({ userId, status }) => {
            dispatch(updateUserStatus({ userId, status }));
        });

        // Server confirmed message was saved (single tick)
        socketInstance.on("message_sent", ({ tempId, messageId }) => {
            dispatch(updateMessageStatus({ messageId, status: "sent" }));
        });

        // Server notifies that messages have been read by a recipient (double tick)
        socketInstance.on("message_read", ({ roomId, readerId, messageIds }) => {
            const myId = JSON.parse(localStorage.getItem("user") || "{}").id;
            // Only update if current user is not the reader (the reader doesn't need ticks)
            if (String(readerId) !== String(myId)) {
                dispatch(markMessagesAsRead({ messageIds }));
            }
        });

    }, [token, dispatch]);

    // Return the module-level instance directly so it's available on first render
    return socketInstance;
}