<template>
  <div class="flex items-center justify-center space-x-1 p-4">
    <!-- 이전 페이지 버튼 -->
    <button
      :disabled="currentPage === 0"
      class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
      @click="changePage(currentPage - 1)"
    >
      <i class="fas fa-chevron-left text-sm" />
    </button>

    <!-- 페이지 번호 버튼 -->
    <button
      v-for="page in pages"
      :key="page"
      :class="{
        'bg-blue-600 text-white': page - 1 === currentPage,
        'border border-gray-200 bg-white text-gray-600 hover:border-blue-400':
          page - 1 !== currentPage,
      }"
      class="flex h-9 w-9 items-center justify-center rounded-lg"
      @click="changePage(page - 1)"
    >
      {{ page }}
    </button>

    <!-- 다음 페이지 버튼 -->
    <button
      :disabled="currentPage === totalPages - 1 || totalPages === 0"
      class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
      @click="changePage(currentPage + 1)"
    >
      <i class="fas fa-chevron-right text-sm" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  maxVisibleButtons: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(['page-change']);

const pages = computed(() => {
  const { currentPage, totalPages, maxVisibleButtons } = props;
  if (totalPages <= 1) return [];

  const half = Math.floor(maxVisibleButtons / 2);
  let start = Math.max(currentPage - half, 0);
  let end = Math.min(start + maxVisibleButtons - 1, totalPages - 1);

  if (end - start + 1 < maxVisibleButtons) {
    start = Math.max(end - maxVisibleButtons + 1, 0);
  }

  const pageNumbers = [];
  for (let i = start; i <= end; i++) {
    pageNumbers.push(i + 1);
  }
  return pageNumbers;
});

const changePage = page => {
  if (page >= 0 && page < props.totalPages) {
    emit('page-change', page);
  }
};
</script>
