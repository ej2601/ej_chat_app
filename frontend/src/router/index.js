import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import LoginView from '../views/LoginView.vue';
import ChatRoomSelectionPage from '../views/ChatRoomSelectionPage.vue';
import ChatInterface from '../views/ChatInterface.vue'; // New Chat Interface view
import EditProfileView from '../views/EditProfileView.vue';

const routes = [
  { path: '/', redirect: '/chatrooms' }, // Default redirect
  { path: '/register', component: Register },
  { path: '/login', component: LoginView },
  { path: '/chatrooms', component: ChatRoomSelectionPage },
  { path: '/chat', component: ChatInterface },
  { path: '/profile/edit', component: EditProfileView },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
