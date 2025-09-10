<template>
  <div class="min-h-screen bg-[#f7f8fa]">
    <!-- 상단 툴바 -->
    <div class="border-b border-gray-200 bg-white">
      <div class="mx-auto max-w-7xl px-6">
        <DocsToolbar
          @show-upload-modal="showUploadModal = true"
          @download-zip="handleDownloadZip"
        />
      </div>
    </div>

    <!-- 서류 패널 -->
    <div class="mx-auto max-w-7xl">
      <DocsHelperPanel @show-upload-modal="showUploadModal = true" />
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="mx-auto max-w-7xl px-6 pb-6">
      <!-- 필터링 및 검색 + 뷰 모드 전환 -->
      <div class="mb-6 flex items-center justify-between">
        <!-- 좌측: 필터링 및 검색 -->
        <div class="flex items-center gap-4">
          <Dropdown v-model="filters.type" :options="typeOptions" />
          <Dropdown v-model="filters.status" :options="statusOptions" />
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="대출/정책/기관 검색"
              class="w-64 rounded-lg border border-[#e5e7eb] bg-white py-2 pl-10 pr-4 text-sm"
            />
            <i
              class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 transform text-sm text-gray-400"
            ></i>
          </div>
        </div>

        <!-- 우측: 뷰 모드 전환 탭 -->
        <div class="flex rounded-lg bg-gray-100 p-1">
          <button
            :class="{
              'bg-white text-[#2563EB] shadow-sm': viewMode === 'kanban',
              'text-gray-600': viewMode !== 'kanban',
            }"
            class="!rounded-button cursor-pointer whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all"
            @click="docsStore.setViewMode('kanban')"
          >
            칸반보드형
          </button>
          <button
            :class="{
              'bg-white text-[#2563EB] shadow-sm': viewMode === 'list',
              'text-gray-600': viewMode !== 'list',
            }"
            class="!rounded-button cursor-pointer whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all"
            @click="docsStore.setViewMode('list')"
          >
            리스트형
          </button>
        </div>
      </div>

      <!-- 칸반보드 뷰 -->
      <KanbanBoard v-if="viewMode === 'kanban'" />

      <!-- 리스트 뷰 -->
      <DocsListView v-if="viewMode === 'list'" />
    </div>

    <!-- 공통 서류 추가 모달 -->
    <Modal
      :show="showUploadModal"
      title="서류 추가"
      cancel-text="취소"
      confirm-text="추가"
      @close="closeUploadModal"
      @cancel="closeUploadModal"
      @confirm="handleAddDocument"
    >
      <div class="space-y-4">
        <!-- 서류 유형 선택 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700"
            >서류 유형</label
          >
          <select
            v-model="newDoc.typeId"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563EB]"
          >
            <option value="">서류 유형을 선택하세요</option>
            <option
              v-for="docType in documentTypes"
              :key="docType.id"
              :value="docType.id"
            >
              {{ docType.name }}
            </option>
          </select>
        </div>

        <!-- 서류명 입력 (기타 선택 시에만 표시) -->
        <div v-if="selectedTypeName === '기타'">
          <label class="mb-2 block text-sm font-medium text-gray-700"
            >서류명</label
          >
          <input
            v-model="newDoc.customName"
            type="text"
            :required="selectedTypeName === '기타'"
            placeholder="서류명을 입력하세요"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700"
            >발급일</label
          >
          <input
            v-model="newDoc.issueDate"
            type="date"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700"
            >서류 파일</label
          >
          <input
            type="file"
            accept=".pdf"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563EB]"
            @change="handleFileUpload"
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useDocsStore } from '@/stores/docs';
import { useNotificationStore } from '@/stores/notification';
import DocsToolbar from '@/components/docs/DocsToolbar.vue';
import DocsHelperPanel from '@/components/docs/DocsHelperPanel.vue';
import KanbanBoard from '@/components/docs/KanbanBoard.vue';
import DocsListView from '@/components/docs/DocsListView.vue';
import Dropdown from '@/components/common/Dropdown.vue';
import Modal from '@/components/common/Modal.vue';
import { getDocumentTypes } from '@/lib/api/documents.js';

