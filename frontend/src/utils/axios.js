import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import store from '../store'; // Path to your Vuex store

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', // Use environment variable or default URL
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Allows cookies for authentication
});

// Attach token automatically to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve token from local storage
  if (token) {

    // Decode token to check if it is expired
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      // // Token expired: dispatch logout and throw an error or reject the request.
      store.dispatch('auth/logout');
      return Promise.reject(new Error('Token expired'));
    }

    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
