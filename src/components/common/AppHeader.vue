<!-- src/components/common/AppHeader.vue -->
<template>
  <header class="sticky top-0 z-50 border-b border-gray-200 bg-white">
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
              href="/schedule"
              :class="[
                'cursor-pointer font-medium transition-colors',
                $route.path.startsWith('/schedule')
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-700 hover:text-primary',
              ]"
              >일정</a
            >
            <a
              href="/docs"
              :class="[
                'cursor-pointer font-medium transition-colors',
                $route.path.startsWith('/docs')
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-700 hover:text-primary',
              ]"
              >내 서류함</a
            >
            <a
              href="/report"
              :class="[
                'cursor-pointer font-medium transition-colors',
                $route.path.startsWith('/report')
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-700 hover:text-primary',
              ]"
              >리포트</a
            >
            <a
              href="/community"
              :class="[
                'cursor-pointer font-medium transition-colors',
                $route.path.startsWith('/community')
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-700 hover:text-primary',
              ]"
              >커뮤니티</a
            >
          </slot>
        </nav>

        <!-- 칩/알림/프로필 -->
        <div class="flex items-center space-x-4">
          <!-- 칩 -->
          <div
            v-if="chips && chips.length"
            class="hidden items-center space-x-2 sm:flex"
          >
            <span
              v-for="chip in chips"
              :key="chip"
              class="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              {{ chip }}
            </span>
          </div>

          <!-- 알림 아이콘 -->
          <div ref="notificationRoot" class="relative inline-block">
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
            <div
              v-if="isNotificationsOpen"
              class="absolute right-0 top-full z-[9999] mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg"
            >
              <div class="border-b border-gray-200 p-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-900">알림</h3>
                  <span
                    v-if="unreadCount > 0"
                    class="text-sm font-medium text-blue-600"
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
          </div>

          <!-- 프로필: 아바타 클릭 시 드롭다운 -->
          <!-- RouterLink 대신 ProfileDropdown 사용 -->
          <ProfileDropdown
            :user-info="userInfo"
            :avatar="avatar"
            @mypage="goMyPage"
            @logout-click="handleLogout"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/notification';
import ProfileDropdown from '../mypage/ProfileDropdown.vue';

const props = defineProps({
  chips: { type: Array, default: () => [] }, // 우측 칩(태그) 리스트
  showBell: { type: Boolean, default: true }, // 알림 버튼 보이기
  userInfo: {
    // 드롭다운 상단 표시 정보
    type: Object,
    default: () => ({
      name: '사용자',
      region: '서울',
      business: '카페/디저트',
    }),
  },
  avatar: { type: String, default: '' }, // 프로필 이미지 URL(없으면 아이콘)
});

const emit = defineEmits(['logout']);
const handleLogout = () => emit('logout');

const router = useRouter();
const goMyPage = () => {
  router.push('/mypage');
};

const notificationStore = useNotificationStore();
const { notifications } = storeToRefs(notificationStore);

const unreadCount = computed(
  () => notifications.value.filter(n => !n.read).length
);

const isNotificationsOpen = ref(false);
const notificationRoot = ref(null);

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value;
};

const closeNotifications = () => {
  isNotificationsOpen.value = false;
};

// 외부 클릭 감지
const onDocClick = e => {
  const t = e.target;
  if (notificationRoot.value && !notificationRoot.value.contains(t)) {
    closeNotifications();
  }
};

onMounted(() => document.addEventListener('click', onDocClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));

// 알림 관련 함수들
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
