<template>
  <div class="pointer-events-none fixed bottom-4 right-4 z-[9999] space-y-2">
    <div
      v-for="n in items"
      :key="n.id"
      class="pointer-events-auto flex min-w-[260px] max-w-[420px] items-center gap-2 rounded-lg px-4 py-3 text-white shadow-lg"
      :class="bgClass(n.type)"
      role="status"
      aria-live="polite"
    >
      <i :class="iconClass(n.type)" aria-hidden="true"></i>
      <span class="flex-1">{{ n.message }}</span>
      <button
        class="opacity-80 hover:opacity-100"
        aria-label="닫기"
        @click="notification.remove(n.id)"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/notification';

const notification = useNotificationStore();
const { items } = storeToRefs(notification);

function iconClass(type) {
  switch (type) {
    case 'success':
      return 'fas fa-check-circle';
    case 'error':
      return 'fas fa-exclamation-circle';
    case 'warning':
      return 'fas fa-exclamation-triangle';
    default:
      return 'fas fa-info-circle';
  }
}

function bgClass(type) {
  switch (type) {
    case 'success':
      return 'bg-green-600';
    case 'error':
      return 'bg-red-600';
    case 'warning':
      return 'bg-yellow-600';
    default:
      return 'bg-slate-700';
  }
}
</script>
