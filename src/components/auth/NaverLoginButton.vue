<!-- src/components/auth/NaverLoginButton.vue -->
<template>
  <button
    type="button"
    class="relative flex w-full items-center justify-center rounded-xl bg-[#03C75A] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#03C75A] focus-visible:ring-offset-2 disabled:opacity-60"
    :disabled="loading"
    aria-label="네이버로 계속하기"
    @click="onClick"
  >
    <!-- 좌측 아이콘: 네이버 공식 로고 이미지 -->
    <span
      class="absolute left-4 inline-flex h-8 w-8 items-center justify-center"
    >
      <img
        :src="naverLogo"
        alt=""
        class="pointer-events-none h-7 w-7 select-none rounded-[6px] object-contain md:h-8 md:w-8"
        draggable="false"
        style="transform: none"
      />
    </span>

    <span class="pl-10">
      {{ loading ? '네이버로 이동 중…' : '네이버로 계속하기' }}
    </span>
  </button>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import naverLogo from '@/assets/naver.png'; // ✅ 여기로 이미지 저장해 주세요

const route = useRoute();
const loading = ref(false);

const onClick = () => {
  loading.value = true;
  const next = route.query.next || route.fullPath || '/';
  localStorage.setItem('postLoginRedirect', String(next));

  // 프록시 타게 상대경로 사용
  const oauthPath =
    import.meta.env.VITE_NAVER_OAUTH_PATH || '/oauth2/authorization/naver';
  window.location.href = oauthPath;
};
</script>
