<script setup>
import { useChatInterface } from "../composables/useChatInterface";
import { useChatRoomSelection } from "../composables/useChatRoomSelection";
import { useRouter } from "vue-router";
import ChatHeader from "../components/ChatHeader.vue";
import OnlineUsersSidebar from "../components/OnlineUsersSidebar.vue";
import MessageList from "../components/MessageList.vue";
import TypingIndicator from "../components/TypingIndicator.vue";
import MessageInput from "../components/MessageInput.vue";
import PopularRoomsSidebar from "../components/PopularRoomsSidebar.vue";
import { computed } from "vue";
import { useStore } from "vuex";

const { fetchRooms } = useChatRoomSelection();

const {
  username,
  roomId,
  roomTitle,
  messages,
  newMessage,
  onlineUsers,
  typingStatus,
  totalCount,
  awayUsers,
  sendMessage,
  handleTyping,
  leaveRoom,
  creationDate,
  hoveredMessageId,
  setHoveredMessageId,
  clearHoveredMessageId,
  replyToMessage,
  reactToMessage,
  replyTarget,
  clearReplyTarget,
} = useChatInterface();

const router = useRouter();

const handleLeaveClick = () => {
  leaveRoom();
  router.push("/chatrooms");
};

const enterRoom = (room) => {
  leaveRoom();
  router.push({ path: "/chat", query: { roomId: room.id.toString() } });
};

const groupReactions = (reactions) => {
  return reactions.reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {});
};

const sendMessageWrapper = () => {
  if (replyTarget.value) {
    const messageData = {
      message: newMessage.value,
      replyTo: replyTarget.value._id,
    };
    sendMessage(messageData);
    clearReplyTarget();
  } else {
    sendMessage();
  }
  newMessage.value = "";
};

const getRepliedMessage = (replyToId) => {
  return messages.value.find((msg) => msg._id === replyToId) || {};
};

const activeCount = computed(
  () => onlineUsers.value.filter((u) => u.status === "active").length
);

const awayCount = awayUsers.value.length;


const onlineUsersActive = computed(() =>
  onlineUsers.value.filter((u) => u.status === "active")
);
const onlineUsersAway = computed(() =>
  onlineUsers.value.filter((u) => u.status === "away")
);

const store = useStore();
const popularRooms = computed(() =>
  store.getters["chat/getChatRooms"].slice(0, 5)
);

console.log("hell", awayUsers);

// Static data for demonstration
const participantCount = totalCount;
 
</script>

<template>
  <div class="h-full w-full p-4 md:p-8 flex items-center justify-center">
    <div
      class="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[80vh]"
    >
      <ChatHeader
        :room-title="roomTitle"
        :participant-count="participantCount"
        :creation-date="creationDate"
        @leave-room="handleLeaveClick"
      />
      <div class="flex flex-1 overflow-hidden">
        <OnlineUsersSidebar
          :totalCount="totalCount"
          :activeCount="activeCount"
          :onlineUsersActive="onlineUsersActive"
          :onlineUsersAway="awayUsers"
        />
        <main class="flex-1 flex flex-col bg-red-50 overflow-hidden relative">
          <div
            class="sticky top-0 z-10 flex justify-center items-center py-2 bg-red-50 bg-opacity-80 backdrop-blur-sm"
          >
            
          </div>
          <MessageList
            :messages="messages"
            :roomId="roomId"
            :username="username"
            :hovered-message-id="hoveredMessageId"
            :get-replied-message="getRepliedMessage"
            :group-reactions="groupReactions"
            @set-hovered-message="setHoveredMessageId"
            @clear-hovered-message="clearHoveredMessageId"
            @reply-to-message="replyToMessage"
            @react-to-message="
              (payload) =>
                reactToMessage(payload.message, payload.emoji, roomId, username)
            "
          />
          <TypingIndicator :typing-status="typingStatus" />
          <MessageInput
            :new-message="newMessage"
            :reply-target="replyTarget"
            @update:new-message="newMessage = $event"
            @handle-typing="handleTyping"
            @send-message="sendMessageWrapper"
            @clear-reply-target="clearReplyTarget"
          />
        </main>
        <PopularRoomsSidebar
          :popular-rooms="popularRooms"
          :totalCount="totalCount"
          @enter-room="enterRoom"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f472b6;
  border-radius: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #fceaf8;
}
</style>