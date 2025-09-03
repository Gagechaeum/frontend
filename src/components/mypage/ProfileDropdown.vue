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
          {{ userInfo.name }}
        </p>
        <p class="mt-1 truncate text-sm text-gray-500">
          <span v-if="userInfo.region">{{ userInfo.region }}</span>
          <span v-if="userInfo.region && userInfo.business"> · </span>
          <span v-if="userInfo.business">{{ userInfo.business }}</span>
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
import { ref, onMounted, onBeforeUnmount } from 'vue';

/* ✅ TS 타입 제거하고 런타임 props로 전환 (ESLint 파싱 에러 해결) */
defineProps({
  userInfo: { type: Object, required: true },
  avatar: { type: String, default: '' },
});

const emit = defineEmits(['mypage', 'logout-click']);

const open = ref(false);
const rootEl = ref(null);

const toggle = () => (open.value = !open.value);
const close = () => (open.value = false);

const onDocClick = e => {
  const t = e.target;
  if (rootEl.value && !rootEl.value.contains(t)) close();
};

const goMyPage = () => {
  emit('mypage');
  close();
};

const logoutClick = () => {
  emit('logout-click');
  close();
};

onMounted(() => document.addEventListener('click', onDocClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));
</script>

<style scoped>
.\!rounded-button {
  border-radius: 8px;
}
</style>
