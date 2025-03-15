// src/store/modules/auth.js
import axios from '../../utils/axios';

const state = {
  token: localStorage.getItem('token') || '',
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null, // Optionally, store user details here.
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  getToken: (state) => state.token,
  getUserId: (state) => state.user._id,
  getUser: (state) => state.user.username,
  getUserName: (state) => state.user.name,
  getUserStatus: (state) => state.user.status,
  getUserAvatar: (state) => (state.user ? state.user.avatar : ''), 
    // You can add a getter for user details if needed.
};

const actions = {
  async login({ commit }, credentials) {
    try {
      // Make the API call to the backend for login
      const response = await axios.post('/api/auth/login', credentials);
      const token = response.data.token;
      const user = response.data.user;

      // Store token in localStorage for persistence
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Commit mutation to update state
      commit('SET_TOKEN', token);
      commit('SET_USER', user);

      // Optionally, you could dispatch another action to fetch user details
      return response;
    } catch (error) {
      throw error;
    }
  },
  logout({ commit }) {
    // Clear token from localStorage and state
    localStorage.removeItem('token');
    commit('SET_TOKEN', '');
    commit('SET_USER', null);
  },
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_USER(state, user) {
    state.user = user;
  },
  };

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
