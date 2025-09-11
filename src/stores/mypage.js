// src/stores/mypage.js
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import {
  hydrateMypageBundle,
  updateUser,
  updateProfileImage,
  withdraw as apiWithdraw,
  // 필요 시 사업자 API도 추가:
  // createBusiness, updateBusiness, deleteBusiness
  fetchBusinesses,
  createBusiness,
  deleteBusiness,
} from '@/lib/api/mypage';

export const REGION_OPTIONS = [
  { value: 11, label: '서울특별시' },
  { value: 26, label: '부산광역시' },
  { value: 27, label: '대구광역시' },
  { value: 28, label: '인천광역시' },
  { value: 29, label: '광주광역시' },
  { value: 30, label: '대전광역시' },
  { value: 31, label: '울산광역시' },
  { value: 41, label: '경기도' },
  { value: 42, label: '강원도' },
  { value: 43, label: '충청북도' },
  { value: 44, label: '충청남도' },
  { value: 45, label: '전라북도' },
  { value: 46, label: '전라남도' },
  { value: 47, label: '경상북도' },
  { value: 48, label: '경상남도' },
  { value: 50, label: '제주특별자치도' },
];
const REGION_LABEL = new Map(REGION_OPTIONS.map(o => [o.value, o.label]));
export const regionLabel = id => {
  const n = Number(id);
  if (!Number.isFinite(n)) return '';
  return REGION_LABEL.get(n) || REGION_LABEL.get(Math.floor(n / 1000)) || '';
};

// 업종 코드 options + 라벨
export const INDUSTRY_OPTIONS = [
  { value: 1, label: '농업, 임업 및 어업' },
  { value: 2, label: '광업' },
  { value: 3, label: '제조업' },
  { value: 4, label: '전기, 가스, 증기 및 공기조절 공급업' },
  { value: 5, label: '수도, 하수, 폐기물 처리, 원료 재생업' },
  { value: 6, label: '건설업' },
  { value: 7, label: '도소매업' },
  { value: 8, label: '운수 및 창고업' },
  { value: 9, label: '숙박 및 음식점업' },
  { value: 10, label: '정보통신업' },
  { value: 11, label: '금융 및 보험업' },
  { value: 12, label: '부동산업' },
  { value: 13, label: '전문, 과학 및 기술 서비스업' },
  { value: 14, label: '사업시설관리, 사업지원 및 임대 서비스업' },
  { value: 15, label: '공공행정, 국방 및 사회보장행정' },
  { value: 16, label: '교육서비스업' },
  { value: 17, label: '보건업 및 사회복지 서비스업' },
  { value: 18, label: '예술, 스포츠 및 여가관련 서비스업' },
  { value: 19, label: '협회 및 단체, 수리 및 기타 개인 서비스업' },
];
const INDUSTRY_LABEL = new Map(INDUSTRY_OPTIONS.map(o => [o.value, o.label]));
export const industryLabel = id => INDUSTRY_LABEL.get(Number(id)) || '';

