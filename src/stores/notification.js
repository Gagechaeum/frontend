// src/stores/notification.js
import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    items: [], // Toast 알림용 (기존)
    notifications: [], // 헤더 드롭다운 알림용 (새로 추가)
    isLoading: false,
    error: null,
    _seq: 0,
  }),

  getters: {},

  actions: {
    // 기존 Toast 알림 메서드들
    show(type, message, duration = 2500) {
      const id = ++this._seq;
      this.items.push({ id, type, message, duration });
      setTimeout(() => this.remove(id), duration);
    },

    remove(id) {
      this.items = this.items.filter(t => t.id !== id);
    },

    clear() {
      this.items = [];
    },

    // 알림 메서드들 (백엔드 API 없으므로 로컬 상태만 관리)
    async fetchNotifications() {
      // 백엔드에 알림 API가 없으므로 로컬 상태만 관리
      // console.log('알림 API가 백엔드에 구현되지 않았습니다.');
    },

    async markAsRead(id) {
      // 로컬 상태만 업데이트
      const notification = this.notifications.find(n => n.id === id);
      if (notification) {
        notification.read = true;
      }
    },

    async markAllAsRead() {
      // 로컬 상태만 업데이트
      this.notifications.forEach(n => (n.read = true));
    },

    // 로컬 알림 메서드들 (기존 호환성 유지)
    addNotification(notification) {
      const id = ++this._seq;
      this.notifications.unshift({
        id,
        read: false,
        createdAt: new Date(),
        ...notification,
      });
    },

    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id);
    },

    clearNotifications() {
      this.notifications = [];
    },

    // 샘플 데이터 추가 (테스트용)
    addSampleNotifications() {
      // 기존 알림이 있으면 추가하지 않음
      if (this.notifications.length > 0) return;

      this.addNotification({
        type: 'deadline',
        title: '청년창업지원금 마감 임박',
        message:
          '청년창업지원금 신청이 3일 후 마감됩니다. 서류를 빠르게 준비해주세요.',
      });

      this.addNotification({
        type: 'deadline',
        title: '세금 신고 마감일 알림',
        message: '부가가치세 신고가 1주일 후 마감됩니다.',
      });

      this.addNotification({
        type: 'update',
        title: '정책 업데이트',
        message: '중소기업 지원 정책이 업데이트되었습니다.',
      });
    },
  },
});
