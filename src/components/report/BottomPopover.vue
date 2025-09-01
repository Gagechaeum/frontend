<template>
  <div class="relative inline-block" @keydown.esc="open = false">
    <span
      ref="anchor"
      tabindex="0"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
      @focus="onEnter"
      @blur="onLeave"
      @click="toggleOnMobile"
    >
      <slot name="anchor">
        <span
          class="inline-block cursor-pointer rounded bg-gray-100 px-1 py-0.5 text-xs text-gray-800 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {{ label || '보기' }}
        </span>
      </slot>
    </span>

    <transition name="fade">
      <div
        v-if="open"
        class="absolute left-1/2 z-50 mt-2 w-64 -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-3 text-left shadow-xl"
        @mouseenter="hovering = true"
        @mouseleave="onLeave"
      >
        <!-- ✅ [추가] 선택적 헤더: 제목 + 우측 배지 -->
        <div
          v-if="headerTitle || headerBadgeText"
          class="mb-2 flex items-center justify-between"
        >
          <h4 class="truncate text-sm font-bold text-gray-900">
            {{ headerTitle }}
          </h4>
          <span
            v-if="headerBadgeText"
            :class="badgeClass"
            class="ml-2 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
          >
            {{ headerBadgeText }}
          </span>
        </div>

        <!-- 사용자가 넘기는 본문 슬롯 -->
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

/**
 * ✅ 새로 추가된 props (기존 것 손대지 않음)
 * - headerTitle: 툴팁 상단 제목 (좌측)
 * - headerBadgeText: 뱃지 텍스트 (우측) — 예: '대출' / '정책'
 * - headerBadgeType: 'loan' | 'policy' | 'neutral'  (색상 테마)
 */
const props = defineProps({
  label: { type: String, default: '' },
  headerTitle: { type: String, default: '' },
  headerBadgeText: { type: String, default: '' },
  headerBadgeType: {
    type: String,
    default: 'neutral', // 'loan' | 'policy' | 'neutral'
  },
});

const open = ref(false);
const hovering = ref(false);
const anchor = ref(null);

const onEnter = () => {
  open.value = true;
  hovering.value = true;
};
const onLeave = () => {
  hovering.value = false;
  setTimeout(() => {
    if (!hovering.value) open.value = false;
  }, 80);
};

const toggleOnMobile = e => {
  if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
    e.preventDefault();
    open.value = !open.value;
  }
};

/* ✅ 배지 색상: 우측에 붙음 */
const badgeClass = computed(() => {
  switch (props.headerBadgeType) {
    case 'loan':
      return 'bg-blue-100 text-blue-700';
    case 'policy':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-700';
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.12s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
