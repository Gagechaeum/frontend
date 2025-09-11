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
// 로그인 페이지에서는 세션 동기화를 시도하지 않음
if (window.location.pathname !== '/login') {
  useAuthStore(pinia)
    .hydrateSession()
    .catch(error => {
      // 401 오류는 정상적인 비로그인 상태이므로 무시
      if (error?.response?.status === 401) {
        console.log('비로그인 상태 - 세션 동기화 건너뜀');
        return;
      }
      // 다른 오류는 콘솔에 로그만 남기고 무시
      console.warn('세션 동기화 실패:', error);
    });
}
