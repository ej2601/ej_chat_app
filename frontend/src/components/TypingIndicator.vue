<template>
  <div v-if="typingStatus" class="px-6 py-2 border-t border-gray-100">
    <div class="flex items-center gap-2 text-sm text-pink-500">
      <div class="flex space-x-1">
        <div class="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
        <div class="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 200ms"></div>
        <div class="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 400ms"></div>
      </div>
      <span>{{ typingStatus }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  typingStatus: String,
});
</script>