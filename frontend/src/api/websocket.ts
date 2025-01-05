import { io, Socket } from "socket.io-client";
import { BASE_URL } from "./config";

let socket: Socket | null = null;

export const connectWebSocket = (accessToken: string, onNotification: (data: any) => void) => {
  if (socket) {
    console.warn("WebSocket already connected.");
    disconnectWebSocket();
  }

  console.log("Connecting WebSocket...");

  socket = io(`${BASE_URL}/api/notifications`, {
    auth: { token: accessToken },
  });

  socket.on("connect", () => {
    console.log("WebSocket connected.");
  });

  socket.on("notification", (data) => {
    console.log("New Notification:", data);
    onNotification(data);
  });

  socket.on("error", (err) => {
    console.error("WebSocket Error:", err.message);
  });

  socket.on("disconnect", () => {
    console.log("WebSocket disconnected.");
  });
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("WebSocket disconnected.");
  }
};
