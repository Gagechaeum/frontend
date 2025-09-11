/* eslint-env browser */
import { defineStore } from 'pinia';
import { me, logout, getUserProfile, getBusinessInfo } from '@/lib/api/auth';
import { getRegionName, getIndustryName } from '@/constants/business';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    businessInfo: [], // 모든 사업자 정보 저장
    isReady: false,
  }),
  persist: true,
  getters: {
    // 첫 번째 사업자 정보만 사용 시
    primaryBusiness: state => state.businessInfo?.[0] || null,

    // 모든 사업자 정보 사용 시
    allBusinessInfo: state => state.businessInfo || [],

    chips: state => {
      const business = state.businessInfo?.[0];
      if (!business) return [];

      const chips = [];
      if (business.industryId) {
        chips.push(getIndustryName(business.industryId));
      }
      if (business.regionId) {
        chips.push(getRegionName(business.regionId));
      }
      return chips;
    },
    userInfo: state => ({
      name: state.profile?.nickname || state.user?.name || '사용자',
      region: state.businessInfo?.[0]?.regionId
        ? getRegionName(state.businessInfo[0].regionId)
        : '',
      business: state.businessInfo?.[0]?.industryId
        ? getIndustryName(state.businessInfo[0].industryId)
        : '',
    }),
  },
  actions: {
    async hydrateSession() {
      try {
        const res = await me();
        this.user = res?.data?.data ?? res?.data ?? res ?? null;

        if (this.user) {
          await this.loadUserProfile();
        }
      } catch {
        try {
          localStorage.removeItem('access_token');
        } catch {
          // localStorage 접근 실패 무시
        }
        this.user = null;
        this.profile = null;
        this.businessInfo = [];
      } finally {
        this.isReady = true;
      }
    },

    async loadUserProfile() {
      try {
        const profileRes = await getUserProfile();
        this.profile = profileRes?.data || null;
      } catch (error) {
        console.error('사용자 프로필 로드 실패:', error);
      }
    },

    // 사업자 정보 로드 (AppHeader에서 호출)
    async loadBusinessInfo() {
      try {
        const businessRes = await getBusinessInfo();
        if (businessRes?.data && Array.isArray(businessRes.data)) {
          this.businessInfo = businessRes.data;
        } else {
          this.businessInfo = [];
        }
        return this.businessInfo;
      } catch (error) {
        console.error('사업자 정보 로드 실패:', error);
        this.businessInfo = [];
        return [];
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
        this.businessInfo = [];
        this.isReady = true;
      }
    },
  },
});
