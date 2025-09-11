// src/stores/mypageView.js
import { defineStore } from 'pinia';

const INITIAL = 'profile.display'; // 기본: 정보 보기 화면

export const useMyPageViewStore = defineStore('mypageView', {
  state: () => ({
    stack: [INITIAL], // 내부 전용 히스토리(주소 변경 X)
  }),
  getters: {
    current: s => s.stack[s.stack.length - 1],
    is: s => name => s.stack[s.stack.length - 1] === name,
  },
  actions: {
    go(name) {
      if (!name || name === this.current) return;
      this.stack.push(name);
    },
    replace(name) {
      if (!name) return;
      this.stack.splice(this.stack.length - 1, 1, name);
    },
    back(fallback = INITIAL) {
      if (this.stack.length > 1) this.stack.pop();
      else this.stack = [fallback];
    },
    reset(to = INITIAL) {
      this.stack = [to];
    },
  },
});
