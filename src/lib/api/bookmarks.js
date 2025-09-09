// src/lib/api/bookmarks.js
import api from './http';

// 공통 언래핑: {data:{...}} | {data:[...]} | {...}
const unwrap = res => res?.data?.data ?? res?.data ?? res;

// baseURL이 /api 로 끝나는지에 따라 경로 자동 보정
function apiPath(p) {
  const base = api?.defaults?.baseURL || '';
  return base.endsWith('/api') ? p : `/api${p}`;
}

/**
 * 북마크 목록 조회 (정책/대출 통합)
 * GET /api/me/bookmarks?type=all|policy|loan&page=&size=
 */
export async function listServerBookmarks({
  page = 0,
  size = 1000,
  type = 'all',
} = {}) {
  const res = await api.get(apiPath('/me/bookmarks'), {
    params: { page, size, type },
  });
  const body = unwrap(res);
  return body?.bookmarks ?? body ?? [];
}

/**
 * 북마크 추가
 * 1순위: POST /api/me/bookmarks/{type}/{id}
 * 2순위: POST /api/me/bookmarks  { type, id }
 */
export async function addServerBookmark({ type, id, title, org } = {}) {
  try {
    await api.post(apiPath(`/me/bookmarks/${type}/${id}`));
    return true;
  } catch (e) {
    // path 방식이 없으면 body 방식 시도
    if (e?.response?.status === 404 || e?.response?.status === 405) {
      await api.post(apiPath('/me/bookmarks'), { type, id, title, org });
      return true;
    }
    throw e;
  }
}

/**
 * 북마크 삭제
 * 1순위: DELETE /api/me/bookmarks/{type}/{id}
 * 2순위: DELETE /api/me/bookmarks  (body 지원 서버용)
 */
export async function removeServerBookmark({ type, id } = {}) {
  try {
    await api.delete(apiPath(`/me/bookmarks/${type}/${id}`));
    return true;
  } catch (e) {
    if (e?.response?.status === 404 || e?.response?.status === 405) {
      await api.delete(apiPath('/me/bookmarks'), { data: { type, id } });
      return true;
    }
    throw e;
  }
}
