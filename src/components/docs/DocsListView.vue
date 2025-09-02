<template>
  <div class="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">
              유형
            </th>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">
              상품명/기관
            </th>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">
              상태
            </th>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">
              필요서류
            </th>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">
              진행률
            </th>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">
              액션
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in allItems"
            :key="item.id"
            class="border-b border-gray-50 hover:bg-gray-50"
          >
            <td class="px-6 py-4">
              <Tag :variant="item.type === '정책' ? 'blue' : 'green'" size="sm">
                {{ item.type }}
              </Tag>
            </td>
            <td class="px-6 py-4">
              <div>
                <p class="font-medium text-gray-900">{{ item.name }}</p>
                <p class="text-sm text-gray-600">{{ item.institution }}</p>
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                :class="{
                  'bg-gray-100 text-gray-600': item.status === 'requirements',
                  'bg-blue-100 text-blue-700': item.status === 'collecting',
                  'bg-yellow-100 text-yellow-700': item.status === 'preparing',
                  'bg-green-100 text-green-700': item.status === 'completed',
                }"
                class="rounded-full px-2 py-1 text-xs font-medium"
              >
                {{ getStatusText(item.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ item.completedDocs }}/{{ item.totalDocs }}
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <div class="h-2 w-16 rounded-full bg-gray-200">
                  <div
                    class="h-2 rounded-full bg-[#FFD400]"
                    :style="{ width: item.progress + '%' }"
                  ></div>
                </div>
                <span class="text-sm text-gray-600">{{ item.progress }}%</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <button
                :class="{
                  'bg-gray-100 text-gray-600': item.status === 'requirements',
                  'bg-blue-100 text-blue-700': item.status === 'collecting',
                  'bg-yellow-100 text-yellow-700': item.status === 'preparing',
                  'bg-green-100 text-green-700': item.status === 'completed',
                }"
                class="!rounded-button cursor-pointer whitespace-nowrap rounded-lg px-3 py-1 text-xs font-medium"
              >
                {{ getActionText(item.status) }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDocsStore } from '@/stores/docs';
import Tag from '@/components/common/Tag.vue';

const docsStore = useDocsStore();

const allItems = computed(() => docsStore.filteredItems);

const getStatusText = status => {
  const statusMap = {
    requirements: '요건확인',
    collecting: '수집중',
    preparing: '제출준비',
    completed: '완료',
  };
  return statusMap[status] || status;
};

const getActionText = status => {
  const actionMap = {
    requirements: '체크리스트',
    collecting: '업로드하기',
    preparing: '제출하기',
    completed: '결과보기',
  };
  return actionMap[status] || '확인';
};
</script>
