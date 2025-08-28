<template>
  <article
    class="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm"
  >
    <div class="mb-3 flex items-center justify-between">
      <Tag v-if="badge" :label="badge" :tone="badgeTone" size="xs" />
      <button
        class="rounded p-1 hover:bg-gray-100"
        :aria-pressed="favorited"
        aria-label="즐겨찾기"
        @click.stop="emit('update:favorited', !favorited)"
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
  </article>
</template>

<script setup>
import Tag from '@/components/common/Tag.vue';
import UiButton from '@/components/common/UiButton.vue';

const props = defineProps({
  title: { type: String, required: true }, // 제목
  badge: { type: String, default: '' }, // 뱃지
  badgeTone: { type: String, default: 'gray' }, // 뱃지 색상
  details: { type: Array, default: () => [] }, // [{label, value, tone?}]
  actionLabel: { type: String, default: '' }, // 버튼 라벨
  favorited: { type: Boolean, default: false }, // 즐겨찾기 상태
});

const emit = defineEmits(['update:favorited', 'action']);
</script>
