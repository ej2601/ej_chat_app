<template>
  <div class="relative flex flex-col bg-red-200 shadow-md rounded-lg p-2">
    <!-- Action Buttons -->
    <div class="flex space-x-3">
      <button 
        @click="onReply" 
        class="text-pink-600 hover:text-pink-800 font-medium transition">
        💬 Reply
      </button>
      <button 
        @click="toggleEmojiPicker" 
        class="text-yellow-500 hover:text-yellow-700 font-medium transition">
        😀
      </button>
    </div>

    <!-- Emoji Picker -->
    <div 
      v-if="showEmojiPicker" 
      class="mt-2 flex space-x-2 bg-white px-3 py-2 flex-wrap w-full rounded-lg shadow-lg">
      <button 
        v-for="emoji in emojis" 
        :key="emoji" 
        @click="selectEmoji(emoji)" 
        class="text-xl hover:scale-125 transition transform hover:bg-white rounded-full p-1">
        {{ emoji }}
      </button>
    </div>
  </div>
</template>




<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  message: { type: Object, required: true },
});

const emit = defineEmits(["reply", "react"]);

const showEmojiPicker = ref(false);
const emojis = ["👍", "❤️", "😂", "😮", "😢", "👏", "🔥", "😡", "😎", "🤔"]; // 10 emojis

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const selectEmoji = (emoji) => {
  emit("react", { message: props.message, emoji });
  showEmojiPicker.value = false;
};

const onReply = () => {
  emit("reply", props.message);
};
</script>

<style scoped>
/* You can add further styles as needed */
</style>
