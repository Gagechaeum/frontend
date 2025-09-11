<!-- src/components/common/AppHeader.vue -->
<template>
  <header
    :class="[
      'left-0 right-0 z-50 transition-all duration-700 ease-in-out',
      overlayActive
        ? 'fixed top-0 border-transparent bg-transparent'
        : 'sticky top-0 border-b border-gray-200 bg-white/90 backdrop-blur-sm',
    ]"
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
            v-if="displayChips && displayChips.length"
            class="hidden items-center space-x-2 sm:flex"
          >
            <span
              v-for="chip in displayChips"
              :key="chip"
              class="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
            >
              {{ chip }}
            </span>
          </div>

          <!-- 로그인 상태에 따른 UI 분기 -->
          <div v-if="isLoggedIn" class="flex items-center space-x-4">
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

            <!-- 프로필 드롭다운 -->
            <ProfileDropdown
              :user-info="displayUserInfo"
              :avatar="avatar"
              @mypage="goMyPage"
              @logout-click="handleLogout"
            />
          </div>
          <div v-else>
            <!-- 비로그인 사용자: 로그인 버튼 -->
            <RouterLink
              to="/login"
              class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              로그인
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
/* eslint-env browser */

import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  reactive,
  watchEffect,
} from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/notification';
import { useAuthStore } from '@/stores/auth';
import ProfileDropdown from '../mypage/ProfileDropdown.vue';
import { useMyPageStore } from '@/stores/mypage';

// ─────────────────────────────────────────────────────────────
// 스토어 & 표시용 userInfo (부모에서 직접 관리)
// ─────────────────────────────────────────────────────────────
const my = useMyPageStore();

const userInfo = reactive({
  name: '사용자',
  region: '',
  business: '',
});

// props: userInfo는 내부에서 관리하므로 정의하지 않습니다(중복키 방지)
const props = defineProps({
  overlay: { type: Boolean, default: false },
  chips: { type: Array, default: null },
  showBell: { type: Boolean, default: true }, // 알림 버튼 보이기
  userInfo: {
    type: Object,
    default: null,
  },
  avatar: { type: String, default: '' }, // 프로필 이미지 URL(없으면 아이콘)
});

// ─────────────────────────────────────────────────────────────
// 헤더 투명/불투명 전환
// ─────────────────────────────────────────────────────────────
const scrolled = ref(false);
const onScroll = () => {
  const w = globalThis?.window;
  if (w) {
    scrolled.value = w.scrollY > 12;
  }
};

onMounted(async () => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // 첫 렌더 상태 반영

  // 로그인된 사용자의 사업자 정보 로드
  if (isLoggedIn.value) {
    await authStore.loadBusinessInfo();
  }
});
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll);
  }
});

const overlayActive = computed(() => props.overlay && !scrolled.value);

// ─────────────────────────────────────────────────────────────
// 라우팅 / 로그아웃 핸들링
// ─────────────────────────────────────────────────────────────
const emit = defineEmits(['logout']);
const router = useRouter();

const handleLogout = () => {
  // 프로필 드롭다운에서 로그아웃 클릭 시 들어옴
  my.$reset();
  my.isLoaded = false;
  emit('logout');
  router.replace('/login');
};

const goMyPage = () => router.push('/mypage');

// ─────────────────────────────────────────────────────────────
// 알림 드롭다운
// ─────────────────────────────────────────────────────────────
const notificationStore = useNotificationStore();
const { notifications } = storeToRefs(notificationStore);

const authStore = useAuthStore();
const {
  chips: authChips,
  userInfo: authUserInfo,
  user,
} = storeToRefs(authStore);

const displayChips = computed(() => props.chips || authChips.value);
const displayUserInfo = computed(() => props.userInfo || authUserInfo.value);
const isLoggedIn = computed(() => !!user.value);

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

// 외부 클릭 닫기 (캡처 단계 등록)
const onDocClick = e => {
  const t = e.target;
  if (notificationRoot.value && !notificationRoot.value.contains(t)) {
    closeNotifications();
  }
};

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('click', onDocClick, true);
  }
});
onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', onDocClick, true);
  }
});

// ─────────────────────────────────────────────────────────────
// 알림 아이콘/색상/시간 포맷터 (템플릿에서 사용됨)
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// 스토어 → 헤더 표시값 동기화
// ─────────────────────────────────────────────────────────────
watchEffect(() => {
  if (my.isLoggedIn) {
    userInfo.name = my.displayName;
    userInfo.region = my.business?.regionName || '';
    userInfo.business = my.business?.industryName || '';
  } else {
    userInfo.name = '사용자';
    userInfo.region = '';
    userInfo.business = '';
  }
});
</script>
