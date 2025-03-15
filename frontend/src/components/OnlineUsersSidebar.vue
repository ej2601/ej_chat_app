<template>
  <aside class="w-1/4 bg-gray-50 border-r border-gray-100 overflow-y-auto flex flex-col">
    <div class="p-4 border-b border-gray-100">
      <h3 class="font-medium text-gray-800 mb-4">Online Users</h3>
      
    </div>
    <div class="flex-1 overflow-y-auto p-2">
      <div class="py-2 px-3 mt-4">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          Active • {{ activeCount }}
        </p>
      </div>
      <ul>
        <li
          v-for="user in onlineUsersActive"
          :key="user.id"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors cursor-pointer"
        >
          <div class="relative">
            <img
              :src="user.avatarUrl"
              alt="avatar"
              class="w-10 h-10 rounded-full object-cover"
            />
            <!-- Active indicator -->
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <p class="text-lg font-medium text-gray-800">{{ user.name }}</p>
          </div>
        </li>
      </ul>
      <div class="py-2 px-3 mt-4">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          Away • {{ onlineUsersAway.length }}
        </p>
      </div>
      <ul>
        <li
          v-for="user in onlineUsersAway"
          :key="user.id"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors cursor-pointer opacity-60"
        >
          <div class="relative">
            <img
              :src="user.avatar"
              alt="avatar"
              class="w-10 h-10 rounded-full object-cover"
            />
            <!-- Away indicator -->
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-800">{{ user.name }}</p>
            <p class="text-xs text-gray-500">Away</p>
          </div>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
const props = defineProps({
   
  totalCount: {
    type: Number,
    default: 0,
  },
 
  activeCount: {
    type: Number,
    default: 0,
  },
  
  onlineUsersActive: {
    type: Array,
    default: () => [],
  },
  onlineUsersAway: {
    type: Array,
    default: () => [],
  },
});
</script>
