// src/lib/api/mypage.js
import api from './http';
import { getAccessToken } from './auth';

/* 공통 */
const withAT = () => {
  const at = getAccessToken?.();
  return at ? { Authorization: `Bearer ${at}` } : {};
};
const onlyDigits = v => (v ? String(v).replace(/[^\d]/g, '') : '');
const ok = res => res?.data?.data ?? res?.data ?? null;

/* 응답 평탄화 */
export function parseUser(raw) {
  if (!raw) return null;
  const u = raw.user ?? raw;
  return {
    userId: u.userId ?? raw.userId ?? null,
    email: u.email ?? raw.email ?? '',
    name: u.name ?? raw.name ?? '',
    nickname: u.nickname ?? raw.nickname ?? '',
    phone: u.phone ?? raw.phone ?? '',
    profileImageUrl: u.profileImageUrl ?? u.profileImageKey ?? '',
    notification: u.notification ?? raw.notification ?? true,
    isVerified: u.isVerified ?? raw.isVerified ?? false,
    createdAt: u.createdAt ?? raw.createdAt ?? null,
    deletedAt: u.deletedAt ?? raw.deletedAt ?? null,
  };
}

/* ────────────── A) 사용자 ────────────── */
/** ✅ GET /api/me/get/userInfo */
export async function fetchUserInfo() {
  const res = await api.get('/me/get/userInfo', { headers: withAT() });
  return parseUser(ok(res));
}

/** ✅ PUT /api/me/update/user  (body: { nickname?, phoneNumber? }) */
export async function updateUser(patch = {}) {
  const body = {};
  // 닉네임
  const nn = (patch.nickname ?? patch.nickName ?? '').toString().trim();
  if (nn) body.nickname = nn;

  // 연락처: 서버가 보통 phoneNumber를 받으므로 둘 다 세팅(백 호환)
  const p = onlyDigits(patch.phone);
  if (p) {
    body.phone = p; // (선택) 백이 ph one만 받는 경우 대비
  }

  if (Object.keys(body).length === 0) return { skipped: true };

  const res = await api.put('/me/update/user', body, { headers: withAT() });
  const data = ok(res);
  return data ? parseUser(data) : data;
}

/** ✅ PUT /api/me/password-change (인증 헤더 추가) */
export async function changePassword(
  confirmPassword,
  newPassword,
  oldPassword
) {
  const res = await api.put(
    '/me/password-change',
    { confirmPassword, newPassword, oldPassword },
    { headers: withAT() }
  );
  return res?.data; // 백 응답 형태 어느 쪽이든 대응
}

/** ✅ PUT /api/me/withdrawal */
export async function withdraw() {
  const res = await api.put('/me/withdrawal', null, { headers: withAT() });
  return ok(res);
}

/** ✅ PUT /api/me/update/profile-image  (multipart/form-data) */
export async function updateProfileImage(fileOrBlob) {
  const fd = new FormData();
  fd.append('image', fileOrBlob);
  const res = await api.put('/me/update/profile-image', fd, {
    headers: { ...withAT() },
  });
  return ok(res);
}

/* ────────────── B) 사업자 ────────────── */
// 사업자 정보 가져오기 (리스트)
export async function fetchBusinesses() {
  const res = await api.get('/BusinessInfo/select', { headers: withAT() });
  const data = ok(res) ?? [];
  return Array.isArray(data) ? data : data ? [data] : [];
}

// 사업자 정보 리스트 저장 : 단건/다건
export async function createBusiness(listOrOne) {
  const payload = Array.isArray(listOrOne) ? listOrOne : [listOrOne];
  try {
    const res = await api.post('/BusinessInfo/save', payload, {
      headers: withAT(),
    });
    return ok(res);
  } catch (e) {
    if (e?.response?.status === 404 || e?.response?.status === 405) {
      const res2 = await api.post('/BusinessInfo/insert', payload, {
        headers: withAT(),
      });
      return ok(res2);
    }
    throw e;
  }
}

// export async function updateBusiness(payload) {
//   const res = await api.put('/BusinessInfo/update', payload, {
//     headers: withAT(),
//   });
//   return ok(res);
// }

export async function deleteBusiness(businessInfoId) {
  const res = await api.get('/BusinessInfo/delete', {
    headers: withAT(),
    params: { businessInfoId },
  });
  return ok(res);
}

export async function verifyBusinessNumber(bisNum, startDate) {
  const res = await api.get('/BusinessInfo/verifyBisNum', {
    headers: withAT(),
    params: { bisNum, startDate },
  });
  return ok(res);
}

/* 번들 */
export async function hydrateMypageBundle() {
  const [user, businesses] = await Promise.all([
    fetchUserInfo(),
    fetchBusinesses(),
  ]);
  return { user, businesses };
}

/** 닉네임 중복 확인 (인증 필요하면 헤더 추가) */
export async function isNicknameExist(nickname) {
  const res = await api.get('/me/isNicknameExist', {
    headers: withAT(), // <- 필요 시
    params: { nickname },
  });
  return ok(res) ?? res?.data;
}
