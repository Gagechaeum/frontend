<template>
  <header class="sticky top-0 z-50 border-b border-gray-200 bg-white">
    <div class="mx-auto max-w-7xl px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- 로고 -->
        <div class="flex items-center">
          <slot name="logo">
            <i
              class="fas fa-landmark mr-2 text-2xl text-primary"
              aria-hidden="true"
            ></i>
            <span class="text-xl font-bold text-gray-900">가게채움</span>
          </slot>
        </div>

        <!-- 네비게이션 -->
        <nav class="hidden items-center space-x-8 md:flex" aria-label="Primary">
          <slot name="nav">
            <a
              href="/"
              class="cursor-pointer font-medium text-gray-700 hover:text-primary"
              >전체 상품</a
            >
            <a
              href="/schedule"
              class="cursor-pointer font-medium text-gray-700 hover:text-primary"
              >일정</a
            >
            <a
              href="/mypage"
              class="cursor-pointer font-medium text-gray-700 hover:text-primary"
              >내 서류함</a
            >
            <a
              href="/community"
              class="cursor-pointer font-medium text-gray-700 hover:text-primary"
              >커뮤니티</a
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
          <button
            v-if="showBell"
            class="rounded-full p-2 hover:bg-gray-100"
            aria-label="알림"
          >
            <i class="fas fa-bell text-lg text-gray-600" aria-hidden="true"></i>
          </button>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full bg-primary"
            aria-label="프로필"
          >
            <slot name="avatar">
              <i class="fas fa-user text-sm text-white" aria-hidden="true"></i>
            </slot>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  chips: { type: Array, default: () => [] }, // 사용자 정보 목록 (태그)
  showBell: { type: Boolean, default: true }, // 알림 버튼 표시 여부
});
</script>
