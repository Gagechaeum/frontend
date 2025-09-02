// src/stores/notification.js
import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    items: [], // Toast 알림용 (기존)
    notifications: [], // 헤더 드롭다운 알림용 (새로 추가)
    _seq: 0,
  }),

  getters: {
    unreadCount: state => state.notifications.filter(n => !n.read).length,
  },

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

    // 새로운 헤더 알림 메서드들
    addNotification(notification) {
      const id = ++this._seq;
      this.notifications.unshift({
        id,
        read: false,
        createdAt: new Date(),
        ...notification,
      });
    },

    markAsRead(id) {
      const notification = this.notifications.find(n => n.id === id);
      if (notification) {
        notification.read = true;
      }
    },

    markAllAsRead() {
      this.notifications.forEach(n => (n.read = true));
    },

    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id);
    },

    clearNotifications() {
      this.notifications = [];
    },

    // 샘플 데이터 추가 (테스트용)
    addSampleNotifications() {
      this.addNotification({
        type: 'deadline',
        title: '청년창업지원금 마감 임박',
        message:
          '청년창업지원금 신청이 3일 후 마감됩니다. 서류를 빠르게 준비해주세요.',
      });

      this.addNotification({
        type: 'update',
        title: '새로운 대출 상품 등록',
        message: 'IT 스타트업을 위한 새로운 대출 상품이 등록되었습니다.',
      });

      this.addNotification({
        type: 'success',
        title: '서류 제출 완료',
        message: '중소기업 운영자금 대출 서류가 성공적으로 제출되었습니다.',
      });

      this.addNotification({
        type: 'warning',
        title: '서류 보완 필요',
        message:
          '제출하신 서류에 보완이 필요한 항목이 있습니다. 확인 후 재제출해주세요.',
      });
    },
  },
});
