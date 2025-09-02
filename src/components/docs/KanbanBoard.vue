<template>
  <div class="grid grid-cols-4 gap-6">
    <div
      v-for="column in kanbanColumns"
      :key="column.id"
      class="rounded-2xl border border-[#e5e7eb] bg-white p-4"
      @dragover.prevent
      @drop="handleDrop($event, column.id)"
    >
      <div class="mb-4 flex items-center justify-between">
        <h3 class="font-semibold text-gray-900">{{ column.title }}</h3>
        <span
          class="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
          >{{ getColumnItems(column.id).length }}</span
        >
      </div>

      <div class="space-y-3">
        <div
          v-if="getColumnItems(column.id).length === 0"
          class="py-8 text-center text-gray-500"
        >
          <p class="text-sm">{{ getEmptyColumnMessage(column.id) }}</p>
        </div>

        <div
          v-for="item in getColumnItems(column.id)"
          :key="item.id"
          class="cursor-move rounded-xl bg-gray-50 p-4 transition-shadow hover:shadow-md"
          draggable="true"
          @dragstart="handleDragStart($event, item)"
          @dragend="handleDragEnd"
        >
          <div class="mb-2 flex items-center gap-2">
            <Tag :variant="item.type === '정책' ? 'blue' : 'green'" size="sm">
              {{ item.type }}
            </Tag>
          </div>

          <h4 class="mb-1 font-medium text-gray-900">{{ item.name }}</h4>
          <p class="mb-3 text-sm text-gray-600">{{ item.institution }}</p>

          <div class="mb-3">
            <div class="mb-1 flex justify-between text-sm text-gray-600">
              <span
                >필요서류 {{ item.completedDocs }}/{{ item.totalDocs }}</span
              >
              <span>{{ item.progress }}%</span>
            </div>
            <div class="h-2 w-full rounded-full bg-gray-200">
              <div
                class="h-2 rounded-full bg-[#FFD400] transition-all"
                :style="{ width: item.progress + '%' }"
              ></div>
            </div>
          </div>

          <div class="flex items-center justify-end">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDocsStore } from '@/stores/docs';
import Tag from '@/components/common/Tag.vue';

const docsStore = useDocsStore();
const draggedItem = ref(null);

const kanbanColumns = computed(() => [
  { id: 'requirements', title: '요건확인' },
  { id: 'collecting', title: '서류 수집/업로드' },
  { id: 'preparing', title: '제출 준비' },
  { id: 'completed', title: '제출 완료/결과' },
]);

const getColumnItems = columnId => {
  return docsStore.filteredItems.filter(item => item.status === columnId);
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

const getEmptyColumnMessage = columnId => {
  const messages = {
    requirements: '요건확인 중인 상품이 없습니다.',
    collecting: '서류 수집 중인 상품이 없습니다.',
    preparing: '제출 준비 중인 상품이 없습니다.',
    completed: '제출 완료된 상품이 없습니다.',
  };
  return messages[columnId] || '아직 등록된 신청이 없어요.';
};

// 드래그 시작
const handleDragStart = (event, item) => {
  draggedItem.value = item;
  event.dataTransfer.effectAllowed = 'move';
  event.target.style.opacity = '0.5';
};

// 드래그 종료
const handleDragEnd = event => {
  event.target.style.opacity = '1';
  draggedItem.value = null;
};

// 드롭 처리
const handleDrop = (event, targetStatus) => {
  event.preventDefault();

  if (draggedItem.value && draggedItem.value.status !== targetStatus) {
    // 아이템 상태 업데이트
    const updatedItem = { ...draggedItem.value, status: targetStatus };

    // 스토어에서 아이템 업데이트
    docsStore.updateItemStatus(draggedItem.value.id, targetStatus);

    // 드래그된 아이템 초기화
    draggedItem.value = null;
  }
};
</script>
