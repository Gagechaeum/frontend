// src/lib/api/schedule.js
import api from './http.js';

// 공통 언래핑: {data:{...}} | {data:[...]} | {...}
const unwrap = res => res?.data?.data ?? res?.data ?? res;

// baseURL이 /api 로 끝나는지에 따라 경로 자동 보정
function apiPath(p) {
  const base = api?.defaults?.baseURL || '';
  if (base.endsWith('/api')) return p; // 예: http://localhost:8080/api + /loans
  return `/api${p}`; // 예: http://localhost:8080 + /api/loans
}

/**
 * 정책 목록 (없으면 404 → [] 반환)
 * 응답: {policies: []} | {content: []} | []
 */
export async function listPolicies({ page = 0, size = 500 } = {}) {
  try {
    const res = await api.get(apiPath('/policies'), { params: { page, size } });
    const body = unwrap(res);
    const arr = body?.policies ?? body?.content ?? body;
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    // 리스트 엔드포인트가 없으면 404 → 조용히 빈 배열
    if (e?.response?.status === 404) return [];
    return [];
  }
}

/**
 * 대출 목록
 * - 우선 page=0으로 시도 (Spring 기본)
 * - 4xx/5xx 등 오류시는 page=1로 재시도 (커스텀 1-base 호환)
 * 응답: {loans: []} | {content: []} | []
 */
export async function listLoans({ page = 0, size = 500, industryId } = {}) {
  // 내부 함수: 호출 + 응답 배열만 추출
  const call = async pg => {
    const res = await api.get(apiPath('/loans'), {
      params: { page: pg, size, industryId },
    });
    const body = unwrap(res);
    const arr = body?.loans ?? body?.content ?? body;
    return Array.isArray(arr) ? arr : [];
  };

  try {
    // 1차: page=0
    const arr = await call(page);
    return arr;
  } catch (e) {
    // 2차: page=1로 재시도 (1-base 서버 호환)
    try {
      const arr = await call(1);
      return arr;
    } catch (ee) {
      // 최종 실패 시 빈 배열
      return [];
    }
  }
}
