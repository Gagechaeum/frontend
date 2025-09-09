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
    name: u.name ?? raw.name ?? '', // 실명(오면 사용)
    nickname: u.nickname ?? raw.nickname ?? '', // 닉네임
    phone: u.phone ?? u.phoneNumber ?? raw.phone ?? '',
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

/** ✅ PUT /api/me/update/user  (body: { nickname?, phone? }) */
export async function updateUser(patch = {}) {
  const body = {};
  if (patch.nickname ?? patch.nickName) {
    const nn = String(patch.nickname ?? patch.nickName).trim();
    if (nn) body.nickname = nn;
  }
  if (patch.phone) {
    const p = onlyDigits(patch.phone);
    if (p) body.phone = p;
  }
  if (Object.keys(body).length === 0) return { skipped: true };

  const res = await api.put('/me/update/user', body, { headers: withAT() });
  const data = ok(res);
  return data ? parseUser(data) : data;
}

/** ✅ PUT /api/me/password-change */
export async function changePassword(payload) {
  const res = await api.put('/me/password-change', payload, {
    headers: withAT(),
  });
  return ok(res);
}

/** ✅ PUT /api/me/withdrawal */
export async function withdraw() {
  const res = await api.put('/me/withdrawal', null, { headers: withAT() });
  return ok(res);
}

/* ────────────── B) 사업자 ────────────── */
/** ✅ GET /api/BusinessInfo/select  → List */
export async function fetchBusinesses() {
  const res = await api.get('/BusinessInfo/select', { headers: withAT() });
  const data = ok(res) ?? [];
  return Array.isArray(data) ? data : data ? [data] : [];
}

/** ✅ POST /api/BusinessInfo/save  (없으면 /insert 폴백) */
export async function createBusiness(payload) {
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

/** ✅ PUT /api/BusinessInfo/update */
export async function updateBusiness(payload) {
  const res = await api.put('/BusinessInfo/update', payload, {
    headers: withAT(),
  });
  return ok(res);
}

/** ✅ GET /api/BusinessInfo/delete?businessInfoId=...  (DELETE 아님) */
export async function deleteBusiness(businessInfoId) {
  const res = await api.get('/BusinessInfo/delete', {
    headers: withAT(),
    params: { businessInfoId },
  });
  return ok(res);
}

/** ✅ GET /api/BusinessInfo/verifyBisNum?bisNum=...&startDate=YYYY-MM-DD */
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
