<template>
  <article
    class="cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
  >
    <div v-if="label" class="mb-2">
      <Tag :label="label" :tone="labelTone" size="xs" />
    </div>

    <!-- 상단 추가 영역 -->
    <slot name="header" />

    <h3 class="mb-1 line-clamp-2 text-sm font-medium text-gray-900">
      {{ title }}
    </h3>

    <!-- 제목 아래 추가 영역 -->
    <slot name="after-title" />

    <p v-if="meta" class="text-xs text-gray-600">{{ meta }}</p>

    <!-- 메타 정보 아래 추가 영역 -->
    <slot name="after-meta" />

    <!-- 하단 추가 영역 -->
    <slot name="footer" />
  </article>
</template>

<script setup>
import Tag from '@/components/common/Tag.vue';

const props = defineProps({
  title: { type: String, required: true }, // 제목
  meta: { type: String, default: '' }, // 메타 정보
  label: { type: String, default: '' }, // 라벨
  labelTone: { type: String, default: 'yellow' }, // 라벨 색상
});
</script>
