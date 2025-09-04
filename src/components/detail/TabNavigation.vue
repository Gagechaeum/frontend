<template>
  <div class="sticky top-16 z-10 border-b border-gray-200 bg-white">
    <div class="mx-auto max-w-7xl px-6">
      <nav class="flex space-x-8 overflow-x-auto">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="{
            'border-yellow-400 text-yellow-600': activeTab === index,
            'border-transparent text-gray-600 hover:text-gray-900':
              activeTab !== index,
          }"
          class="cursor-pointer whitespace-nowrap border-b-2 px-2 py-4 text-sm font-medium"
          @click="$emit('update:activeTab', index)"
        >
          {{ tab }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  activeTab: {
    type: Number,
    required: true,
  },
});

defineEmits(['update:activeTab']);
</script>
