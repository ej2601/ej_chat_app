<template>
  <div class="border-t border-gray-100 p-4 bg-white relative">
    <!-- Reply Target (if any) -->
    <div
      v-if="replyTarget"
      class="mb-3 bg-pink-50 rounded-lg p-3 flex justify-between items-center border-l-4 border-pink-300"
    >
      <div class="flex flex-col">
        <span class="text-xs font-medium text-pink-600 mb-1">Replying to</span>
        <span class="text-sm text-gray-700">{{ replyTarget.message }}</span>
      </div>
      <button @click="$emit('clear-reply-target')" class="text-pink-500 hover:text-pink-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Message Input and Emoji Picker -->
    <div class="flex items-center gap-2 relative">
      <!-- Emoji Button -->
      <button
        @click="toggleEmojiPicker"
        class="p-2 text-gray-500 hover:text-pink-600 transition-colors rounded-full hover:bg-pink-50 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <!-- Emoji Picker Popover -->
      <div
        v-if="showEmojiPicker"
        class="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-lg p-3 z-20 animate-fadeIn"
      >
        <div class="grid grid-cols-6 gap-2">
          <button
            v-for="emoji in emojis"
            :key="emoji"
            @click="addEmoji(emoji)"
            class="text-2xl hover:scale-110 transition-transform"
          >
            {{ emoji }}
          </button>
        </div>
      </div>

      <!-- Message Input Field -->
      <div class="flex-1 relative rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-pink-200 bg-gray-50">
        <input
          v-model="localNewMessage"
          @input="handleTyping"
          @keyup.enter="onSend"
          type="text"
          :placeholder="replyTarget ? 'Type your reply...' : 'Type your message...'"
          class="w-full py-3 px-4 bg-transparent rounded-full focus:outline-none text-gray-700"
        />
      </div>

      <!-- Send Button -->
      <button
        @click="onSend"
        class="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-3 rounded-full hover:shadow-md transition-all duration-200 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

// Define props and emits
const props = defineProps({
  newMessage: String,
  replyTarget: Object,
});
const emit = defineEmits(["update:newMessage", "handle-typing", "send-message", "clear-reply-target"]);

// Local copy of the message input
const localNewMessage = ref(props.newMessage);

// Sync prop to local state
watch(() => props.newMessage, (newVal) => {
  localNewMessage.value = newVal;
});
watch(localNewMessage, (newVal) => {
  emit("update:newMessage", newVal);
});

// State for showing emoji picker
const showEmojiPicker = ref(false);

// A simple list of emojis (customize as needed)
const emojis = ["😀", "😂", "😍", "👍", "🎉", "😢", "😎", "🙌"];

// Toggle the emoji picker panel
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

// When an emoji is selected, insert it into the message input field
const addEmoji = (emoji) => {
  // Append the emoji to the current message text
  localNewMessage.value += emoji;
  // Hide the emoji picker after selection
  showEmojiPicker.value = false;
  // Focus back on the input (optional)
  // You can use a ref on the input element if needed.
};

// When the user clicks send (or presses Enter)
const onSend = () => {
  // Emit send-message event (parent handles sending)
  emit("send-message");
  // Clear local message input (optional if parent clears it)
  localNewMessage.value = "";
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
