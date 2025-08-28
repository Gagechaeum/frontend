<template>
  <section :class="wrapper">
    <div
      v-if="title || $slots.actions || $slots.description"
      class="mb-6 flex items-center justify-between"
    >
      <div>
        <h2 v-if="title" class="text-xl font-bold text-gray-900">
          {{ title }}
        </h2>
        <p v-if="$slots.description" class="mt-1 text-sm text-gray-600">
          <slot name="description" />
        </p>
      </div>
      <div class="shrink-0">
        <slot name="actions" />
      </div>
    </div>
    <slot />
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: { type: String, default: '' }, // 제목
  card: { type: Boolean, default: false }, // 카드 스타일 적용
});

const wrapper = computed(() =>
  props.card ? 'bg-white rounded-2xl border border-gray-200 p-6 mb-8' : 'mb-8'
);
</script>
