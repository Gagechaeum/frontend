<template>
  <button
    :aria-pressed="active"
    class="p-1"
    :title="active ? '즐겨찾기 해제' : '즐겨찾기'"
    @click="$emit('toggle')"
  >
    <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        :fill="active ? '#FFBC00' : 'none'"
        :stroke="active ? '#FFBC00' : '#9CA3AF'"
        stroke-width="2"
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  </button>
</template>
<script setup>
defineProps({ active: { type: Boolean, default: false } });
defineEmits(['toggle']);
</script>
