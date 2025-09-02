<template>
  <div class="relative inline-block text-left" @keydown.esc="open = false">
    <button
      class="inline-flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      @click="toggle"
    >
      <span>{{ selectedLabel }}</span>
      <i class="fas fa-chevron-down ml-2 text-xs"></i>
    </button>
    <div
      v-if="open"
      class="absolute left-0 z-50 mt-2 w-44 rounded-xl border border-gray-200 bg-white shadow-lg"
    >
      <ul class="max-h-60 overflow-auto py-1" role="listbox">
        <li
          v-for="opt in options"
          :key="opt.value"
          :class="[
            'cursor-pointer px-3 py-2 text-sm hover:bg-gray-50',
            opt.value === modelValue
              ? 'font-medium text-primary'
              : 'text-gray-700',
          ]"
          role="option"
          @click="select(opt.value)"
        >
          {{ opt.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number], default: null }, // 선택된 값
  options: { type: Array, required: true }, // 옵션 목록
});

const emit = defineEmits(['update:modelValue']);

const open = ref(false);
const selectedLabel = computed(() => {
  const found = props.options.find(o => o.value === props.modelValue);
  return found ? found.label : '선택';
});

const toggle = () => {
  open.value = !open.value;
};
const select = v => {
  emit('update:modelValue', v);
  open.value = false;
};
</script>
