<template>
  <header
    :class="
      overlay
        ? 'absolute inset-x-0 top-0 z-40 border-b-0 bg-transparent'
        : 'sticky top-0 z-40 border-b border-gray-200 bg-white'
    "
  >
    <div class="mx-auto max-w-7xl px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- 로고 -->
        <div class="flex items-center">
          <RouterLink to="/">
            <slot name="logo">
              <i
                class="fas fa-landmark mr-2 text-2xl text-primary"
                aria-hidden="true"
              ></i>
              <span class="text-xl font-bold text-gray-900">가게채움</span>
            </slot>
          </RouterLink>
        </div>

        <!-- 네비게이션 -->
        <nav class="hidden items-center space-x-8 md:flex" aria-label="Primary">
          <slot name="nav">
            <a
              href="/onboarding"
              class="cursor-pointer font-medium text-gray-700 hover:text-primary"
              >전체 상품</a
            >
            <a
              href="/schedule"
              class="cursor-pointer font-medium text-gray-700 hover:text-primary"
              >일정</a
            >
            <a
              href="/docs"
              class="cursor-pointer font-medium text-gray-700 hover:text-primary"
              >내 서류함</a
            >
            <a
              href="/report"
              class="cursor-pointer font-medium text-gray-700 hover:text-primary"
            >
              리포트
            </a>
            <a
              href="/community"
              class="cursor-pointer font-medium text-gray-700 hover:text-primary"
              >커뮤니티</a
            >
            <a
              href="/test"
              class="cursor-pointer font-medium text-gray-700 hover:text-primary"
              >컴포넌트 테스트</a
            >
          </slot>
        </nav>

        <!-- 칩/알림/프로필 -->
        <div class="flex items-center space-x-4">
          <div
            v-if="chips && chips.length"
            class="hidden items-center space-x-2 sm:flex"
          >
            <span
              v-for="chip in chips"
              :key="chip"
              class="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >{{ chip }}</span
            >
          </div>

          <!-- 알림 아이콘 -->
          <div class="relative inline-block">
            <button
              v-if="showBell"
              class="relative rounded-full p-2 hover:bg-gray-100"
              aria-label="알림"
              @click="toggleNotifications"
            >
              <i
                class="fas fa-bell text-lg text-gray-600"
                aria-hidden="true"
              ></i>
              <!-- 읽지 않은 알림 개수 표시 -->
              <span
                v-if="unreadCount > 0"
                class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>

            <!-- 알림 드롭다운 -->
            <NotificationDropdown
              :is-open="isNotificationsOpen"
              @close="closeNotifications"
            />
          </div>

          <RouterLink
            to="/mypage"
            class="flex h-8 w-8 items-center justify-center rounded-full bg-primary"
            aria-label="프로필"
          >
            <slot name="avatar">
              <i class="fas fa-user text-sm text-white" aria-hidden="true"></i>
            </slot>
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/notification';
import NotificationDropdown from './NotificationDropdown.vue';

const props = defineProps({
  chips: { type: Array, default: () => [] },
  showBell: { type: Boolean, default: true },
  overlay: { type: Boolean, default: false },
});

const notificationStore = useNotificationStore();
const { unreadCount } = storeToRefs(notificationStore);

const isNotificationsOpen = ref(false);

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value;
};

const closeNotifications = () => {
  isNotificationsOpen.value = false;
};
</script>
