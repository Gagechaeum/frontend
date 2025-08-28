<template>
  <span :class="['inline-block w-fit', classes]">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: { type: String, default: '' }, // 텍스트
  tone: { type: String, default: 'gray' }, // gray|blue|yellow|red|green
  size: { type: String, default: 'sm' }, // xs|sm
  rounded: { type: String, default: 'lg' }, // lg|full
});

const toneMap = {
  gray: 'bg-gray-100 text-gray-700',
  blue: 'bg-blue-100 text-blue-700',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-700',
  green: 'bg-green-100 text-green-800',
};

const sizeMap = { xs: 'text-xs px-2 py-0.5', sm: 'text-xs px-2.5 py-1' };
const classes = computed(() =>
  [
    toneMap[props.tone],
    sizeMap[props.size],
    props.rounded === 'full' ? 'rounded-full' : 'rounded-lg',
  ].join(' ')
);
</script>
