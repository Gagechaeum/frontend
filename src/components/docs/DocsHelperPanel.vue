<template>
  <div class="px-6 py-6">
    <div class="mb-6 grid grid-cols-2 gap-6">
      <!-- 좌측: 내가 등록한 서류 -->
      <div class="rounded-2xl border border-[#e5e7eb] bg-white p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">내가 등록한 서류</h3>
          <div class="flex items-center gap-2">
            <!-- 선택 모드일 때 일괄 처리 버튼들 -->
            <div v-if="isSelectionMode" class="flex items-center gap-2">
              <button
                :disabled="selectedDocuments.length === 0"
                class="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                @click="openConfirmModal('download')"
              >
                <i class="fas fa-download mr-1.5"></i>
                다운로드 ({{ selectedDocuments.length }})
              </button>
              <button
                :disabled="selectedDocuments.length === 0"
                class="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                @click="openConfirmModal('delete')"
              >
                <i class="fas fa-trash mr-1.5"></i>
                삭제 ({{ selectedDocuments.length }})
              </button>
            </div>
            <button
              :class="{
                'border-blue-200 bg-blue-50 text-[#2563EB] hover:border-blue-300 hover:bg-blue-100':
                  !isSelectionMode,
                'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100':
                  isSelectionMode,
              }"
              class="inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
              @click="toggleSelectionMode"
            >
              <i
                :class="
                  isSelectionMode ? 'fas fa-times' : 'fas fa-check-square'
                "
                class="mr-1.5"
              ></i>
              {{ isSelectionMode ? '선택 취소' : '서류 선택' }}
            </button>
          </div>
        </div>
        <div class="w-full overflow-visible">
          <table class="w-full table-fixed">
            <thead>
              <tr class="border-b border-gray-100">
                <!-- 체크박스 컬럼 추가 -->
                <th
                  v-if="isSelectionMode"
                  class="w-12 px-2 py-3 text-left text-sm font-medium text-gray-600"
                >
                  <label class="flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      :checked="isAllSelected"
                      class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#2563EB] focus:ring-2 focus:ring-[#2563EB]"
                      @change="toggleSelectAll"
                    />
                  </label>
                </th>
                <th
                  class="w-2/5 px-2 py-3 text-left text-sm font-medium text-gray-600"
                >
                  <div class="flex items-center gap-2">
                    <span>서류</span>
                    <!-- 툴팁 아이콘 -->
                    <div class="group relative">
                      <svg
                        class="h-4 w-4 cursor-help text-gray-400 hover:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <!-- 툴팁 -->
                      <div
                        class="pointer-events-none absolute bottom-full left-0 z-50 mb-2 whitespace-nowrap rounded-lg bg-gray-800 px-3 py-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        서류명을 클릭 시 다운로드 할 수 있습니다
                        <div
                          class="absolute left-3 top-full h-0 w-0 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"
                        ></div>
                      </div>
                    </div>
                  </div>
                </th>
                <th
                  class="w-1/4 px-2 py-3 text-left text-sm font-medium text-gray-600"
                >
                  발급일
                </th>
                <th
                  class="w-1/5 px-2 py-3 text-left text-sm font-medium text-gray-600"
                >
                  경과일
                </th>
                <th
                  class="w-1/6 px-2 py-3 text-left text-sm font-medium text-gray-600"
                >
                  <div class="flex items-center gap-2">
                    <span>알림</span>
                    <!-- 툴팁 아이콘 -->
                    <div class="group relative">
                      <svg
                        class="h-4 w-4 cursor-help text-gray-400 hover:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <!-- 툴팁 -->
                      <div
                        class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-lg bg-gray-800 px-3 py-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        발급일로부터 1개월 혹은 3개월 경과 시 알려드립니다
                        <div
                          class="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"
                        ></div>
                      </div>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="doc in myDocuments"
                :key="doc.id"
                class="border-b border-gray-50"
              >
                <!-- 체크박스 컬럼 -->
                <td v-if="isSelectionMode" class="px-2 py-3">
                  <label class="flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      :checked="selectedDocuments.includes(doc.id)"
                      class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#2563EB] focus:ring-2 focus:ring-[#2563EB]"
                      @change="toggleDocumentSelection(doc.id)"
                    />
                  </label>
                </td>
                <td class="px-2 py-3 text-sm text-gray-900">
                  <button
                    class="block w-full cursor-pointer truncate text-left hover:text-[#2563EB] hover:underline"
                    @click="downloadDocument(doc)"
                  >
                    {{ doc.name }}
                  </button>
                </td>
                <td class="px-2 py-3 text-sm text-gray-600">
                  {{ doc.issueDate }}
                </td>
                <td class="px-2 py-3 text-sm text-gray-600">
                  {{ doc.daysSinceIssue }}
                </td>
                <td class="px-2 py-3">
                  <div class="flex items-center gap-2">
                    <label
                      class="relative inline-flex cursor-pointer items-center"
                    >
                      <input
                        v-model="doc.notification"
                        type="checkbox"
                        class="sr-only"
                      />
                      <div
                        :class="
                          doc.notification ? 'bg-[#2563EB]' : 'bg-gray-200'
                        "
                        class="relative h-6 w-11 rounded-full transition-colors"
                      >
                        <div
                          :class="
                            doc.notification ? 'translate-x-6' : 'translate-x-1'
                          "
                          class="absolute left-0 top-1 h-4 w-4 rounded-full bg-white transition-transform"
                        ></div>
                      </div>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 우측: 상품에 필요한 서류 -->
      <div class="rounded-2xl border border-[#e5e7eb] bg-white p-6">
        <h3 class="mb-4 text-lg font-semibold text-gray-900">
          상품에 필요한 서류
        </h3>
        <div class="w-full overflow-hidden">
          <table class="w-full table-fixed">
            <thead>
              <tr class="border-b border-gray-100">
                <th
                  class="w-2/5 px-2 py-3 text-left text-sm font-medium text-gray-600"
                >
                  서류명
                </th>
                <th
                  class="w-1/4 px-2 py-3 text-left text-sm font-medium text-gray-600"
                >
                  요구 건수
                </th>
                <th
                  class="w-1/5 px-2 py-3 text-left text-sm font-medium text-gray-600"
                >
                  내 보유
                </th>
                <td
                  class="w-1/5 px-2 py-3 text-left text-sm font-medium text-gray-600"
                >
                  발급 안내
                </td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="doc in requiredDocuments"
                :key="doc.id"
                class="border-b border-gray-50"
              >
                <td class="truncate px-2 py-3 text-sm text-gray-900">
                  {{ doc.name }}
                </td>
                <td class="px-2 py-3 text-sm text-gray-600">
                  {{ doc.count }}건
                </td>
                <td class="px-2 py-3">
                  <Tag :variant="getOwnedVariant(doc.owned)" size="sm">
                    {{ doc.owned }}
                  </Tag>
                </td>
                <td class="px-2 py-3">
                  <button
                    class="cursor-pointer text-sm text-[#2563EB] hover:underline"
                    @click="
                      showGuideModal = true;
                      selectedDoc = doc;
                    "
                  >
                    발급 안내
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 서류 추가 모달 -->
    <div
      v-if="props.showUploadModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="mx-4 w-full max-w-md rounded-2xl bg-white p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">서류 추가</h3>
          <button
            class="text-gray-400 hover:text-gray-600"
            @click="emit('closeUploadModal')"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="addDocument">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700"
              >서류명</label
            >
            <input
              v-model="newDoc.name"
              type="text"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
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
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700"
              >서류 파일</label
            >
            <input
              type="file"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              @change="handleFileUpload"
            />
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              @click="emit('closeUploadModal')"
            >
              취소
            </button>
            <button
              type="submit"
              class="flex-1 rounded-lg bg-[#2563EB] px-4 py-2 text-white transition-colors hover:bg-[#1d4ed8]"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 발급 안내 모달 -->
    <div
      v-if="showGuideModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="mx-4 w-full max-w-md rounded-2xl bg-white p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ selectedDoc?.name }} 발급 안내
          </h3>
          <button
            class="text-gray-400 hover:text-gray-600"
            @click="showGuideModal = false"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 class="mb-2 font-medium text-blue-900">발급 방법</h4>
            <p class="text-sm text-blue-800">
              {{ getDocumentGuide(selectedDoc?.name) }}
            </p>
          </div>

          <div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h4 class="mb-2 font-medium text-yellow-900">주의사항</h4>
            <ul class="space-y-1 text-sm text-yellow-800">
              <li>• 발급일로부터 3개월 이내 서류만 유효합니다</li>
              <li>• 일부 상품은 1개월 이내 서류를 요구할 수 있습니다</li>
              <li>• 서류 유효기간을 확인하여 신청하세요</li>
            </ul>
          </div>

          <button
            class="w-full rounded-lg bg-[#2563EB] px-4 py-2 text-white transition-colors hover:bg-[#1d4ed8]"
            @click="showGuideModal = false"
          >
            확인
          </button>
        </div>
      </div>
    </div>

    <!-- 일괄 처리 확인 모달 -->
    <Modal
      :show="showConfirmModal"
      :title="confirmActionType === 'delete' ? '삭제 확인' : '다운로드 확인'"
      :subtitle="
        confirmActionType === 'delete'
          ? '선택한 서류가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.'
          : '선택한 서류를 다운로드합니다.'
      "
      cancel-text="취소"
      :confirm-text="confirmActionType === 'delete' ? '삭제' : '다운로드'"
      @close="showConfirmModal = false"
      @cancel="showConfirmModal = false"
      @confirm="handleConfirmAction"
    >
      <p class="text-sm text-gray-700">
        선택된 서류:
        <span class="font-medium">{{ selectedDocuments.length }}</span
        >건
      </p>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import Tag from '@/components/common/Tag.vue';
