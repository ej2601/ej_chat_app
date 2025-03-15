<script setup>
import { computed } from "vue";
import { useGroupedMessages } from "../composables/useGroupedMessages";
import MessageOptions from "./MessageOptions.vue";

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  roomId: String,
  username: String,
  hoveredMessageId: String,
  getRepliedMessage: Function,
  groupReactions: Function,
});
defineEmits([
  "set-hovered-message",
  "clear-hovered-message",
  "reply-to-message",
  "react-to-message",
]);

// Use the composable to group messages
const messagesRef = computed(() => props.messages);
const { groupedMessages, getDateLabel } = useGroupedMessages(messagesRef);
</script>

<template>
  <div
    class="flex-1 overflow-y-auto px-6 scroll-smooth scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent custom-scrollbar" @mouseleave="$emit('clear-hovered-message')"
  >
    <!-- Iterate over each date group -->
    <template v-for="(msgs, dateKey) in groupedMessages" :key="dateKey">
      <!-- Date Header with Animation -->
      <div
        class="sticky top-0 z-10 flex justify-center items-center py-2 bg-red-50 bg-opacity-80 backdrop-blur-sm animate-slideDown"
      >
        <div class="px-3 py-1 bg-red-200 rounded-full text-xs font-medium text-gray-600">
          {{ getDateLabel(dateKey) }}
        </div>
      </div>
      
      <!-- Iterate over messages for this date -->
      <div
        v-for="msg in msgs"
        :key="msg._id"
        class="relative mb-6 max-w-[60%]"
        :class="[msg.sender.name === username ? 'ml-auto' : 'mr-auto']"
        @click="$emit('set-hovered-message', msg._id)"
        
      >
        <div
          class="flex items-start gap-3"
          :class="[msg.sender.name === username ? 'flex-row-reverse' : 'flex-row']"
        >
          <div class="w-9 h-9 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 mt-1">
            <img
              v-if="msg.sender.avatar"
              :src="msg.sender.avatar"
              alt="Avatar"
              class="w-full h-full object-cover rounded-full"
            />
            <span
              v-else
              class="bg-gradient-to-br from-pink-400 to-pink-600 text-white font-medium w-full h-full flex items-center justify-center rounded-full"
            >
              {{ msg.sender.name.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex flex-col">
            <div
              class="flex items-center mb-1 text-xs text-gray-500"
              :class="[msg.sender.name === username ? 'justify-end' : 'justify-start']"
            >
              <span class="font-medium">{{ msg.sender.name || "Anonymous" }}</span>
              <span class="mx-2 text-gray-300">•</span>
              <span>
                {{
                  new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}
              </span>
            </div>
            <div
              class="p-4 rounded-2xl shadow-sm"
              :class="[
                msg.sender.name === username
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none',
              ]"
            >
              <p class="whitespace-pre-line">{{ msg.message }}</p>
              <div
                v-if="msg.replyTo"
                :class="[
                  msg.sender.name === username
                    ? 'bg-pink-50 bg-opacity-15 border-l-2 border-pink-300'
                    : 'bg-gray-50 border-l-2 border-pink-300',
                ]"
                class="mt-3 p-2 rounded-md text-sm"
              >
                <div class="flex items-center gap-1 opacity-75 mb-1 text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                  <span>Replying to</span>
                </div>
                <p class="text-sm">
                  {{ getRepliedMessage(msg.replyTo).message }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="msg.reactions && msg.reactions.length"
          :class="[msg.sender.name === username ? 'right-2' : 'left-12']"
          class="absolute -bottom-3 flex space-x-1 bg-white rounded-full px-2.5 py-1 shadow-md text-xs border border-pink-100"
        >
          <template
            v-for="(count, emoji) in groupReactions(msg.reactions)"
            :key="emoji"
          >
            <div class="flex items-center">
              <span class="text-base leading-none">{{ emoji }}</span>
              <span class="ml-1 text-xs font-medium text-gray-600">{{
                count
              }}</span>
            </div>
          </template>
        </div>
        <div
          v-if="hoveredMessageId === msg._id"
          class="absolute bottom-0 transform -translate-y-full z-10"
          :class="[msg.sender.name === username ? 'right-0' : 'left-0']"
        >
          <MessageOptions
            :message="msg"
            @reply="$emit('reply-to-message', msg)"
            @react="$emit('react-to-message', $event)"
          />
        </div>
      </div>
    </template>
  </div>
</template>


<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f472b6;
  border-radius: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f3f4f6;
}

/* Slide Down Animation for Date Headers */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slideDown {
  animation: slideDown 0.5s ease-out;
}

/* Slide Up Animation for Messages */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slideUp {
  animation: slideUp 0.6s ease-out;
}
</style>
