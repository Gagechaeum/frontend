<template>
  <div>
    <!-- 체크리스트 모달 -->
    <ChecklistModal
      v-if="showChecklistModal"
      :item="selectedItem"
      :is-open="showChecklistModal"
      @close="closeChecklistModal"
    />
    <div class="mb-5 text-left">
      <p
        class="inline-block rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-gray-500"
      >
        카드를 드래그하여 진행 상태를 변경하세요
      </p>
    </div>
    <div class="grid grid-cols-4 gap-6">
      <div
        v-for="column in kanbanColumns"
        :key="column.id"
        class="rounded-2xl border border-[#e5e7eb] bg-white p-4"
        @dragover.prevent
        @drop="handleDrop($event, column.id)"
      >
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h3
              :class="{
                'text-gray-600': column.id === 'requirements',
                'text-blue-700': column.id === 'collecting',
                'text-yellow-700': column.id === 'preparing',
                'text-green-700': column.id === 'completed',
              }"
              class="font-semibold"
            >
              {{ column.title }}
            </h3>
            <span
              :class="{
                'bg-gray-100 text-gray-600': column.id === 'requirements',
                'bg-blue-100 text-blue-700': column.id === 'collecting',
                'bg-yellow-100 text-yellow-700': column.id === 'preparing',
                'bg-green-100 text-green-700': column.id === 'completed',
              }"
              class="rounded-full px-2 py-1 text-xs font-medium"
              >{{ getColumnItems(column.id).length }}</span
            >
          </div>
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
              <Tag :tone="item.type === '정책' ? 'yellow' : 'blue'" size="sm">
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
              <ProgressBar :progress="item.progress" />
            </div>

            <div class="flex items-center justify-end">
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
            </div>
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
import ProgressBar from '@/components/common/ProgressBar.vue';
import ChecklistModal from './ChecklistModal.vue';

const docsStore = useDocsStore();
const draggedItem = ref(null);
const showChecklistModal = ref(false);
const selectedItem = ref(null);

const kanbanColumns = computed(() => [
  { id: 'requirements', title: '요건확인' },
  { id: 'collecting', title: '서류 수집/업로드' },
  { id: 'preparing', title: '제출 준비' },
  { id: 'completed', title: '제출 완료/결과' },
]);

const getColumnItems = columnId => {
  const items = docsStore.filteredItems.filter(
    item => item.status === columnId
  );
  return items;
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
const handleDrop = async (event, targetStatus) => {
  event.preventDefault();

  if (draggedItem.value && draggedItem.value.status !== targetStatus) {
    const success = await docsStore.updateItemStatusWithAPI(
      draggedItem.value.id,
      targetStatus
    );

    if (success) {
      draggedItem.value = null;
    } else {
      console.error('상태 업데이트 실패');
    }
  }
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
