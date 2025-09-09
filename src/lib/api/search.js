// src/lib/api/search.js
import api from './http';

// 공통 언래핑
const unwrap = res => res?.data?.data ?? res?.data ?? res;

// baseURL(/api) 유무 자동 보정
function apiPath(p) {
  const base = api?.defaults?.baseURL || '';
  return base.endsWith('/api') ? p : `/api${p}`;
}

/**
 * 전역 검색 (정책+대출)
 * GET /api/search?keyword=&page=&size=
 */
export async function searchGlobal({ keyword, page = 0, size = 1000 } = {}) {
  if (!keyword || !keyword.trim()) {
    return { pageInfo: null, results: [] };
  }
  const res = await api.get(apiPath('/search'), {
    params: { keyword: keyword.trim(), page, size },
  });
  const body = unwrap(res);
  return {
    pageInfo: body?.pageInfo ?? null,
    results: body?.results ?? [],
  };
}
