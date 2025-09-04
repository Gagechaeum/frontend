import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// 요청 인터셉터
// - 토큰을 자동으로 첨부합니다.
api.interceptors.request.use(
  config => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 응답 인터셉터
// - 401 에러 시 토큰이 자동 삭제됩니다.
// 추후 활성화 예정

// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401) {
//       const authStore = useAuthStore();
//       authStore.clearToken();
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
