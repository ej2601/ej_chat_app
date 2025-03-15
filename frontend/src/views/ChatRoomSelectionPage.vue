<script setup>
import { useChatRoomSelection } from "../composables/useChatRoomSelection";

const {
  newRoomName,
  newRoomDescription,
  searchQuery,
  filteredRooms,
  errorMessage,
  successMessage,
  chatRooms,
  createRoom,
  joinRoom,
} = useChatRoomSelection();
</script>

<template>
  <div
    class="min-h-full min-w-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-red-50 p-6"
  >
    <div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Left Section: Create & Search Room -->
      <div
        class="bg-white p-8 rounded-2xl shadow-2xl backdrop-blur-lg bg-opacity-80 animate-fadeIn"
      >
        <h2 class="text-3xl font-bold text-pink-600 mb-6 text-center">
          Create & Search Chat Rooms
        </h2>

        <!-- Create Room Form -->
        <div class="mb-6">
          <input
            v-model="newRoomName"
            type="text"
            placeholder="Enter Room Name"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          />
          <textarea
            v-model="newRoomDescription"
            placeholder="Room Description (Optional)"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all mt-3"
          ></textarea>
          <button
            @click="createRoom"
            class="w-full bg-pink-600 text-white py-3 rounded-lg mt-4 font-semibold shadow-md hover:bg-pink-700 transition-all transform hover:scale-105"
          >
            + Create Room
          </button>
        </div>

        <!-- Status Messages -->
        <p v-if="errorMessage" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </p>
        <p v-if="successMessage" class="text-green-500 text-sm text-center">
          {{ successMessage }}
        </p>
      </div>

      <!-- Right Section: Available Rooms -->
      <div class="space-y-4">
        <h2 class="text-3xl font-bold text-pink-600 text-center mb-4">
          Available Chat Rooms
        </h2>

        <!-- Search Bar -->
        <div class="relative mb-6 w-full max-w-md mx-auto animate-slideDown">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="🔍 Search Chat Rooms..."
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all transform focus:scale-105"
          />
        </div>

        <!-- Scrollable Room List Container -->
        <div
          class="p-5 rounded-lg md:max-h-[calc(100vh-50vh)] overflow-y-auto custom-scrollbar"
        >
          <div
            v-if="filteredRooms.length === 0"
            class="text-center text-gray-500"
          >
            No chat rooms found. Try creating one! 🚀
          </div>

          <div
            v-for="room in filteredRooms"
            :key="room.id"
            class="bg-yellow-50 p-4 rounded-lg shadow-md flex flex-col justify-between transform transition-all hover:shadow-lg hover:scale-[1.02] animate-slideUp mb-5"
          >
            <div>
              <!-- Room Name -->
              <h3 class="text-xl font-bold text-pink-600">{{ room.name }}</h3>
              <p class="text-gray-600">
                {{ room.description || "No description available" }}
              </p>

              <!-- User Count with Animated Icons -->
              <p class="mt-2 text-sm flex items-center justify-center space-x-2">
                <span
                  class="inline-block w-3.5 h-3.5 rounded-full animate-pulse"
                  :class="room.userCount > 0 ? 'bg-pink-600' : 'bg-gray-400'"
                ></span>
                <span class="text-gray-500">
                  {{
                    room.userCount > 0
                      ? `${room.userCount} users online`
                      : "No users online"
                  }}
                </span>
              </p>

              <!-- Created By Section with Avatar -->
              <p class="mt-2 text-sm flex items-center justify-center space-x-3 text-gray-500">
                
                <img
                  :src="room.createdBy.avatar || 'default-avatar.png'"
                  alt="User Avatar"
                  class="w-8 h-8 rounded-full border-2 border-pink-500 shadow-md"
                />
                <span
                  >Created by:
                  <strong>{{
                    room.createdBy.name || room.createdBy.username
                  }}</strong></span
                >
              </p>
            </div>

            <!-- Join Button -->
            <button
              @click="joinRoom(room.id)"
              class="mt-4 w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-all transform hover:scale-105"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>

      <!-- Right Section: Available Rooms -->
    </div>
  </div>
</template>

<style scoped>
/* Smooth Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.8s ease-out;
}

/* Slide Up Animation for Chat Rooms */
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

/* Slide Down Animation for Search Bar */
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


/* Blinking animation for user status */
@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.animate-pulse {
  animation: blink 1s infinite ease-in-out;
}


/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f472b6;
  border-radius: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #fceaf8;
}
</style>
