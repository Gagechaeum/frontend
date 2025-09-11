<template>
  <div ref="rootEl" class="relative">
    <!-- 트리거 버튼 -->
    <button
      class="!rounded-button flex cursor-pointer items-center space-x-2 rounded-full p-2 transition-colors hover:bg-gray-100"
      aria-haspopup="menu"
      :aria-expanded="open ? 'true' : 'false'"
      @click="toggle"
    >
      <div
        class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary"
      >
        <template v-if="avatar">
          <img :src="avatar" alt="avatar" class="h-full w-full object-cover" />
        </template>
        <i v-else class="fas fa-user text-sm text-white"></i>
      </div>
    </button>

    <!-- 드롭다운 -->
    <div
      v-show="open"
      class="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-gray-200 bg-white py-2 shadow-lg"
      role="menu"
      @keydown.esc="open = false"
    >
      <!-- 사용자 정보 -->
      <div class="border-b border-gray-100 px-4 py-3">
        <p class="truncate text-base font-bold text-gray-900">
          {{ displayedUserInfo.name }}
        </p>
        <p class="mt-1 truncate text-sm text-gray-500">
          <span v-if="displayedUserInfo.region">{{
            displayedUserInfo.region
          }}</span>
          <span v-if="displayedUserInfo.region && displayedUserInfo.business">
            ·
          </span>
          <span v-if="displayedUserInfo.business">{{
            displayedUserInfo.business
          }}</span>
        </p>
      </div>

      <!-- 메뉴 -->
      <div class="py-1">
        <button
          class="w-full cursor-pointer whitespace-nowrap px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
          role="menuitem"
          @click="goMyPage"
        >
          <i class="fas fa-user-circle mr-2"></i>마이페이지
        </button>
        <button
          class="w-full cursor-pointer whitespace-nowrap px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
          role="menuitem"
          @click="logoutClick"
        >
          <i class="fas fa-sign-out-alt mr-2"></i>로그아웃
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useMyPageStore } from '@/stores/mypage';
import { useAuthStore } from '@/stores/auth';
import { logout as apiLogout } from '@/lib/api/auth';

// ── props/emit
const props = defineProps({
  userInfo: { type: Object, default: null }, // { name, region, business } (표시용 초기값)
  avatar: { type: String, default: '' },
});
const emit = defineEmits(['mypage', 'logout-click']);

// ── refs/store/router
const open = ref(false);
const rootEl = ref(null);
const router = useRouter();
const my = useMyPageStore();
const auth = useAuthStore();

// ── 안전 전역 핸들 (ESLint/SSR 가드)
const g = typeof globalThis !== 'undefined' ? globalThis : undefined;
const d = g?.document;
const ls = g?.localStorage;
const ss = g?.sessionStorage;

// ── 표시용 계산값: auth 스토어 우선, 없으면 props, 그마저 없으면 기본값
const displayedUserInfo = computed(() => {
  if (auth?.isReady && auth?.user) {
    return {
      name: auth.userInfo.name || '사용자',
      region: auth.userInfo.region || '',
      business: auth.userInfo.business || '',
    };
  }
  return {
    name: props.userInfo?.name ?? '사용자',
    region: props.userInfo?.region ?? '',
    business: props.userInfo?.business ?? '',
  };
});

// ── helpers
const close = () => (open.value = false);

const hasToken = () => {
  try {
    return !!(
      ls?.getItem('access_token') ||
      ls?.getItem('accessToken') ||
      ls?.getItem('token') ||
      ss?.getItem('access_token') ||
      ss?.getItem('accessToken') ||
      ss?.getItem('token')
    );
  } catch {
    return false;
  }
};

// ── 외부 클릭 닫기(캡처 단계)
const onDocClick = evt => {
  const t = evt.target;
  if (rootEl.value && !rootEl.value.contains(t)) close();
};

// ── 토글(로그인 가드 + 최신 상태 보장)
const toggle = async evt => {
  evt?.stopPropagation();

  // auth 스토어가 준비되지 않았다면 세션 복원 시도
  if (!auth?.isReady) {
    await auth.hydrateSession().catch(() => {});
  }

  if (!(auth?.user || hasToken())) {
    router.push('/login');
    return;
  }

  open.value = !open.value;
  await nextTick();
};

// ── 마이페이지 이동 (부모에 위임)
const goMyPage = () => {
  emit('mypage');
  close();
};

// ── 로그아웃
const logoutClick = async () => {
  try {
    await apiLogout();
  } catch {
    // ignore
  } finally {
    try {
      await auth.doLogout();
    } catch (e) {
      void e; // 변수 참조로 블록을 "비지 않게" 처리 (no-op)
    }
    emit('logout-click');
    close();
    router.replace('/login');
  }
};

// ── 마운트/언마운트
onMounted(() => {
  d?.addEventListener?.('click', onDocClick, true);
});
onBeforeUnmount(() => {
  d?.removeEventListener?.('click', onDocClick, true);
});
</script>

<style scoped>
.\!rounded-button {
  border-radius: 8px;
}
</style>
