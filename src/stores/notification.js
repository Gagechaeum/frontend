// src/stores/notification.js
import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    items: [], // Toast 알림용 (기존)
    notifications: [], // 헤더 드롭다운 알림용 (새로 추가)
    unreadCount: 0, // 읽지 않은 알림 개수
    isLoading: false,
    error: null,
    _seq: 0,
  }),

  getters: {
    // 로컬 알림에서 읽지 않은 개수 계산 (API와 병행 사용)
    localUnreadCount: state => state.notifications.filter(n => !n.read).length,
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
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
    },

    async markAllAsRead() {
      // 로컬 상태만 업데이트
      this.notifications.forEach(n => (n.read = true));
      this.unreadCount = 0;
    },

    async fetchUnreadCount() {
      // 로컬 상태에서 계산
      this.unreadCount = this.notifications.filter(n => !n.read).length;
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
      this.unreadCount++;
    },

    removeNotification(id) {
      const notification = this.notifications.find(n => n.id === id);
      if (notification && !notification.read) {
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
      this.notifications = this.notifications.filter(n => n.id !== id);
    },

    clearNotifications() {
      this.notifications = [];
      this.unreadCount = 0;
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
