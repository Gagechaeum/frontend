/* eslint-env browser */
import { defineStore } from 'pinia';
import { me, logout, getUserProfile, getBusinessInfo } from '@/lib/api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    businessInfo: null,
    isReady: false,
  }),
  persist: true,
  getters: {
    chips: state => {
      const chips = [];
      // TODO: 백엔드에서 실제 BusinessInfo 데이터를 반환하도록 수정 후 활성화
      // if (state.businessInfo?.industryName) {
      //   chips.push(state.businessInfo.industryName);
      // }
      // if (state.businessInfo?.regionName) {
      //   chips.push(state.businessInfo.regionName);
      // }
      return chips;
    },
    userInfo: state => ({
      name: state.profile?.nickname || state.user?.name || '사용자',
      region: '', // TODO: 백엔드에서 실제 BusinessInfo 데이터를 반환하도록 수정 후 활성화
      business: '', // TODO: 백엔드에서 실제 BusinessInfo 데이터를 반환하도록 수정 후 활성화
    }),
  },
  actions: {
    async hydrateSession() {
      try {
        const res = await me();
        this.user = res?.data?.data ?? res?.data ?? res ?? null;

        if (this.user) {
          await this.loadUserData();
        }
      } catch {
        try {
          localStorage.removeItem('access_token');
        } catch {
          // localStorage 접근 실패 무시
        }
        this.user = null;
        this.profile = null;
        this.businessInfo = null;
      } finally {
        this.isReady = true;
      }
    },

    async loadUserData() {
      try {
        const [profileRes, businessRes] = await Promise.all([
          getUserProfile().catch(() => null),
          getBusinessInfo().catch(() => null),
        ]);

        this.profile = profileRes?.data || null;
        this.businessInfo = null;

        // TODO: 백엔드에서 실제 BusinessInfo 데이터를 반환하도록 수정 필요
        console.log('Profile data:', profileRes?.data);
        console.log('Business data:', businessRes?.data);
      } catch (error) {
        console.error('사용자 데이터 로드 실패:', error);
      }
    },

    async doLogout() {
      try {
        await logout();
      } catch {
        // 이미 만료/로그아웃 상태일 수 있으므로 무시
      } finally {
        try {
          localStorage.removeItem('access_token');
        } catch {
          /* ignore */
        }
        this.user = null;
        this.profile = null;
        this.businessInfo = null;
        this.isReady = true;
      }
    },
  },
});
