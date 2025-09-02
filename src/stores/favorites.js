// 즐겨찾기 전역: 어디서나 ⭐ 토글 → 즐겨찾기 탭/홈에 반영 (localStorage 영속)
import { defineStore } from 'pinia';

export const useFavorites = defineStore('favorites', {
  state: () => ({ ids: [] }), // 배열로 저장(영속 안전)
  getters: {
    has: s => id => s.ids.includes(id),
  },
  actions: {
    load() {
      /* persistedstate로 자동 복구됨 */
    },
    add(id) {
      if (!this.ids.includes(id)) this.ids.push(id);
    },
    remove(id) {
      this.ids = this.ids.filter(x => x !== id);
    },
    toggle(id) {
      this.has(id) ? this.remove(id) : this.add(id);
    },
  },
  persist: { paths: ['ids'] },
});
