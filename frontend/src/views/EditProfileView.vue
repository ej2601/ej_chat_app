<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "../utils/axios";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const username = ref("");
const email = ref("");
const name = ref("");
const avatar = ref("");
const errorMessage = ref("");
const successMessage = ref("");

// Function to generate a random avatar URL using Pravatar
const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * 70) + 1;
  return `https://i.pravatar.cc/150?img=${randomIndex}`;
};

const randomizeAvatar = () => {
  avatar.value = getRandomAvatar();
};

const fetchProfile = async () => {
  try {
    const res = await axios.get("/api/profile");
    const data = res.data;
    username.value = data.username;
    email.value = data.email;
    name.value = data.name;
    avatar.value = data.avatar;

    localStorage.setItem('user', JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching profile:", error);
    errorMessage.value =
      error.response?.data?.message || "Error fetching profile";
  }
};

const updateProfile = async () => {
  console.log(store.getters["auth/getUserId"]);
  try {
    const res = await axios.put("/api/profile", {
      username: username.value,
      email: email.value,
      name: name.value,
      avatar: avatar.value,
    });
    successMessage.value = "Profile updated successfully!";
    // Optionally update Vuex state with the new profile
    store.commit("auth/SET_USER", res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
    console.log(store.getters["auth/getUserAvatar"], res.data);
  } catch (error) {
    console.error("Error updating profile:", error);
    errorMessage.value =
      error.response?.data?.message || "Error updating profile";
  }
};

onMounted(() => {
  if (!store.getters["auth/isAuthenticated"]) {
    router.push("/login");
  } else {
    fetchProfile();
  }
});
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-red-50 p-6">
    <div class="w-full max-w-md bg-white bg-opacity-80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl animate-fadeIn">
      <h1 class="text-3xl font-bold text-pink-600 text-center mb-6">Edit Profile</h1>
      
      <div v-if="errorMessage" class="text-red-500 mb-2 text-center">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="text-green-500 mb-2 text-center">
        {{ successMessage }}
      </div>
      
      <form @submit.prevent="updateProfile">
        <!-- Username -->
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-1">Username</label>
          <input
            type="text"
            v-model="username"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          />
        </div>
        
        <!-- Email -->
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-1">Email</label>
          <input
            type="email"
            v-model="email"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          />
        </div>
        
        <!-- Name -->
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-1">Name</label>
          <input
            type="text"
          v-model="name"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
        />
        </div>
        
        <!-- Avatar -->
        <div class="mb-6">
          <label class="block text-gray-700 font-semibold mb-1">Avatar</label>
          <div class="flex items-center space-x-4">
            <img
              :src="avatar"
              alt="Avatar"
              class="w-16 h-16 rounded-full object-cover border-2 border-pink-500 shadow-md"
            />
            <button
              type="button"
              @click="randomizeAvatar"
              class="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600 transition-all transform hover:scale-105"
            >
              Randomize Avatar
            </button>
          </div>
        </div>
        
        <!-- Update Button -->
        <div class="flex justify-center">
          <button
            type="submit"
            class="bg-pink-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-pink-700 transition-all transform hover:scale-105"
          >
            Update Profile 
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

