<script setup>
import { ref } from 'vue';
import axios from '../utils/axios';
import { useRouter } from 'vue-router';
import InputField from '../components/InputField.vue';
import AuthForm from '../components/AuthForm.vue';

const router = useRouter();

const username = ref('');
const email = ref('');
const name = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const register = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  // Validation
  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'All fields are required.';
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }

  try {
    await axios.post('/api/auth/register', {
      username: username.value,
      email: email.value,
      name: name.value,
      password: password.value
    });

    successMessage.value = 'Registration successful! Redirecting to login...';

    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Something went wrong.';
  }
};
</script>
<template>
  <AuthForm>
    <div class="max-w-md mx-auto bg-red-50 shadow-lg rounded-lg overflow-hidden p-8">
      <h2 class="text-3xl font-bold mb-6 text-center text-pink-600">Register</h2>
      <form @submit.prevent="register" class="space-y-4">
        <InputField
          label="Username"
          v-model="username"
          input-class="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-pink-500"
        />
        <InputField
          label="Email"
          type="email"
          v-model="email"
          input-class="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-pink-500"
        />
        <InputField
          label="Name (Optional)"
          v-model="name"
          input-class="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-pink-500"
        />
        <InputField
          label="Password"
          type="password"
          v-model="password"
          input-class="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-pink-500"
        />
        <InputField
          label="Confirm Password"
          type="password"
          v-model="confirmPassword"
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
          Register
        </button>
      </form>

      <div class="mt-4 text-center text-sm">
        <router-link to="/login" class="text-pink-500 hover:underline">
          Already have an account? Login
        </router-link>
      </div>
    </div>
  </AuthForm>
</template>
