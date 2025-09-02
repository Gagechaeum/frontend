<template>
  <div class="min-h-screen bg-[#f7f8fa]">
    <!-- 상단 툴바 -->
    <DocsToolbar
      @show-upload-modal="showUploadModal = true"
      @download-zip="handleDownloadZip"
    />

    <!-- 서류 패널 -->
    <DocsHelperPanel @show-upload-modal="showUploadModal = true" />

    <!-- 메인 컨텐츠 -->
    <div class="px-6 pb-6">
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
              placeholder="상품/기관 검색"
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

    <!-- ✅ 공통 서류 추가 모달 -->
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
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700"
            >서류명</label
          >
          <input
            v-model="newDoc.name"
            type="text"
            required
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
import { ref, computed, watch } from 'vue';
import { useDocsStore } from '@/stores/docs';
import DocsToolbar from '@/components/docs/DocsToolbar.vue';
import DocsHelperPanel from '@/components/docs/DocsHelperPanel.vue';
import KanbanBoard from '@/components/docs/KanbanBoard.vue';
import DocsListView from '@/components/docs/DocsListView.vue';
import Dropdown from '@/components/common/Dropdown.vue';
import Modal from '@/components/common/Modal.vue';

const docsStore = useDocsStore();
const showUploadModal = ref(false);

// 새로운 서류 데이터
const newDoc = ref({
  name: '',
  issueDate: '',
  file: null,
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
  newDoc.value.file = event.target.files[0];
};

const handleAddDocument = () => {
  if (!newDoc.value.name || !newDoc.value.issueDate || !newDoc.value.file)
    return;

  console.log('새 서류 추가:', newDoc.value);

  // TODO: 실제 store에 저장하는 로직 추가 가능
  docsStore.addDocument?.(newDoc.value);

  // 초기화 & 닫기
  newDoc.value = { name: '', issueDate: '', file: null };
  showUploadModal.value = false;
};

const closeUploadModal = () => {
  showUploadModal.value = false;
  newDoc.value = { name: '', issueDate: '', file: null };
};

// ZIP 다운로드 처리
const handleDownloadZip = async () => {
  try {
    const userDocuments = docsStore.filteredItems;
    if (userDocuments.length === 0) {
      alert('다운로드할 서류가 없습니다.');
      return;
    }

    const JSZip = await import('jszip');
    const zip = new JSZip.default();

    userDocuments.forEach(doc => {
      const docInfo = `서류명: ${doc.name}
기관: ${doc.institution}
타입: ${doc.type}
상태: ${doc.status}
진행률: ${doc.progress}%
완료된 서류: ${doc.completedDocs}/${doc.totalDocs}
마감일: ${doc.deadline}`;
      const fileName = `${doc.name.replace(/[^a-zA-Z0-9가-힣]/g, '_')}_${doc.institution.replace(/[^a-zA-Z0-9가-힣]/g, '_')}.txt`;
      zip.file(fileName, docInfo);
    });

    const summaryInfo = `서류 다운로드 요약
====================
다운로드 일시: ${new Date().toLocaleString('ko-KR')}
총 서류 수: ${userDocuments.length}개`;

    zip.file('서류_요약.txt', summaryInfo);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `내_서류_${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(
      `${userDocuments.length}개의 서류가 ZIP으로 다운로드되었습니다.`
    );
  } catch (error) {
    console.error('ZIP 다운로드 중 오류 발생:', error);
    alert('ZIP 다운로드 중 오류가 발생했습니다.');
  }
};
</script>

<style scoped></style>
