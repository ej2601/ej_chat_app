import { createStore } from 'vuex';
import auth from './modules/auth';
import chat from './modules/chat'; // Import chat module

export default createStore({
  modules: {
    auth,
    chat, 
  },
});