import Modal from '@/components/common/Modal.vue';

const props = defineProps({
  showUploadModal: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['closeUploadModal', 'addDocument']);

const notification = useNotificationStore();
const showGuideModal = ref(false);
const selectedDoc = ref(null);

const newDoc = ref({
  name: '',
  issueDate: '',
  file: null,
});

const myDocuments = ref([
  {
    id: 1,
    name: '주민등록등본',
    issueDate: '2024-01-15',
    daysSinceIssue: 'D+45',
    notification: true,
    file: null,
  },
  {
    id: 2,
    name: '소득금액증명원',
    issueDate: '2024-02-01',
    daysSinceIssue: 'D+12',
    notification: true,
    file: null,
  },
  {
    id: 3,
    name: '건강보험료 납부확인서',
    issueDate: '2024-03-01',
    daysSinceIssue: 'D+5',
    notification: false,
    file: null,
  },
  {
    id: 4,
    name: '재직증명서',
    issueDate: '2024-01-20',
    daysSinceIssue: 'D+40',
    notification: true,
    file: null,
  },
]);

const requiredDocuments = ref([
  { id: 1, name: '주민등록등본', count: 3, owned: '보유' },
  { id: 2, name: '소득금액증명원', count: 2, owned: '만료' },
  { id: 3, name: '재직증명서', count: 1, owned: '미보유' },
  { id: 4, name: '건강보험료 납부확인서', count: 2, owned: '보유' },
]);

const isSelectionMode = ref(false);
const selectedDocuments = ref([]);

// 일괄 처리 확인 모달 상태
const showConfirmModal = ref(false);
const confirmActionType = ref('download'); // 'download' | 'delete'

const openConfirmModal = type => {
  if (selectedDocuments.value.length === 0) return;
  confirmActionType.value = type;
  showConfirmModal.value = true;
};

const handleConfirmAction = () => {
  showConfirmModal.value = false;
  if (confirmActionType.value === 'delete') {
    deleteSelectedDocuments();
  } else {
    downloadSelectedDocuments();
  }
};

const toggleSelectionMode = () => {
  isSelectionMode.value = !isSelectionMode.value;
  selectedDocuments.value = [];
};

const toggleSelectAll = event => {
  if (event.target.checked) {
    // 전체 선택
    selectedDocuments.value = myDocuments.value.map(doc => doc.id);
  } else {
    // 전체 해제
    selectedDocuments.value = [];
  }
};

const toggleDocumentSelection = docId => {
  const index = selectedDocuments.value.indexOf(docId);
  if (index > -1) {
    selectedDocuments.value.splice(index, 1);
  } else {
    selectedDocuments.value.push(docId);
  }
};

const isAllSelected = computed(() => {
  return (
    myDocuments.value.length > 0 &&
    selectedDocuments.value.length === myDocuments.value.length
  );
});

const downloadSelectedDocuments = () => {
  let successCount = 0;
  let errorCount = 0;

  selectedDocuments.value.forEach(docId => {
    const doc = myDocuments.value.find(d => d.id === docId);
    if (doc && doc.file) {
      const url = URL.createObjectURL(doc.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      successCount++;
    } else {
      errorCount++;
    }
  });

  if (successCount > 0) {
    notification.show(
      'success',
      `${successCount}개의 서류가 다운로드되었습니다.`
    );
  }
  if (errorCount > 0) {
    notification.show('error', `${errorCount}개의 서류에 파일이 없습니다.`);
  }

  selectedDocuments.value = []; // 선택 해제
};

const deleteSelectedDocuments = () => {
  const count = selectedDocuments.value.length;
  myDocuments.value = myDocuments.value.filter(
    doc => !selectedDocuments.value.includes(doc.id)
  );
  selectedDocuments.value = []; // 선택 해제
  notification.show('success', `${count}개의 서류가 삭제되었습니다.`);
};

const getOwnedVariant = owned => {
  if (owned === '보유') return 'green';
  if (owned === '만료') return 'yellow';
  if (owned === '미보유') return 'red';
  return 'gray';
};

const handleFileUpload = event => {
  newDoc.value.file = event.target.files[0];
};

const addDocument = () => {
  if (newDoc.value.name && newDoc.value.issueDate && newDoc.value.file) {
    const newId = Math.max(...myDocuments.value.map(doc => doc.id)) + 1;
    const issueDate = new Date(newDoc.value.issueDate);
    const today = new Date();
    const diffTime = Math.abs(today - issueDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    myDocuments.value.push({
      id: newId,
      name: newDoc.value.name,
      issueDate: newDoc.value.issueDate,
      daysSinceIssue: `D+${diffDays}`,
      notification: true,
      file: newDoc.value.file,
    });

    // 폼 초기화
    newDoc.value = { name: '', issueDate: '', file: null };
    emit('closeUploadModal');
    emit('addDocument', {
      id: newId,
      name: newDoc.value.name,
      issueDate: newDoc.value.issueDate,
      daysSinceIssue: `D+${diffDays}`,
      notification: true,
      file: newDoc.value.file,
    });
  }
};

const downloadDocument = doc => {
  if (doc.file) {
    const url = URL.createObjectURL(doc.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name; // 파일 이름 설정
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notification.show('success', `'${doc.name}'이(가) 다운로드되었습니다.`);
  } else {
    notification.show('error', `'${doc.name}'에 파일이 없습니다.`);
  }
};

const getDocumentGuide = docName => {
  const guides = {
    주민등록등본:
      '주민센터 또는 인터넷 주민센터에서 발급 가능합니다. 신분증을 지참하세요.',
    소득금액증명원:
      '국세청 홈택스에서 발급 가능합니다. 공동인증서 또는 휴대폰 인증이 필요합니다.',
    재직증명서: '소속 회사 인사팀에 요청하여 발급받을 수 있습니다.',
    '건강보험료 납부확인서':
      '건강보험공단 홈페이지에서 발급 가능합니다. 공동인증서 인증이 필요합니다.',
  };
  return guides[docName] || '해당 서류의 발급 방법을 확인해주세요.';
};
</script>