const docsStore = useDocsStore();
const showUploadModal = ref(false);
const notification = useNotificationStore();

// 새로운 서류 데이터
const newDoc = ref({
  typeId: '',
  customName: '',
  issueDate: '',
  file: null,
});

// 선택된 유형명 계산
const documentTypes = ref([]);
const selectedTypeName = computed(() => {
  const sel = documentTypes.value.find(t => t.id === newDoc.value.typeId);
  return sel ? sel.name : '';
});

const viewMode = computed(() => docsStore.viewMode);

// 필터링 및 검색 상태
const searchQuery = ref(docsStore.searchQuery);
const filters = ref({ ...docsStore.filters });

// 드롭다운 옵션들
const typeOptions = [
  { value: 'all', label: '정책/대출' },
  { value: 'policy', label: '정책' },
  { value: 'loan', label: '대출' },
];

const statusOptions = [
  { value: 'all', label: '상태' },
  { value: 'requirements', label: '요건확인' },
  { value: 'collecting', label: '수집중' },
  { value: 'preparing', label: '제출준비' },
  { value: 'completed', label: '완료' },
];

// 서류 유형 로드
const loadDocumentTypes = async () => {
  try {
    const res = await getDocumentTypes();
    documentTypes.value = (res && res.data && res.data.list) || [];
  } catch (e) {
    notification.show('error', '서류 유형을 불러오지 못했습니다.');
  }
};

// 검색어 변경 시 store에 반영
watch(searchQuery, newQuery => {
  docsStore.setSearchQuery(newQuery);
});

// 필터 변경 시 store에 반영
watch(
  filters,
  newFilters => {
    docsStore.setFilters(newFilters);
  },
  { deep: true }
);

const handleFileUpload = event => {
  const file = event.target.files[0];

  // PDF 파일만 허용
  if (file && file.type !== 'application/pdf') {
    notification.show('error', 'PDF 파일만\n업로드 가능합니다.');
    event.target.value = ''; // 파일 선택 초기화
    return;
  }

  newDoc.value.file = file;
};

const handleAddDocument = async () => {
  if (!newDoc.value.typeId || !newDoc.value.issueDate || !newDoc.value.file)
    return;

  const nameToUse =
    selectedTypeName.value === '기타'
      ? newDoc.value.customName
      : selectedTypeName.value;
  if (!nameToUse) return;

  // API를 통해 서류 업로드 (문서 유형 매핑 반영)
  const success = await docsStore.addDocument({
    documentId: newDoc.value.typeId,
    documentName: nameToUse,
    issuedAt: newDoc.value.issueDate,
    file: newDoc.value.file,
  });

  if (success) {
    notification.show('success', '서류가 성공적으로 업로드되었습니다.');
    // 초기화 & 닫기
    newDoc.value = { typeId: '', customName: '', issueDate: '', file: null };
    showUploadModal.value = false;
  } else {
    notification.show(
      'error',
      docsStore.error || '서류 업로드에 실패했습니다.'
    );
  }
};

const closeUploadModal = () => {
  showUploadModal.value = false;
  newDoc.value = { typeId: '', customName: '', issueDate: '', file: null };
};

// 다운로드 핸들러
const handleDownloadZip = async () => {
  // 스토어의 사용자 서류 목록 기준으로 일괄 다운로드
  const list = docsStore.userDocuments || [];
  if (!list.length) {
    notification.show('error', '다운로드할 파일이 없습니다.');
    return;
  }

  const ids = list
    .map(d => d.userDocumentId)
    .filter(id => id !== null && id !== undefined);

  if (!ids.length) {
    notification.show('error', '다운로드할 파일이 없습니다.');
    return;
  }

  const success = await docsStore.downloadDocuments(ids);
  if (success) {
    notification.show('success', '서류가 다운로드되었습니다.');
  } else {
    notification.show(
      'error',
      docsStore.error || '서류 다운로드에 실패했습니다.'
    );
  }
};

// 컴포넌트 마운트 시 서류 목록 로드
onMounted(async () => {
  await docsStore.fetchUserDocuments();
  await docsStore.fetchBookmarksProgress();
  await loadDocumentTypes();
});
</script>

<style scoped></style>
