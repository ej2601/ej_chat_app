<template>
  <aside class="w-1/4 bg-gray-50 border-l border-gray-100 overflow-hidden flex flex-col">
    <div class="p-5 border-b border-gray-100">
      <h3 class="font-medium text-gray-800 mb-2">Popular Rooms</h3>
    </div>
    <div class="flex-1 overflow-y-auto p-3">
      <ul class="space-y-2">
        <li v-for="room in popularRooms" :key="room.id" class="p-3 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer group" @click="$emit('enter-room', room)">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center text-pink-700 shadow-sm">
              <img :src="room.createdBy.avatar || 'default-avatar.png'" alt="User Avatar" class="w-8 h-8 rounded-md" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h4 class="font-medium text-gray-800 truncate">{{ room.name }}</h4>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ room.members || 0 }} members • {{ room.userCount }} online
              </p>
              <div class="flex -space-x-2 mt-2">
                <div v-for="(avatarUrl, index) in room.userAvatars"
    :key="index" class="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-800">
    
                  <img :src="avatarUrl" alt="avatar" class="w-full rounded-xl h-full object-cover" />
                </div>
                
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  popularRooms: Array,
  totalCount: {
    type: Number,
    default: 0,
  },
});
defineEmits(['enter-room']);
</script>