// 보기용
export const formatYmdDot = v => {
  const m = String(v ?? '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[1]}. ${m[2]}. ${m[3]}.` : String(v ?? '') || '—';
};
export const normBizNum = v => {
  const d = String(v ?? '')
    .replace(/\D/g, '')
    .slice(0, 10);
  return d.length === 10
    ? `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`
    : '';
};

// 서버 → 뷰(스토어) 정규화
export const normalizeServerBiz = b => ({
  businessInfoId: b.businessInfoId ?? b.id ?? null,
  registrationNumber: b.businessNum ?? b.registrationNumber ?? '',
  regionId: Number(b.regionId ?? b.regionCode ?? 0) || null,
  industryId: Number(b.industryId ?? 0) || null,
  estbDate: b.estbDate ?? b.startDate ?? '',
  // companyName: b.companyName ?? b.name ?? '',
  // salesScope: b.salesScope ?? '',
});

// 폼 → 서버 저장 DTO
export const toReqDto = b => {
  // registrationNumber가 최우선, 없을 때만 businessNum 보조
  const rawNum = b.registrationNumber || b.businessNum || '';
  return {
    businessNum: normBizNum(rawNum),
    estbDate: b.estbDate ?? '',
    industryId: Number(b.industryId) || 0,
    regionId: Number(b.regionId) || 0,
  };
};

/** 백 응답 → 화면용으로 정규화 ---------------------------------------------------------- */
function mapUserToView(u = {}) {
  const avatar =
    u.profileImageUrl ||
    u.profileImageKey || // presigned URL로 오는 경우도 있으니 우선 사용
    u.avatar ||
    '';

  return {
    userId: u.userId ?? null,
    email: u.email ?? '',
    name: u.name ?? '',
    nickname: u.nickname ?? '',
    phone: u.phone ?? '',
    avatar, // 프론트는 항상 avatar로 사용
  };
}

export const useMyPageStore = defineStore('mypage', {
  state: () => ({
    rawUser: null,
    // rawBusinesses: [],
    businesses: [],
  }),

  getters: {
    /** 화면에서 바로 쓰는 안전한 뷰 모델 */
    profileForView(state) {
      return state.rawUser ? mapUserToView(state.rawUser) : null;
    },
    /** 아바타 URL 전용(컴포넌트에서 간편 사용) */
    avatarUrl(state) {
      const u = state.rawUser || {};
      return u.profileImageUrl || u.profileImageKey || u.avatar || '';
    },
    // businesses(state) {
    //   return state.businesses || [];
    // },
    // ✅ 이름을 바꾸세요 (예: businessesList)
    businessesList(state) {
      return state.businesses || [];
    },

    // (선택) 보기용 라벨/날짜 포함 버전
    businessesForView(state) {
      return (state.businesses || []).map(b => ({
        ...b,
        // regionLabel / industryLabel 은 스토어에 export 해둔 함수라고 가정
        regionText: regionLabel(b.regionId) || '',
        industryText: industryLabel(b.industryId) || '',
        estbDateText: formatYmdDot(b.estbDate),
      }));
    },
  },

  actions: {
    /** 내 정보 + 사업자 묶음 로드 */
    async hydrate() {
      const { user, businesses } = await hydrateMypageBundle();
      this.rawUser = user || null;
      this.rawBusinesses = Array.isArray(businesses) ? businesses : [];
    },

    async loadBusinesses() {
      const raw = await fetchBusinesses(); // 항상 배열
      const list = raw.map(normalizeServerBiz);
      console.log('[Store] after normalize =', list);
      // this.businesses = raw.map(normalizeServerBiz);
      this.businesses = list;
    },
    async saveBusinesses(listOrOne) {
      const list = Array.isArray(listOrOne) ? listOrOne : [listOrOne];
      const req = list.map(toReqDto);
      if (!req.length) return;
      await createBusiness(req); // 저장
      await this.loadBusinesses(); // 다시 select → businessInfoId 반영
    },
    async removeBusiness(id) {
      if (!id) return;
      await deleteBusiness(id);
      await this.loadBusinesses();
    },

    async load() {
      return this.hydrate();
    },

    /**
     * 일괄 저장
     * @param {object} payload
     *  - basics: { nickname?, phone? }
     *  - avatarFile: File | Blob
     *  - businesses: [] (필요 시)
     *  - password: { current, next } (필요 시: 비번 변경은 폼 쪽에서 처리했으면 생략)
     */
    async saveAll({ basics, avatarFile, businesses /*, password*/ } = {}) {
      // 1) 닉네임/연락처
      if (basics && (basics.nickname || basics.phone)) {
        await updateUser({
          nickname: basics.nickname,
          phone: basics.phone, // 하이픈은 API 레이어에서 제거됨
        });
      }

      // 2) 프로필 이미지
      if (avatarFile) {
        await updateProfileImage(avatarFile);
      }

      // 3) 사업자 upsert 필요 시 여기서 호출
      // if (Array.isArray(businesses)) { ... }

      // 4) 저장 후 최신 데이터 재적재
      await this.hydrate();
    },

    /** 계정 탈퇴 */
    async doWithdraw() {
      await apiWithdraw();
      const auth = useAuthStore();
      await auth.doLogout();
      this.rawUser = null;
      this.businesses = [];
    },
  },
});
