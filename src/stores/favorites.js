// src/stores/favorites.js
// 앱 전역 즐겨찾기 스토어: 로컬 우선 + 서버 동기화(가능 시)
import { reactive, computed } from 'vue';
import {
  listServerBookmarks,
  addServerBookmark,
  removeServerBookmark,
} from '@/lib/api/bookmarks';

const LS_KEY = 'app:favorites:v1';

const state = reactive({
  set: new Set(), // 'policy_123', 'loan_456'
  ready: false, // load() 완료 여부
  serverSynced: false, // 서버에서 한 번이라도 가져왔는지
});

// SSR/테스트/프라이빗 모드 대비 안전 스토리지 접근
function getStorage() {
  try {
     
    return globalThis && globalThis.localStorage
      ? globalThis.localStorage
      : null;
  } catch (e) {
    return null;
  }
}

function saveLocal() {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(LS_KEY, JSON.stringify([...state.set]));
  } catch (e) {
    // 저장 용량 초과/접근 불가 등은 무시
  }
}

function loadLocal() {
  const storage = getStorage();
  if (!storage) return;
  try {
    const raw = storage.getItem(LS_KEY);
    const arr = JSON.parse(raw || '[]');
    if (Array.isArray(arr)) state.set = new Set(arr);
  } catch (e) {
    // 파싱 오류 등은 무시
  }
}

// 'policy_123' -> { type:'policy', id:'123' }
function parseFavId(favId) {
  const [type, ...rest] = String(favId).split('_');
  return { type, id: rest.join('_') };
}

// 서버 북마크 응답 -> 통합 ID
function normalizeBookmarkToFavId(b) {
  if (b?.policyId) return `policy_${b.policyId}`;
  if (b?.loanId) return `loan_${b.loanId}`;
  if (b?.type && b?.id) return `${b.type}_${b.id}`;
  return null;
}

export function useFavorites() {
  async function load() {
    if (state.ready) return;

    // 1) 로컬 먼저
    loadLocal();

    // 2) 서버 있으면 병합
    try {
      const server = await listServerBookmarks({
        page: 0,
        size: 1000,
        type: 'all',
      });
      const ids = server.map(normalizeBookmarkToFavId).filter(Boolean);
      state.set = new Set([...state.set, ...ids]);
      state.serverSynced = true;
      saveLocal();
    } catch (e) {
      // 서버 미구현/미로그인/에러 → 폴백
      state.serverSynced = false;
    }

    state.ready = true;
  }

  function has(favId) {
    return state.set.has(favId);
  }

  async function add(favId, meta = {}) {
    if (state.set.has(favId)) return;
    state.set.add(favId);
    saveLocal();

    // 서버 동기화(옵티미스틱) — 실패해도 로컬 유지
    try {
      const { type, id } = parseFavId(favId);
      await addServerBookmark({ type, id, title: meta.title, org: meta.org });
    } catch (e) {
      // noop
    }
  }

  async function remove(favId) {
    if (!state.set.has(favId)) return;
    state.set.delete(favId);
    saveLocal();

    // 서버 동기화(옵티미스틱)
    try {
      const { type, id } = parseFavId(favId);
      await removeServerBookmark({ type, id });
    } catch (e) {
      // noop
    }
  }

  async function toggle(favId, meta) {
    if (has(favId)) return remove(favId);
    return add(favId, meta);
  }

  const ids = computed(() => [...state.set]);

  return {
    // state
    ids,
    ready: computed(() => state.ready),
    serverSynced: computed(() => state.serverSynced),
    // actions
    load,
    has,
    add,
    remove,
    toggle,
  };
}
