<template>
  <div class="min-h-screen bg-[#f7f8fa]">
    <!-- 상단 툴바 -->
    <DocsToolbar
      @show-upload-modal="showUploadModal = true"
      @download-zip="handleDownloadZip"
    />

    <!-- 서류 패널 -->
    <DocsHelperPanel
      :show-upload-modal="showUploadModal"
      @close-upload-modal="showUploadModal = false"
      @add-document="handleAddDocument"
    />

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

const docsStore = useDocsStore();
const showUploadModal = ref(false);

const viewMode = computed(() => docsStore.viewMode);

// 필터링 및 검색 상태
const searchQuery = ref(docsStore.searchQuery);
const filters = ref({ ...docsStore.filters });

// 드롭다운 옵션들
const typeOptions = [
  { value: 'all', label: '전체' },
  { value: 'policy', label: '정책' },
  { value: 'loan', label: '대출' },
];

const statusOptions = [
  { value: 'all', label: '전체' },
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

const handleAddDocument = documentData => {
  console.log('새 서류 추가:', documentData);
};

// ZIP 다운로드 처리
const handleDownloadZip = async () => {
  try {
    // 현재 사용자의 서류 목록 가져오기 (필터링된 결과)
    const userDocuments = docsStore.filteredItems;

    if (userDocuments.length === 0) {
      alert('다운로드할 서류가 없습니다.');
      return;
    }

    // JSZip 라이브러리 사용하여 ZIP 생성
    const JSZip = await import('jszip');
    const zip = new JSZip.default();

    // 각 서류에 대한 가상 파일 생성
    userDocuments.forEach((doc, index) => {
      // 서류 정보를 텍스트 파일로 생성
      const docInfo = `서류명: ${doc.name}
기관: ${doc.institution}
타입: ${doc.type}
상태: ${doc.status}
진행률: ${doc.progress}%
완료된 서류: ${doc.completedDocs}/${doc.totalDocs}
마감일: ${doc.deadline}

첨부된 파일 목록:
${doc.files ? doc.files.map(file => `- ${file.name} (${file.size})`).join('\n') : '첨부된 파일 없음'}

생성일: ${new Date().toLocaleDateString('ko-KR')}`;

      // 파일명 생성 (특수문자 제거)
      const fileName = `${doc.name.replace(/[^a-zA-Z0-9가-힣]/g, '_')}_${doc.institution.replace(/[^a-zA-Z0-9가-힣]/g, '_')}.txt`;

      zip.file(fileName, docInfo);

      // 첨부된 파일들도 가상으로 생성 (실제 파일이 아닌 더미 파일)
      if (doc.files && doc.files.length > 0) {
        doc.files.forEach(file => {
          const fileContent = `이 파일은 ${file.name}의 가상 복사본입니다.
원본 파일 크기: ${file.size}
파일 타입: ${file.type}
서류명: ${doc.name}
기관: ${doc.institution}
생성일: ${new Date().toLocaleDateString('ko-KR')}`;

          zip.file(
            `${doc.name.replace(/[^a-zA-Z0-9가-힣]/g, '_')}/${file.name}`,
            fileContent
          );
        });
      }
    });

    // 전체 서류 요약 정보 생성
    const summaryInfo = `서류 다운로드 요약
====================
다운로드 일시: ${new Date().toLocaleString('ko-KR')}
총 서류 수: ${userDocuments.length}개
총 파일 수: ${userDocuments.reduce((total, doc) => total + (doc.files ? doc.files.length : 0), 0)}개

서류 목록:
${userDocuments.map((doc, index) => `${index + 1}. ${doc.name} (${doc.institution}) - ${doc.status}`).join('\n')}`;

    zip.file('서류_요약.txt', summaryInfo);

    // ZIP 파일 생성 및 다운로드
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
