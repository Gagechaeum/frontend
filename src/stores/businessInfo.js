import { defineStore } from 'pinia';
import { getBusinessInfo } from '@/lib/api/auth';
import { getRegionName, getIndustryName } from '@/constants/business';

export const useBusinessInfoStore = defineStore('businessInfo', {
  state: () => ({
    businessInfo: [], // 모든 사업자 정보 저장
    isLoading: false,
    error: null,
  }),

  persist: true,

  getters: {
    // 첫 번째 사업자 정보만 사용 시
    primaryBusiness: state => state.businessInfo?.[0] || null,

    // 모든 사업자 정보 사용 시
    allBusinessInfo: state => state.businessInfo || [],

    // 칩 정보 생성 (지역, 업종)
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

    // 사용자 정보 객체 생성
    userInfo: state => ({
      name: '사용자', // 이름은 auth store에서 관리
      region: state.businessInfo?.[0]?.regionId
        ? getRegionName(state.businessInfo[0].regionId)
        : '',
      business: state.businessInfo?.[0]?.industryId
        ? getIndustryName(state.businessInfo[0].industryId)
        : '',
    }),

    // 지역명만 반환
    regionName: state => {
      const business = state.businessInfo?.[0];
      return business?.regionId ? getRegionName(business.regionId) : '';
    },

    // 업종명만 반환
    industryName: state => {
      const business = state.businessInfo?.[0];
      return business?.industryId ? getIndustryName(business.industryId) : '';
    },

    // 사용자의 모든 industryId 배열 반환
    allIndustryIds: state => {
      const result =
        state.businessInfo
          ?.map(business => business.industryId)
          .filter(id => id != null) || [];
      return result;
    },
  },

  actions: {
    // 사업자 정보 로드
    async loadBusinessInfo() {
      this.isLoading = true;
      this.error = null;

      try {
        const businessRes = await getBusinessInfo();
        if (businessRes?.data && Array.isArray(businessRes.data)) {
          this.businessInfo = businessRes.data;
        } else {
          this.businessInfo = [];
        }
        return this.businessInfo;
      } catch (error) {
        this.error = error;
        this.businessInfo = [];
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    // 사업자 정보 초기화
    clearBusinessInfo() {
      this.businessInfo = [];
      this.error = null;
    },

    // 특정 사업자 정보 설정
    setBusinessInfo(businessData) {
      if (Array.isArray(businessData)) {
        this.businessInfo = businessData;
      } else if (businessData) {
        this.businessInfo = [businessData];
      } else {
        this.businessInfo = [];
      }
    },
  },
});
