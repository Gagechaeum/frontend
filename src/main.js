import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import router from './router';
import './style.css';
import App from './App.vue';
import '@/lib/api/http';
import { useAuthStore } from '@/stores/auth';
import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.mount('#app');

// 백그라운드에서 세션 동기화 (화이트스크린 방지)
useAuthStore(pinia)
  .hydrateSession()
  .catch(() => {});
