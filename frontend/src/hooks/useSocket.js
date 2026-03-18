import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { addIncomingMessage } from "../features/chat/chatSlice.js";

let socketInstance = null;

export function disconnectSocket() {
    if (socketInstance) {
        socketInstance.removeAllListeners();
        socketInstance.disconnect();
        socketInstance = null;
    }
}

export function useSocket() {
    const dispatch = useDispatch();
    const socketRef = useRef(null);
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        if (!token) return;

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
        });

        socketRef.current = socketInstance;

        return () => {
            socketInstance?.off("new_message");
        };
    }, [token, dispatch]);

    return socketRef.current;
}