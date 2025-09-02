<template>
  <div>
    <!-- 체크리스트 모달 -->
    <ChecklistModal
      v-if="showChecklistModal"
      :item="selectedItem"
      :is-open="showChecklistModal"
      @close="closeChecklistModal"
    />

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
                신청 마감
              </th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-600">
                체크리스트
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
                <Tag
                  :variant="item.type === '정책' ? 'blue' : 'green'"
                  size="sm"
                >
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
                    'bg-yellow-100 text-yellow-700':
                      item.status === 'preparing',
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
                  <div class="w-16">
                    <ProgressBar :progress="item.progress" />
                  </div>
                  <span class="text-sm text-gray-600"
                    >{{ item.progress }}%</span
                  >
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="{
                    'font-semibold text-red-600':
                      item.deadline.includes('D-') &&
                      parseInt(item.deadline.replace('D-', '')) <= 7,
                    'font-semibold text-orange-600':
                      item.deadline.includes('D-') &&
                      parseInt(item.deadline.replace('D-', '')) <= 14,
                    'font-semibold text-blue-600':
                      item.deadline.includes('D-') &&
                      parseInt(item.deadline.replace('D-', '')) > 14,
                    'font-semibold text-green-600': item.deadline === '완료',
                  }"
                  class="text-sm font-medium"
                >
                  {{ item.deadline }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button
                  class="!rounded-button flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                  @click="openChecklistModal(item)"
                >
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  체크리스트
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDocsStore } from '@/stores/docs';
import Tag from '@/components/common/Tag.vue';
import ProgressBar from '@/components/common/ProgressBar.vue';
import ChecklistModal from './ChecklistModal.vue';

const docsStore = useDocsStore();
const showChecklistModal = ref(false);
const selectedItem = ref(null);

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

// 체크리스트 모달 열기
const openChecklistModal = item => {
  selectedItem.value = item;
  showChecklistModal.value = true;
};

// 체크리스트 모달 닫기
const closeChecklistModal = () => {
  showChecklistModal.value = false;
  selectedItem.value = null;
};
</script>
