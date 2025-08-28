<template>
  <button
    class="inline-flex items-center text-sm font-medium text-primary hover:underline"
    @click="$emit('click')"
  >
    <slot>더 보기</slot>
    <i class="fas fa-chevron-right ml-1 text-xs" aria-hidden="true"></i>
  </button>
</template>

<script setup>
defineEmits(['click']);
</script>
