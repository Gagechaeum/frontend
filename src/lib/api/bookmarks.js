import api from './http.js';
import { getAccessToken } from './auth';

function authHeaders() {
  const at = getAccessToken();
  return at ? { Authorization: `Bearer ${at}` } : {};
}

// 즐겨찾기 목록 조회
export async function listServerBookmarks(params) {
  try {
    const { data } = await api.get('/me/bookmarks', {
      headers: authHeaders(),
      params,
    });
    // 스토어는 policyId 또는 loanId를 포함하는 객체의 배열을 기대합니다.
    return data.data?.content || [];
  } catch (e) {
    console.warn('[API:bookmarks] 목록 조회 실패', e);
    return []; // 에러 발생 시 빈 배열 반환
  }
}

// 즐겨찾기 등록
export async function addServerBookmark({ type, id }) {
  const url = `/me/${type}s/${id}/bookmark`; // 예: /me/policies/123/bookmark
  const { data } = await api.post(url, {}, { headers: authHeaders() });
  return data;
}

// 즐겨찾기 삭제
export async function removeServerBookmark({ type, id }) {
  const url = `/me/${type}s/${id}/bookmark`; // 예: /me/policies/123/bookmark
  const { data } = await api.delete(url, { headers: authHeaders() });
  return data;
}

// 즐겨찾기 진행상황 조회
export async function getBookmarksProgress() {
  try {
    const { data } = await api.get('/me/bookmarks/progress', {
      headers: authHeaders(),
    });
    return data.data || []; // 엔드포인트는 리스트를 반환합니다.
  } catch (e) {
    console.warn('[API:bookmarks] 진행률 조회 실패', e);
    return [];
  }
}

export async function updateLoanStatus({ id, status }) {
  const url = `/me/loans/${id}/status`;
  const { data } = await api.patch(url, { status }, { headers: authHeaders() });
  return data;
}

export async function updatePolicyStatus({ id, status }) {
  const url = `/me/policies/${id}/status`;
  const { data } = await api.patch(url, { status }, { headers: authHeaders() });
  return data;
}

export async function getBookmarkDocuments() {
  try {
    const { data } = await api.get('/me/bookmarks/documents', {
      headers: authHeaders(),
    });
    return data.data || { totalBookmarkCount: 0, documents: [] };
  } catch (e) {
    console.warn('[API:bookmarks] 필요서류 조회 실패', e);
    return { totalBookmarkCount: 0, documents: [] };
  }
}

export async function getBookmarkedProducts() {
  try {
    const { data } = await api.get('/me/bookmarks/products', {
      headers: authHeaders(),
    });
    return data.data || [];
  } catch (e) {
    console.warn('[API:bookmarks] 즐겨찾기 상품 조회 실패', e);
    return [];
  }
}