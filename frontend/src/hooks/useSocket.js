import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { addIncomingMessage, updateUserStatus, incrementUnread, setIncomingAlert, updateLastMessageTime } from "../features/chat/chatSlice.js";

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

        // Browsers require a user interaction first. We catch the error so it doesn't break the app.
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
            dispatch(addIncomingMessage(msg));

            // Play sound + track timestamp for all incoming messages from OTHER users
            const myId = JSON.parse(localStorage.getItem("user") || "{}").id;
            const senderId = msg.sender_id || msg.sender?.id;
            if (String(senderId) !== String(myId)) {
                playNotificationSound();
                dispatch(updateLastMessageTime({ userId: senderId }));
            }

            const activeRoomId = window.__chatActiveRoomId__;

            if (String(msg.room_id) !== String(activeRoomId)) {
                dispatch(incrementUnread({
                    roomId: msg.room_id,
                    senderName: msg.sender?.name || "Someone"
                }));
                dispatch(setIncomingAlert({
                    roomId: msg.room_id,
                    senderName: msg.sender?.name || "Someone",
                    preview: msg.content
                        ? msg.content.slice(0, 50)
                        : msg.file_name || "Sent a file",
                }));
            }
        });

        socketInstance.on("user_status_changed", ({ userId, status }) => {
            dispatch(updateUserStatus({ userId, status }));
        });

    }, [token, dispatch]);

    // Return the module-level instance directly so it's available on first render
    return socketInstance;
}