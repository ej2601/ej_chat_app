<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";


const store = useStore();
const router = useRouter();

// Check if user is logged in (from Vuex store)
const isAuthenticated = computed(() => store.getters["auth/isAuthenticated"]);

// Logout function
const logout = () => {
  store.dispatch("auth/logout"); // Dispatch logout action
  router.push("/login"); // Redirect to login page
};
</script>



<template>
  <div class="bg-red-50 w-screen h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-pink-700 text-white shadow-md">
      <div class="max-w-6xl mx-auto flex justify-between items-center p-4">
        <h1 class="text-4xl font-extrabold text-white hover:text-pink-300 transition duration-300">
          Chat Room App
        </h1>

        <!-- Logout Button if User is Logged In -->
        <button
          v-if="isAuthenticated"
          @click="logout"
          class="bg-white text-pink-700 border border-pink-700 px-4 py-2 rounded hover:bg-pink-100 transition duration-300"
        >
          Logout
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-auto flex justify-center items-center">
      <!-- Routed pages like Register, Login, Chat Rooms, etc. will appear here -->
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-pink-800 text-white text-center py-4">
      <p class="text-sm">
        © 2025 Chat Room App
      </p>
    </footer>
  </div>
</template>

<style scoped>
/* Fade-in animation
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

main {
  animation: fadeIn 0.6s ease-in-out;
} */
</style>