// src/store/modules/chat.js
import axios from '../../utils/axios';

const state = {
  chatRooms: [],
  messages: []  // new state for messages if you want to store them globally
};

const getters = {
  getChatRooms: (state) => state.chatRooms,
  getMessages: (state) => state.messages,
  
};

const actions = {
  // Fetch chat rooms from the backend
  async fetchChatRooms({ commit }) {
    try {
      const response = await axios.get('/api/chatrooms');
      commit('SET_CHAT_ROOMS', response.data);
   
    } catch (error) {
      throw error;
    }
  },

  // Create a new chat room
  async createRoom({ dispatch }, { name, description }) {
    try {
      await axios.post('/api/chatrooms', { name, description });
      // Refresh the chat room list after creation
      dispatch('fetchChatRooms');
    } catch (error) {
      throw error;
    }
  },

  // Fetch messages for a given room
  async fetchMessages({ commit }, roomId) {
    try {
      const response = await axios.get(`/api/messages/${roomId}`);
      commit('SET_MESSAGES', response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


const mutations = {
  SET_CHAT_ROOMS(state, rooms) {
    state.chatRooms = rooms;
  },
  
  SET_MESSAGES(state, messages) {
    state.messages = messages;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
