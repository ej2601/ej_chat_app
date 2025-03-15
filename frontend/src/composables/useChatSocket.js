// src/composables/useChatSocket.js
import { io } from "socket.io-client";

export function useChatSocket(token) {
  // Connect to the Socket.IO server with token authentication
  const socket = io(import.meta.env.VITE_API_URL, {
    query: { token },
  });
  return socket;
}
