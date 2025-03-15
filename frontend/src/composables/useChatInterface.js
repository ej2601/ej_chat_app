// src/composables/useChatInterface.js
import { useChatSocket } from "./useChatSocket";
import { useChatState } from "./useChatState";
import { useMessageInteraction } from "./useMessageInteraction";
import { useStore } from "vuex";

export function useChatInterface() {
  const store = useStore();
  // Get the token from Vuex or localStorage
  const token = store.getters["auth/getToken"] || localStorage.getItem("token");
  const socket = useChatSocket(token);
  const state = useChatState(socket);
  const msginteraction = useMessageInteraction(socket);
  return { socket, ...state, ...msginteraction };
}
