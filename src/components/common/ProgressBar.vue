<template>
  <div class="h-2 w-full rounded-full bg-gray-200">
    <div
      class="h-2 rounded-full bg-[#FFD400] transition-all"
      :style="{ width: progress + '%' }"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  progress: {
    type: Number,
    required: true,
    validator: value => value >= 0 && value <= 100,
  },
});
</script>
