<template>
  <form class="relative" @submit.prevent="onSubmit">
    <label :for="id" class="sr-only">{{ ariaLabel }}</label>
    <input
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      class="w-full rounded-2xl border border-gray-300 px-4 py-3 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-info"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <button
      type="submit"
      class="absolute left-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-gray-100"
      aria-label="검색"
    >
      <i class="fas fa-search text-gray-400"></i>
    </button>
  </form>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' }, // 검색어
  placeholder: {
    type: String,
    default: '정부 지원 상품, 대출 상품을 검색해보세요',
  }, // 플레이스홀더
  ariaLabel: { type: String, default: '검색어 입력' },
  id: { type: String, default: 'global-search' },
});
const emit = defineEmits(['update:modelValue', 'submit']);
const onSubmit = () => emit('submit', props.modelValue);
</script>
