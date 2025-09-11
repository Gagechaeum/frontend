// src/lib/api/onboarding.js
import api from './http.js';

/**
 * 사업자번호 인증
 * @param {string} bisNum - 사업자등록번호(숫자만, 10자리)
 * @param {string} startDate - 개업일 (YYYY-MM-DD)
 */
export const verifyBusinessNumber = async (bisNum, startDate) => {
  const res = await api.get('/BusinessInfo/verifyBisNum', {
    params: { bisNum, startDate },
    validateStatus: s => s < 500,
  });
  if (res.status >= 400) throw new Error(res.data?.message || '사업자 인증 실패');
  return res.data; // CustomResponse 그대로
};

/**
 * 사업자 정보 저장
 * @param {Object|Array} listOrOne - 객체 또는 배열
 */
export const createBusiness = async (listOrOne) => {
  const body = Array.isArray(listOrOne) ? listOrOne : [listOrOne];
  const res = await api.post('/BusinessInfo/save', body, { validateStatus: s => s < 500 });
  if (res.status >= 400) throw new Error(res.data?.message || '사업자 저장 실패');
  return res.data;
};
