import { defineStore } from 'pinia';
import { ref } from 'vue';

// 토큰 관리 store
export const useAuthStore = defineStore('auth', () => {
  // 토큰 상태 (localStorage에서 초기값 가져옴)
  const token = ref(localStorage.getItem('token') || null);

  // 토큰 설정
  const setToken = newToken => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  // 토큰 삭제
  const clearToken = () => {
    token.value = null;
    localStorage.removeItem('token');
  };

  return { token, setToken, clearToken };
});
