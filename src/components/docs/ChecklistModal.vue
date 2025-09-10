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
        <h4 class="font-medium text-gray-900">
          {{ checklistData?.itemName || item.name }}
        </h4>
        <p class="text-sm text-gray-600">
          {{ checklistData?.organization || item.institution }}
        </p>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="flex items-center justify-center py-8">
        <div class="text-sm text-gray-500">체크리스트를 불러오는 중...</div>
      </div>

      <!-- 체크리스트 목록 -->
      <div v-else class="space-y-3">
        <!-- 필요 서류가 없는 경우 -->
        <div v-if="requiredDocuments.length === 0" class="py-8 text-center">
          <div class="text-sm text-gray-500">필요 서류가 없습니다</div>
        </div>

        <!-- 필요 서류 목록 -->
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
              file.documentName
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
          <select
            v-model="newDoc.typeId"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563EB]"
            @change="handleTypeChange"
          >
            <option value="" disabled>유형을 선택하세요</option>
            <option v-for="t in documentTypes" :key="t.id" :value="t.id">
              {{ t.name }}
            </option>
          </select>
        </div>

        <div v-if="isOtherType" class="mt-2">
          <label class="mb-2 block text-sm font-medium text-gray-700"
            >기타 서류명</label
          >
          <input
            v-model="newDoc.customName"
            type="text"
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
            :max="new Date().toISOString().split('T')[0]"
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
import { computed, ref, onMounted, watch } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import {
  uploadUserDocument,
  getDocumentTypes,
  getDocumentChecklist,
} from '@/lib/api/documents.js';
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

// 체크리스트 데이터
const checklistData = ref(null);
const isLoading = ref(false);

// 새로운 서류 데이터
const newDoc = ref({
  typeId: '',
  typeName: '',
  customName: '',
  issueDate: '',
  file: null,
});

const documentTypes = ref([]);
const isOtherType = computed(() => {
  const sel = documentTypes.value.find(t => t.id === newDoc.value.typeId);
  return sel ? sel.name === '기타' : false;
});

const handleTypeChange = () => {
  const sel = documentTypes.value.find(t => t.id === newDoc.value.typeId);
  newDoc.value.typeName = sel ? sel.name : '';
};

// 필요한 서류 목록 (API에서 가져온 데이터)
const requiredDocuments = computed(() => {
  return checklistData.value?.documents || [];
});

// 서류가 업로드되었는지 확인
const isDocumentUploaded = file => {
  // API에서 받은 completed 상태를 사용
  return file.completed || false;
};

// 체크리스트 데이터 로드
const loadChecklistData = async () => {
  if (!props.item || !props.isOpen) return;

  try {
    isLoading.value = true;

    // item에서 productId와 type 추출
    let productId = props.item.originalId || props.item.id;
    let type =
      props.item.originalType ||
      (props.item.type === '정책' ? 'policy' : 'loan');

    // id가 'policy_2' 형태인 경우 숫자 부분만 추출
    if (typeof productId === 'string' && productId.includes('_')) {
      const parts = productId.split('_');
      productId = parts[1]; // 숫자 부분만 추출
      type = parts[0]; // 'policy' 또는 'loan'
    }

    // TODO: 추후 policyId 또는 loanId로 변경
    const response = await getDocumentChecklist(productId, type);
    checklistData.value = response.data;
  } catch (error) {
    console.error('체크리스트 데이터 로드 실패:', error);
    notification.show('error', '체크리스트를 불러오는데 실패했습니다.');
  } finally {
    isLoading.value = false;
  }
};

// 모달이 열릴 때마다 데이터 로드
watch(
  [() => props.isOpen, () => props.item],
  ([isOpen, item]) => {
    if (isOpen && item) {
      loadChecklistData();
    }
  },
  { immediate: true }
);

// 모달 닫기
const closeModal = () => {
  emit('close');
};

// 서류 등록 모달 열기
const openUploadModal = async file => {
  selectedDocument.value = file;
  showUploadModal.value = true;
  try {
    const res = await getDocumentTypes();
    documentTypes.value = (res && res.data && res.data.list) || [];
  } catch (e) {
    notification.show('error', '서류 유형을 불러오지 못했습니다.');
  }
  // 초기화
  newDoc.value.typeId = '';
  newDoc.value.typeName = '';
  newDoc.value.customName = '';
};

// 서류 등록 모달 닫기
const closeUploadModal = () => {
  showUploadModal.value = false;
  selectedDocument.value = null;
  newDoc.value = {
    typeId: '',
    typeName: '',
    customName: '',
    issueDate: '',
    file: null,
  };
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
const addDocument = async () => {
  const selected = documentTypes.value.find(t => t.id === newDoc.value.typeId);
  const documentName =
    selected && selected.name === '기타'
      ? newDoc.value.customName
      : selected
        ? selected.name
        : '';
  if (
    newDoc.value.typeId &&
    documentName &&
    newDoc.value.issueDate &&
    newDoc.value.file
  ) {
    try {
      const formData = new FormData();
      formData.append('documentId', newDoc.value.typeId);
      formData.append('documentName', documentName);
      formData.append('issuedAt', newDoc.value.issueDate);
      formData.append('file', newDoc.value.file);

      await uploadUserDocument(formData);

      notification.show('success', '서류가 성공적으로 추가되었습니다.');

      // 폼 초기화 및 모달 닫기
      newDoc.value = {
        typeId: '',
        typeName: '',
        customName: '',
        issueDate: '',
        file: null,
      };
      showUploadModal.value = false;

      // 체크리스트 데이터 새로고침
      await loadChecklistData();

      // 업로드 모달만 닫기 (체크리스트 모달은 유지)
      showUploadModal.value = false;
    } catch (error) {
      console.error('서류 추가 실패:', error);
      notification.show('error', '서류 추가에 실패했습니다.');
    }
  }
};
</script>
