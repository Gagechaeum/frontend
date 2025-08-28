<template>
  <component
    :is="as"
    :type="type"
    :class="classes"
    :disabled="disabled"
    @click="onClick"
  >
    <span v-if="$slots.leading" class="mr-2 inline-flex">
      <slot name="leading" />
    </span>
    <slot />
    <span v-if="$slots.trailing" class="ml-2 inline-flex">
      <slot name="trailing" />
    </span>
  </component>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary|secondary|ghost
  size: { type: String, default: 'md' }, // sm|md|lg
  block: { type: Boolean, default: false }, // 버튼 너비 최대로 늘림
  as: { type: String, default: 'button' }, // 버튼 태그 지정
  type: { type: String, default: 'button' }, // 버튼 타입 지정
  disabled: { type: Boolean, default: false }, // 버튼 비활성화
});

const emit = defineEmits(['click']);

const base = 'rounded-2xl font-medium transition-colors rounded-button';
const sizeMap = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3',
};
const variantMap = {
  primary: 'bg-primary text-white hover:bg-brand-blue-royal',
  secondary: 'border border-primary text-primary hover:bg-primary/5 ',
  ghost: 'text-neutral-700 hover:bg-neutral-100',
};

const classes = computed(() =>
  [
    base,
    sizeMap[props.size],
    variantMap[props.variant],
    props.block ? 'w-full' : '',
  ].join(' ')
);
const onClick = ev => emit('click', ev);
</script>
