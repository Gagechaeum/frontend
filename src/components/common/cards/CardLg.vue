<template>
  <article
    :class="[
      'flex cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm',
      $attrs.class,
    ]"
  >
    <div class="mb-3 flex items-center justify-between">
      <Tag v-if="badge" :label="badge" :tone="badgeTone" size="xs" />
      <button
        v-if="showStar"
        class="rounded p-1 hover:bg-gray-100"
        :aria-pressed="favorited"
        aria-label="즐겨찾기"
        @click.stop="handleStarClick"
      >
        <i
          :class="[
            'far fa-star',
            favorited ? 'text-yellow-400' : 'text-gray-400',
          ]"
        ></i>
      </button>
    </div>

    <!-- 상단 추가 영역 -->
    <slot name="header" />

    <h3 class="mb-2 line-clamp-2 font-semibold text-gray-900">{{ title }}</h3>

    <!-- 제목 아래 추가 영역 -->
    <slot name="after-title" />

    <!-- 중간 영역 (유연하게 확장) -->
    <div class="flex-1">
      <div
        v-if="details && details.length"
        class="mb-4 space-y-0.5 text-sm text-gray-600"
      >
        <div v-for="(d, i) in details" :key="i">
          <span class="text-gray-700">{{ d.label }}:</span>
          <span :class="d.tone === 'danger' ? 'text-danger' : ''">{{
            d.value
          }}</span>
        </div>
      </div>

      <!-- 상세 정보 아래 추가 영역 -->
      <slot name="after-details" />

      <!-- 버튼 위 추가 영역 -->
      <slot name="before-action" />
    </div>

    <!-- 하단 고정 영역 -->
    <div class="mt-auto">
      <UiButton
        v-if="actionLabel"
        variant="secondary"
        block
        size="sm"
        @click="$emit('action')"
        >{{ actionLabel }}
      </UiButton>

      <!-- 버튼 아래 추가 영역 -->
      <slot name="footer" />
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import Tag from '@/components/common/Tag.vue';
import UiButton from '@/components/common/UiButton.vue';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  title: { type: String, required: true }, // 제목
  badge: { type: String, default: '' }, // 뱃지
  badgeTone: { type: String, default: 'gray' }, // 뱃지 색상
  details: { type: Array, default: () => [] }, // [{label, value, tone?}]
  actionLabel: { type: String, default: '' }, // 버튼 라벨
  favorited: { type: Boolean, default: false }, // 즐겨찾기 상태
  hideStarWhenNotLoggedIn: { type: Boolean, default: true }, // 비로그인 시 별 모양 숨기기 여부
});

const emit = defineEmits(['update:favorited', 'action']);

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

// 로그인 상태 확인
const isLoggedIn = computed(() => !!authStore.user);

// 별 모양 표시 여부 결정
const showStar = computed(() => {
  if (props.hideStarWhenNotLoggedIn) {
    return isLoggedIn.value;
  }
  return true;
});

// 별 모양 클릭 처리
const handleStarClick = () => {
  if (isLoggedIn.value) {
    // 로그인 상태: 즐겨찾기 토글
    emit('update:favorited', !props.favorited);
  } else {
    // 비로그인 상태: 알림 표시
    notificationStore.show('info', '로그인 후 즐겨찾기가 가능합니다');
  }
};
</script>
