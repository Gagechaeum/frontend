<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- 배경 오버레이 -->
    <div
      class="absolute inset-0 bg-black bg-opacity-50"
      @click="closeModal"
    ></div>

    <!-- 체크리스트 모달 -->
    <Modal
      :show="isOpen && !showUploadModal"
      title="서류 체크리스트"
      :show-cancel-button="false"
      :show-confirm-button="false"
      @close="closeModal"
    >
      <!-- 이 안에 컨텐츠만 표시됨 -->
      <div class="mb-4 rounded-lg bg-gray-50 px-2 py-3">
        <h4 class="font-medium text-gray-900">{{ item.name }}</h4>
        <p class="text-sm text-gray-600">{{ item.institution }}</p>
      </div>

      <div class="space-y-3">
        <div
          v-for="(file, index) in requiredDocuments"
          :key="index"
          class="flex items-center justify-between rounded-lg border border-gray-200 p-3"
        >
          <div class="flex items-center gap-3">
            <div class="flex-shrink-0">
              <svg
                v-if="isDocumentUploaded(file)"
                class="h-5 w-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-900">{{
              file.name
            }}</span>
          </div>

          <button
            v-if="!isDocumentUploaded(file)"
            class="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
            @click="openUploadModal(file)"
          >
            등록하기
          </button>
        </div>
      </div>
    </Modal>

    <!-- 서류 추가 모달 -->
    <Modal
      :show="showUploadModal"
      title="서류 추가"
      :show-cancel-button="true"
      :show-confirm-button="true"
      cancel-text="취소"
      confirm-text="추가"
      @close="closeUploadModal"
      @cancel="closeUploadModal"
      @confirm="addDocument"
    >
      <div class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700"
            >서류 유형</label
          >
          <input
            :value="newDoc.name"
            type="text"
            readonly
            class="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600"
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
import { computed, ref } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import Modal from '@/components/common/Modal.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);
const notification = useNotificationStore();

// 서류 추가 모달 상태
const showUploadModal = ref(false);
const selectedDocument = ref(null);

// 새로운 서류 데이터
const newDoc = ref({
  name: '',
  issueDate: '',
  file: null,
});

// 필요한 서류 목록 (실제로는 item에서 가져오거나 별도로 정의)
const requiredDocuments = computed(() => [
  { name: '신분증사본', type: 'image' },
  { name: '소득증빙서류', type: 'document' },
  { name: '주소증빙서류', type: 'document' },
  { name: '사업계획서', type: 'document' },
  { name: '재무제표', type: 'document' },
]);

// 서류가 업로드되었는지 확인
const isDocumentUploaded = file => {
  // 실제로는 item.files에서 해당 서류가 있는지 확인
  return (
    props.item.files?.some(
      uploadedFile =>
        uploadedFile.name.includes(file.name) ||
        uploadedFile.name.includes(file.name.replace('사본', ''))
    ) || false
  );
};

// 모달 닫기
const closeModal = () => {
  emit('close');
};

// 서류 등록 모달 열기
const openUploadModal = file => {
  selectedDocument.value = file;
  newDoc.value.name = file.name;
  showUploadModal.value = true;
};

// 서류 등록 모달 닫기
const closeUploadModal = () => {
  showUploadModal.value = false;
  selectedDocument.value = null;
  newDoc.value = { name: '', issueDate: '', file: null };
};

// 파일 업로드 처리
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

// 서류 추가
const addDocument = () => {
  if (newDoc.value.name && newDoc.value.issueDate && newDoc.value.file) {
    // TODO: 실제 서류 추가 로직 구현
    console.log('서류 추가:', newDoc.value);

    // 폼 초기화 및 모달 닫기
    newDoc.value = { name: '', issueDate: '', file: null };
    showUploadModal.value = false;

    // 체크리스트 모달도 닫기
    emit('close');
  }
};
</script>
