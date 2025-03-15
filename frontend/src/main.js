import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/tailwind.css';
import store from './store';
import router from './router';


const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
