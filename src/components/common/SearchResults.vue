<template>
  <div
    v-if="results.length > 0"
    class="search-results absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg"
  >
    <h3 class="mb-3 text-sm font-medium text-gray-700">
      검색 결과 ({{ results.length }}건)
    </h3>
    <div class="space-y-2">
      <div
        v-for="result in results"
        :key="result.id"
        class="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2 transition-colors hover:bg-gray-100"
      >
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h4 class="text-sm font-medium text-gray-900">{{ result.name }}</h4>
            <Tag
              :label="result.typeLabel"
              :tone="result.type === '대출' ? 'blue' : 'yellow'"
              size="sm"
            />
            <button
              class="p-1.5 text-gray-400 hover:text-gray-500"
              :aria-label="`${result.name} 상세보기`"
              @click="handleDetailClick(result)"
            >
              <i class="fas fa-external-link-alt text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-else-if="hasSearched && searchQuery"
    class="search-results absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-lg"
  >
    <i class="fas fa-search mb-3 text-3xl text-gray-300"></i>
    <p class="text-gray-500">
      '{{ searchQuery }}'에 대한 검색 결과가 없습니다.
    </p>
    <p class="mt-1 text-sm text-gray-400">다른 키워드로 검색해보세요.</p>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import Tag from './Tag.vue';

const props = defineProps({
  results: { type: Array, default: () => [] },
  searchQuery: { type: String, default: '' },
  hasSearched: { type: Boolean, default: false },
});

const emit = defineEmits(['detail-click', 'close']);

const handleDetailClick = result => {
  emit('detail-click', result);
};

// 외부 클릭 감지 로직
const handleClickOutside = event => {
  const container = document.querySelector('.search-area');
  if (container?.contains(event.target)) return;
  emit('close');
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
