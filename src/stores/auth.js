/* eslint-env browser */
import { defineStore } from 'pinia';
import { me, logout } from '@/lib/api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, isReady: false }),
  persist: true,
  actions: {
    async hydrateSession() {
      try {
        const res = await me();
        this.user = res?.data?.data ?? res?.data ?? res ?? null;
      } catch (e) {
        // 세션 없음(401 등): 남은 토큰 정리하고 무시
        try {
          localStorage.removeItem('access_token');
        } catch (e2) {
          /* ignore */
        }
        this.user = null;
      } finally {
        this.isReady = true;
      }
    },

    async doLogout() {
      try {
        await logout();
      } catch (e) {
        // 이미 만료/로그아웃 상태일 수 있으므로 무시
      } finally {
        try {
          localStorage.removeItem('access_token');
        } catch (e2) {
          /* ignore */
        }
        this.user = null;
        this.isReady = true;
      }
    },
  },
});
