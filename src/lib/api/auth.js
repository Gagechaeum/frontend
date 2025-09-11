// src/lib/api/auth.js
import api from './http.js';

const cfg = { withCredentials: true };
const ACCESS_TOKEN_KEY = 'access_token';

const parseBearer = headers => {
  const h = headers?.authorization || headers?.Authorization;
  if (!h) return null;
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1] : null;
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const login = async (email, password) => {
  const res = await api.post(
    '/auth/login',
    { email, password },
    { ...cfg, validateStatus: s => s < 500 }
  );
  if (res.status >= 400) {
    throw new Error(res.data?.message || '로그인에 실패했어요.');
  }
  const at = parseBearer(res.headers);
  if (at) localStorage.setItem(ACCESS_TOKEN_KEY, at);
  return res.data;
};

export const logout = async () => {
  const at = getAccessToken();
  try {
    await api.post('/auth/logout', null, {
      ...cfg,
      headers: at ? { Authorization: `Bearer ${at}` } : undefined,
    });
  } finally {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const refresh = async () => {
  const res = await api.post('/auth/refresh', null, cfg);
  const at = parseBearer(res.headers);
  if (!at) throw new Error('토큰 재발급에 실패했습니다.');
  localStorage.setItem(ACCESS_TOKEN_KEY, at);
  return at;
};

export const signup = async payload =>
  (await api.post('/me/signup', payload, cfg)).data;

export const requestEmailCode = async email =>
  (await api.post('/me/email/verify/request', { email }, cfg)).data;

export const confirmEmailCode = async (email, code) =>
  (await api.post('/me/email/verify/confirm', { email, code }, cfg)).data;

export const checkEmailVerified = async email =>
  (await api.get('/me/email/verify/status', { params: { email }, ...cfg }))
    .data;

export const me = async () => {
  const at = getAccessToken();
  return (
    await api.get('/me/', {
      ...cfg,
      headers: at ? { Authorization: `Bearer ${at}` } : undefined,
    })
  ).data;
};

/**
 * 사용자 프로필 정보 조회
 * @returns {Promise<Object>} 사용자 프로필 정보
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get('/me/get/userInfo');
    return response.data;
  } catch (error) {
    console.error('사용자 프로필 조회 실패:', error);
    throw error;
  }
};

/**
 * 사용자 사업자 정보 조회
 * @returns {Promise<Object>} 사업자 정보 배열
 */
export const getBusinessInfo = async () => {
  try {
    const response = await api.get('/BusinessInfo/select');
    return response.data;
  } catch (error) {
    console.error('사업자 정보 조회 실패:', error);
    throw error;
  }
};
