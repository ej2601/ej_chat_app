<script setup>
import { ref } from "vue";
import axios from "../utils/axios";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import InputField from "../components/InputField.vue";
import AuthForm from "../components/AuthForm.vue";

const router = useRouter();
const store = useStore();

const identifier = ref("");
const password = ref("");
const errorMessage = ref("");
const successMessage = ref("");

const login = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  // Basic client-side validation
  if (!identifier.value || !password.value) {
    errorMessage.value = "Both fields are required";
    return;
  }

  try {
    // Dispatch the login action from Vuex
    await store.dispatch("auth/login", {
      identifier: identifier.value,
      password: password.value,
    });

    successMessage.value = "Login successful! Redirecting...";

    // Redirect to a protected route or dashboard after a short delay
    setTimeout(() => {
      router.push("/chatrooms"); // Replace with your target route
    }, 2000);
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Something went wrong";
  }
};
</script>

<template>
  <AuthForm>
    <div
      class="max-w-md mx-auto bg-red-50 shadow-lg rounded-lg overflow-hidden p-8"
    >
      <h2 class="text-3xl font-bold mb-6 text-center text-pink-600">Login</h2>
      <form @submit.prevent="login" class="space-y-4">
        <InputField
          label="Email or Username"
          v-model="identifier"
          input-class="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-pink-500"
        />
        <InputField
          label="Password"
          type="password"
          v-model="password"
          input-class="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-pink-500"
        />

        <p v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </p>
        <p v-if="successMessage" class="text-green-500 text-sm">
          {{ successMessage }}
        </p>

        <button
          type="submit"
          class="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition-colors duration-300"
        >
          Login
        </button>
      </form>

      <div class="mt-4 text-center text-sm">
        <router-link
          to="/forgot-password"
          class="text-pink-500 hover:underline"
        >
          Forgot Password?
        </router-link>
      </div>

      <div class="mt-2 text-center text-sm">
        <span>Don't have an account? </span>
        <router-link to="/register" class="text-pink-500 hover:underline">
          Register
        </router-link>
      </div>
    </div>
  </AuthForm>
</template>

<style scoped>
/* Add animation to the form */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

form {
  animation: fadeIn 0.8s ease-out;
}
</style>
