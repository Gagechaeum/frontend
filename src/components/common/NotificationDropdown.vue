<template>
  <div
    v-if="isOpen"
    class="notification-dropdown absolute right-0 top-full z-[9999] mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg"
  >
    <div class="border-b border-gray-200 p-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">알림</h3>
        <span v-if="unreadCount > 0" class="text-sm font-medium text-blue-600"
          >{{ unreadCount }}개의 읽지 않은 알림</span
        >
      </div>
    </div>

    <div class="max-h-96 overflow-y-auto">
      <div
        v-if="notifications.length === 0"
        class="p-4 text-center text-gray-500"
      >
        새로운 알림이 없습니다
      </div>

      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="cursor-pointer border-b border-gray-100 p-4 transition-colors hover:bg-gray-50"
        :class="{ 'bg-blue-50': !notification.read }"
        @click="markAsRead(notification.id)"
      >
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0">
            <i
              :class="[
                getNotificationIcon(notification.type),
                getNotificationColor(notification.type),
                'text-lg',
              ]"
            ></i>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-gray-900">
              {{ notification.title }}
            </p>
            <p class="mt-1 line-clamp-2 text-sm text-gray-600">
              {{ notification.message }}
            </p>
            <p class="mt-2 text-xs text-gray-400">
              {{ formatTime(notification.createdAt) }}
            </p>
          </div>
          <div v-if="!notification.read" class="flex-shrink-0">
            <div class="h-2 w-2 rounded-full bg-blue-500"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 p-3">
      <button
        class="w-full text-sm font-medium text-blue-600 hover:text-blue-800"
        @click="markAllAsRead"
      >
        모든 알림 읽음 처리
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/notification';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
});

const emit = defineEmits(['close']);

const notificationStore = useNotificationStore();
const { notifications } = storeToRefs(notificationStore);

const unreadCount = computed(
  () => notifications.value.filter(n => !n.read).length
);

function getNotificationIcon(type) {
  switch (type) {
    case 'success':
      return 'fas fa-check-circle';
    case 'error':
      return 'fas fa-exclamation-circle';
    case 'warning':
      return 'fas fa-exclamation-triangle';
    case 'info':
      return 'fas fa-info-circle';
    case 'deadline':
      return 'fas fa-clock';
    case 'update':
      return 'fas fa-bell';
    default:
      return 'fas fa-bell';
  }
}

function getNotificationColor(type) {
  switch (type) {
    case 'success':
      return 'text-green-600';
    case 'error':
      return 'text-red-600';
    case 'warning':
      return 'text-yellow-600';
    case 'info':
      return 'text-blue-600';
    case 'deadline':
      return 'text-orange-600';
    case 'update':
      return 'text-purple-600';
    default:
      return 'text-gray-600';
  }
}

function formatTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;

  return new Date(date).toLocaleDateString('ko-KR');
}

function markAsRead(id) {
  notificationStore.markAsRead(id);
}

function markAllAsRead() {
  notificationStore.markAllAsRead();
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
