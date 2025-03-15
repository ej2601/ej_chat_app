// src/composables/useChatState.js
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export function useChatState(socket) {
  const route = useRoute();
  const router = useRouter();
  const store = useStore();

  // Reactive roomId from the route query
  const roomId = computed(() => route.query.roomId);
  const roomTitle = ref("");
  const roomCreator = ref("");
  const roomDescription = ref("");
  const creationDate = ref("");

  // Chat state
  const messages = ref([]);
  const newMessage = ref("");
  const onlineUsers = ref([]);
  const typingStatus = ref("");
  const totalCount = ref(0);
  const awayUsers = ref([]);

  // Get user details from Vuex
  const userId = store.getters["auth/getUser"]; // Should be a string
  const userObjId = store.getters["auth/getUserId"]; // Should be a string
  const username = store.getters["auth/getUserName"];
  
// Assume the user avatar is stored in the auth module as well:
const userAvatar = store.getters["auth/getUserAvatar"]; // e.g., URL string
const userStatus = store.getters["auth/getUserStatus"]; // e.g., URL string



  // Function to fetch previous messages using a Vuex action
  const fetchMessages = async () => {
    try {
      const msgs = await store.dispatch("chat/fetchMessages", roomId.value);
      messages.value = msgs;
      // console.log(userAvatar);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Join room function
  const joinRoom = () => {
    
    if (roomId.value && userId) {
      socket.emit("joinRoom", { roomId: roomId.value, userObjId, userId, username, userAvatar, status: userStatus});
    }
  };

  // Leave room function
  const leaveRoom = () => {
    if (roomId.value && userId) {
      socket.emit("leaveRoom", { roomId: roomId.value, userObjId});
    }
  };

  // Send a new message
  const sendMessage = (messageData = {}) => {
    console.log(userAvatar);
    if (newMessage.value.trim() === "") return;
    const msgData = {
      roomId: roomId.value,
      senderId: userObjId,
    senderName: username,
    senderAvatar: userAvatar,
      message: newMessage.value,
    };

    // Include replyTo only if provided in messageData
    if (messageData.replyTo) {
      msgData.replyTo = messageData.replyTo;
    }
    socket.emit("chatMessage", msgData);
    newMessage.value = "";
    socket.emit("stopTyping", { roomId: roomId.value, sender: username });
  };

  // Handle typing events with a timeout
  let typingTimeout;
  const handleTyping = () => {
    socket.emit("typing", { roomId: roomId.value, sender: username });
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { roomId: roomId.value, sender: username });
    }, 1000);
  };

  // Socket event handlers
  socket.on("newMessage", (msg) => {
    if (msg.roomId === roomId.value) {
      messages.value.push(msg);
    }
  });

  // Listen for reaction updates
  socket.on("messageReactionUpdate", (data) => {
    const { messageId, reaction } = data;
    const index = messages.value.findIndex((msg) => msg._id === messageId);
    if (index !== -1) {
      if (!messages.value[index].reactions) {
        messages.value[index].reactions = [];
      }
      messages.value[index].reactions.push(reaction);
    }
  });

  socket.on("roomUpdate", (data) => {
    console.log(data);  
    if (data.roomDetails) {
    roomTitle.value = data.roomDetails.name;
    roomDescription.value = data.roomDetails.description;
    roomCreator.value = data.roomDetails.createdBy;
    onlineUsers.value = data.onlineUsers;
    creationDate.value = data.createdAtHuman;
  }
  onlineUsers.value = data.onlineUsers;
  totalCount.value = data.totalCount;
  awayUsers.value = data.awayUsers;
  });

  socket.on("typing", (data) => {
    if (data.sender !== username) {
      typingStatus.value = `${data.sender} is typing...`;
    }
  });

  socket.on("stopTyping", (data) => {
    if (data.sender !== username) {
      typingStatus.value = "";
    }
  });

  // Watch for changes in roomId and rejoin room if it changes
  watch(
    () => roomId.value,
    (newRoomId, oldRoomId) => {
      if (newRoomId !== oldRoomId) {
        leaveRoom();
        socket.emit("joinRoom", { roomId: roomId.value, userObjId, userId, username, userAvatar, status: userStatus });
        fetchMessages();
      }
    }
  );

  onMounted(() => {
    if (!store.getters['auth/isAuthenticated']) {
      router.push('/login');
    } else {
      if (!roomId.value) {
        router.push("/chatrooms");
        return;
      }
      joinRoom();
      console.log("terere",roomId.value);
      fetchMessages();
      window.addEventListener("beforeunload", leaveRoom);
    }

  });

  onUnmounted(() => {
    // leaveRoom();
    window.removeEventListener("beforeunload", leaveRoom);
  });

  return {
    username,
    roomId,
    roomTitle,
    roomCreator,
    roomDescription,
    messages,
    newMessage,
    onlineUsers,
    typingStatus,
    totalCount,
    awayUsers,
    sendMessage,
    handleTyping,
    creationDate,
    leaveRoom,
  };
}
