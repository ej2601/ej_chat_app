<template>
  <header class="bg-white border-b border-pink-100 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h10" />
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-gray-800">{{ roomTitle }}</h2>
        <p class="text-xs text-gray-500">{{ participantCount }} participants • Created {{ creationDate }}</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button @click="$emit('leave-room')" class="px-4 py-2 rounded-full text-sm font-medium bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors flex items-center gap-2">
        <span>Leave</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  roomTitle: String,
  participantCount: Number,
  creationDate: String,
});
defineEmits(['leave-room']);
</script>