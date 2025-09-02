// 내 필터(저장/적용/이름변경/삭제) + 활성 필터 전역 공유 (localStorage 영속)
import { defineStore } from 'pinia';

export const useScheduleFilters = defineStore('scheduleFilters', {
  state: () => ({
    saved: [], // [{ id, name, criteria:{...}, tags:[] }]
    activeFilterId: null,
    activeCriteria: {}, // 모든 화면이 참조
  }),
  getters: {
    active(state) {
      return state.saved.find(f => f.id === state.activeFilterId) || null;
    },
  },
  actions: {
    // 목업 단계: 최초 더미 하나 넣어도 됨 (원하면 주석 해제)
    load() {
      if (this.saved.length === 0) {
        const demo = {
          id: 'flt_default',
          name: '기본',
          criteria: {},
          tags: [],
        };
        this.saved = [demo];
        this.activeFilterId = demo.id;
        this.activeCriteria = {};
      }
    },
    create(name, criteria) {
      const id = `flt_${Date.now()}`;
      const item = { id, name, criteria, tags: criteriaToTags(criteria) };
      this.saved.unshift(item);
      this.setActive(id);
      return id;
    },
    update(id, patch) {
      const i = this.saved.findIndex(f => f.id === id);
      if (i >= 0) {
        const next = { ...this.saved[i], ...patch };
        if (patch.criteria) next.tags = criteriaToTags(patch.criteria);
        this.saved[i] = next;
      }
      if (this.activeFilterId === id && patch.criteria)
        this.activeCriteria = patch.criteria;
    },
    remove(id) {
      this.saved = this.saved.filter(f => f.id !== id);
      if (this.activeFilterId === id) {
        this.activeFilterId = this.saved[0]?.id ?? null;
        this.activeCriteria = this.saved[0]?.criteria ?? {};
      }
    },
    setActive(id) {
      this.activeFilterId = id;
      const crt = this.saved.find(f => f.id === id)?.criteria || {};
      this.activeCriteria = crt;
    },
    // 임시 적용(저장 없이 현재 화면만 쓰고 싶을 때)
    setActiveCriteria(criteria) {
      this.activeCriteria = criteria || {};
    },
  },
  persist: { paths: ['saved', 'activeFilterId', 'activeCriteria'] },
});

function criteriaToTags(c = {}) {
  return [
    ...(c.region || []),
    ...(c.industry || []),
    ...(c.target || []),
    ...(c.org || []),
    ...(c.type || []),
    ...(c.state || []),
  ].slice(0, 6);
}
