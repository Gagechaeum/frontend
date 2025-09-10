// src/stores/mypage.js
import { defineStore } from 'pinia';
import {
  hydrateMypageBundle,
  updateUser,
  updateProfileImage,
  withdraw as apiWithdraw,
  // 필요 시 사업자 API도 추가:
  // createBusiness, updateBusiness, deleteBusiness
} from '@/lib/api/mypage';

/** 백 응답 → 화면용으로 정규화 */
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
    phone: u.phone ?? u.phoneNumber ?? '',
    avatar, // 프론트는 항상 avatar로 사용
  };
}

export const useMyPageStore = defineStore('mypage', {
  state: () => ({
    rawUser: null,
    rawBusinesses: [],
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
    businesses(state) {
      return state.rawBusinesses || [];
    },
  },

  actions: {
    /** 내 정보 + 사업자 묶음 로드 */
    async hydrate() {
      const { user, businesses } = await hydrateMypageBundle();
      this.rawUser = user || null;
      this.rawBusinesses = Array.isArray(businesses) ? businesses : [];
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
          phoneNumber: basics.phone, // 하이픈은 API 레이어에서 제거됨
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
      // 필요 시 로그아웃/스토어 초기화
      this.rawUser = null;
      this.rawBusinesses = [];
    },
  },
});
// export const useMypageStore = _store;

// // src/stores/mypage.js
// import { defineStore } from 'pinia';
// import {
//   hydrateMypageBundle,
//   fetchUserInfo,
//   parseUser,
//   updateUser,
//   changePassword as apiChangePassword,
//   withdraw as apiWithdraw,
//   fetchBusinesses,
//   createBusiness,
//   updateBusiness,
//   deleteBusiness,
//   verifyBusinessNumber,
// } from '@/lib/api/mypage';

// const onlyDigits = v => (v ? String(v).replace(/[^\d]/g, '') : '');

// export const useMypageStore = defineStore('mypage', {
//   state: () => ({
//     profile: null, // parseUser 결과(닉네임/전화/이메일 등 평탄화)
//     businesses: [],
//     loading: false,
//     error: null,
//   }),

//   getters: {
//     /** 템플릿에서 기대하는 뷰모델 형태로 변환 */
//     profileForView: s =>
//       s.profile && {
//         avatar: s.profile.profileImageUrl ?? '',
//         name: s.profile.name ?? '', // 실명(백에서 안 오면 공란)
//         nickName: s.profile.nickname ?? '', // 닉네임
//         phone: s.profile.phone ?? '',
//         email: s.profile.email ?? '',
//         businesses: (s.businesses || []).map(b => ({
//           id: b.businessInfoId ?? b.id,
//           businessInfoId: b.businessInfoId ?? b.id,
//           registrationNumber: b.businessNum ?? b.registrationNumber,
//           regionId: b.regionId ?? b.region,
//           industryId: b.industryId ?? b.type,
//           salesScope: b.salesScope ?? '',
//           companyName: b.companyName ?? b.name ?? '',
//           estbDate: b.estbDate ?? b.startDate ?? null,
//         })),
//       },
//   },

//   actions: {
//     async hydrate() {
//       this.loading = true;
//       this.error = null;
//       try {
//         const { user, businesses } = await hydrateMypageBundle();
//         // 부분 응답 보호: 머지
//         this.profile = { ...(this.profile ?? {}), ...(parseUser(user) ?? {}) };
//         this.businesses = Array.isArray(businesses) ? businesses : [];
//       } catch (e) {
//         console.error('[mypage.hydrate] 실패:', e);
//         this.error = e;
//       } finally {
//         this.loading = false;
//       }
//     },

//     /** 닉네임/전화 저장 (바뀐 경우에만 서버 전송) */
//     async saveProfileBasics(partial) {
//       const curr = this.profile ?? {};
//       const payload = {};

//       const nextNN = (partial?.nickName ?? partial?.nickname ?? '').trim();
//       if (nextNN && nextNN !== (curr.nickname ?? '')) payload.nickname = nextNN;

//       const currPhone = onlyDigits(curr.phone);
//       const nextPhone = onlyDigits(partial?.phone);
//       if (nextPhone && nextPhone !== currPhone) payload.phone = nextPhone;

//       if (Object.keys(payload).length === 0) return; // 변경 없음

//       const updated = await updateUser(payload); // PUT /me/user
//       if (updated) {
//         this.profile = {
//           ...(this.profile ?? {}),
//           ...(parseUser(updated) ?? {}),
//         };
//       } else {
//         const u = await fetchUserInfo();
//         this.profile = { ...(this.profile ?? {}), ...(u ?? {}) };
//       }
//     },

//     async changePassword(payload) {
//       await apiChangePassword(payload);
//     },
//     async doWithdraw() {
//       await apiWithdraw();
//     },

//     /** 사업자 번호 검증 (필요 시 호출) */
//     async verifyBisNum(bisNum, startDate) {
//       return await verifyBusinessNumber(bisNum, startDate);
//     },

//     /** 사업자 목록 저장: before vs after diff → save/update/delete 호출 */
//     async saveBusinesses(newList = []) {
//       const before = this.businesses || [];
//       const toKey = x => String(x?.businessInfoId ?? x?.id ?? '');
//       const byId = arr =>
//         Object.fromEntries(arr.filter(x => toKey(x)).map(x => [toKey(x), x]));
//       const mapBefore = byId(before);
//       const mapAfter = byId(newList);

//       const toCreate = newList.filter(x => !toKey(x));
//       const toUpdateList = newList.filter(x => {
//         const id = toKey(x);
//         if (!id) return false;
//         const prev = mapBefore[id];
//         if (!prev) return false;
//         return (
//           (x.businessNum ?? x.registrationNumber) !==
//             (prev.businessNum ?? prev.registrationNumber) ||
//           (x.regionId ?? x.region) !== (prev.regionId ?? prev.region) ||
//           (x.industryId ?? x.type) !== (prev.industryId ?? prev.type) ||
//           (x.salesScope ?? '') !== (prev.salesScope ?? '') ||
//           (x.companyName ?? x.name ?? '') !==
//             (prev.companyName ?? prev.name ?? '') ||
//           (x.estbDate ?? x.startDate ?? null) !==
//             (prev.estbDate ?? prev.startDate ?? null)
//         );
//       });
//       const toDelete = before.filter(x => !mapAfter[toKey(x)]);

//       // 등록: POST /BusinessInfo/savebisinfo
//       for (const c of toCreate) {
//         await createBusiness({
//           regionId: c.regionId ?? c.region,
//           industryId: c.industryId ?? c.type,
//           businessNum: c.businessNum ?? c.registrationNumber,
//           salesScope: c.salesScope ?? '',
//           companyName: c.companyName ?? c.name ?? '',
//           estbDate: c.estbDate ?? c.startDate ?? null,
//         });
//       }

//       // 수정: PUT /BusinessInfo/updatebisinfo
//       for (const u of toUpdateList) {
//         await updateBusiness({
//           businessInfoId: u.businessInfoId ?? u.id,
//           regionId: u.regionId ?? u.region,
//           industryId: u.industryId ?? u.type,
//           businessNum: u.businessNum ?? u.registrationNumber,
//           salesScope: u.salesScope ?? '',
//           companyName: u.companyName ?? u.name ?? '',
//           estbDate: u.estbDate ?? u.startDate ?? null,
//         });
//       }

//       // 삭제: DELETE/GET /BusinessInfo/deletebisinfo
//       for (const d of toDelete) {
//         await deleteBusiness(d.businessInfoId ?? d.id);
//       }

//       // 최종 재조회
//       const bs = await fetchBusinesses();
//       this.businesses = Array.isArray(bs) ? bs : [];
//     },

//     /** 통합 저장 – 뷰에서 한 번에 호출 */
//     async saveAll({ basics, businesses }) {
//       await this.saveProfileBasics(basics ?? {});
//       if (Array.isArray(businesses)) await this.saveBusinesses(businesses);
//     },
//   },
// });
