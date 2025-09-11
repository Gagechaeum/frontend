<template>
  <div class="px-6 py-6">
    <div class="mb-6 grid grid-cols-2 gap-6">
      <!-- 내가 등록한 서류 -->
      <div class="rounded-2xl border border-[#e5e7eb] bg-white p-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            <i class="fas fa-file-alt mr-2 text-gray-400"></i>
            내가 등록한 서류
          </h3>
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
                        서류명을 클릭하면 다운로드 할 수 있습니다
                        <div
                          class="absolute left-3 top-full h-0 w-0 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"
                        ></div>
                      </div>
                    </div>
                  </div>
                </th>
                <th
                  class="w-1/5 px-2 py-3 text-left text-sm font-medium text-gray-600"
                >
                  서류 유형
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
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="myDocuments.length === 0"
                class="border-b border-gray-50"
              >
                <td
                  :colspan="isSelectionMode ? 5 : 4"
                  class="px-2 py-8 text-center"
                >
                  <div class="flex flex-col items-center gap-3">
                    <i class="fas fa-file-alt text-4xl text-gray-300"></i>
                    <div class="text-gray-500">
                      <p class="font-medium">등록된 서류가 없습니다</p>
                      <p class="text-sm">첫 번째 서류를 등록해보세요</p>
                    </div>
                    <button
                      class="inline-flex items-center rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8]"
                      @click="emit('showUploadModal')"
                    >
                      <i class="fas fa-plus mr-2"></i>
                      서류 추가하기
                    </button>
                  </div>
                </td>
              </tr>
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
                  {{ doc.type || '기타' }}
                </td>
                <td class="px-2 py-3 text-sm text-gray-600">
                  {{ doc.issueDate }}
                </td>
                <td class="px-2 py-3 text-sm text-gray-600">
                  D+{{ doc.daysSinceIssue }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 우측: 상품에 필요한 서류 -->
      <div class="rounded-2xl border border-[#e5e7eb] bg-white p-6">
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold text-gray-900">
              <i class="fas fa-star mr-2 text-gray-400"></i>
              즐겨찾기 상품에 필요한 서류
            </h3>
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
                내가 즐겨찾기한 대출/정책 상품에서 요구하는 서류 목록입니다
                <div
                  class="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"
                ></div>
              </div>
            </div>
          </div>
          <!-- 즐겨찾기 관리 버튼 -->
          <div class="flex items-center gap-2">
            <span
              class="cursor-pointer text-xs text-gray-500 hover:text-yellow-600"
              @click="showFavoritesModal = true"
            >
              즐겨찾기
              <span class="font-medium text-yellow-600">{{
                favoriteCount
              }}</span
              >개
            </span>
            <button
              class="inline-flex items-center rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-600 transition-colors hover:border-yellow-300 hover:bg-yellow-100"
              @click="goToFavorites"
            >
              <i class="fas fa-star mr-1.5"></i>
              즐겨찾기 관리
            </button>
          </div>
        </div>
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
                  필요한 상품수
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
                v-if="requiredDocuments.length === 0"
                class="border-b border-gray-50"
              >
                <td colspan="4" class="px-2 py-8 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <i class="fas fa-star text-4xl text-gray-300"></i>
                    <div class="text-gray-500">
                      <p class="font-medium">즐겨찾기한 상품이 없습니다</p>
                      <p class="text-sm">관심 있는 상품을 찾아보세요</p>
                    </div>
                    <button
                      class="inline-flex items-center rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-600"
                      @click="goToScheduleList"
                    >
                      <i class="fas fa-search mr-2"></i>
                      상품 살펴보기
                    </button>
                  </div>
                </td>
              </tr>
              <tr
                v-for="doc in requiredDocuments"
                :key="doc.id"
                class="border-b border-gray-50"
              >
                <td class="truncate px-2 py-3 text-sm text-gray-900">
                  {{ doc.name }}
                </td>
                <td class="px-2 py-3 text-sm text-gray-600">
                  <button
                    class="cursor-pointer hover:text-[#2563EB] hover:underline"
                    @click="openProductsModal(doc)"
                  >
                    {{ doc.count }}개
                  </button>
                </td>
                <td class="px-2 py-3">
                  <Tag :tone="getOwnedVariant(doc.owned)" size="sm">
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

    <!-- 상품 리스트 모달 -->
    <Modal
      :show="showProductsModal"
      :title="`${selectedRequiredDoc?.name}이(가) 필요한 상품`"
      subtitle="해당 서류를 요구하는 상품 목록입니다"
      :show-cancel-button="false"
      :show-confirm-button="false"
      @close="showProductsModal = false"
    >
      <div class="space-y-3">
        <div
          v-for="product in productsForSelectedDoc"
          :key="product.id"
          class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-white"
            >
              <i
                :class="
                  product.type === '정책' ? 'fas fa-gift' : 'fas fa-building'
                "
              ></i>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ product.name }}</p>
              <p class="text-sm text-gray-600">
                {{ product.type }} • {{ product.institution }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-[#2563EB]">
              {{ product.deadline }}
            </p>
            <p class="text-xs text-gray-500">
              {{ product.completedDocs }}/{{ product.totalDocs }} 서류
            </p>
          </div>
        </div>
      </div>
    </Modal>

    <!-- 즐겨찾기 상품 목록 모달 -->
    <Modal
      :show="showFavoritesModal"
      title="즐겨찾기한 상품"
      subtitle="내가 즐겨찾기한 상품 목록입니다"
      :show-cancel-button="false"
      :show-confirm-button="false"
      @close="showFavoritesModal = false"
    >
      <!-- 즐겨찾기 상품이 없을 때 -->
      <div
        v-if="favoriteProducts.length === 0"
        class="flex flex-col items-center justify-center py-12"
      >
        <div class="mb-4 rounded-full bg-gray-100 p-4">
          <i class="fas fa-star text-2xl text-gray-400"></i>
        </div>
        <h4 class="mb-2 text-lg font-medium text-gray-900">
          즐겨찾기한 상품이 없습니다
        </h4>
        <p class="mb-4 text-center text-sm text-gray-500">
          관심 있는 상품을 찾아서 즐겨찾기에 추가해보세요
        </p>
        <button
          class="inline-flex items-center rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-600"
          @click="goToScheduleList"
        >
          <i class="fas fa-search mr-2"></i>
          상품 살펴보기
        </button>
      </div>

      <!-- 즐겨찾기 상품 목록 -->
      <div v-else class="space-y-3">
        <div
          v-for="product in favoriteProducts"
          :key="product.id"
          class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-white"
            >
              <i
                :class="
                  product.type === '정책' ? 'fas fa-gift' : 'fas fa-building'
                "
              ></i>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ product.name }}</p>
              <p class="text-sm text-gray-600">
                {{ product.type }} • {{ product.institution }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <p class="text-sm font-medium text-[#2563EB]">
                {{ product.deadline }}
              </p>
              <p class="text-xs text-gray-500">
                {{ product.completedDocs }}/{{ product.totalDocs }} 서류
              </p>
            </div>
            <button
              class="text-yellow-500 transition-colors hover:text-red-500"
              @click="openRemoveFavoriteModal(product)"
            >
              <i class="fas fa-star text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/notification';
import { useDocsStore } from '@/stores/docs';
import {
  getUserDocuments,
  uploadUserDocument,
  downloadUserDocuments,
  deleteUserDocuments,
  getProductsByDocument,
} from '@/lib/api/documents.js';
import {
  getBookmarkDocuments,
  getBookmarkedProducts,
} from '@/lib/api/bookmarks.js';
import Tag from '@/components/common/Tag.vue';
import Modal from '@/components/common/Modal.vue';

const router = useRouter();
const docsStore = useDocsStore();

const props = defineProps({
  showUploadModal: {
    type: Boolean,
    default: false,
  },
  uploadModalData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['closeUploadModal', 'addDocument']);

// 체크리스트에서 전달된 데이터가 있을 때 서류명 자동 설정
watch(
  () => props.uploadModalData,
  newData => {
    if (newData && newData.document) {
      newDoc.value.name = newData.document.name;
    }
  },
  { immediate: true }
);

// 서류 추가 모달이 닫힐 때 폼 초기화
watch(
  () => props.showUploadModal,
  isOpen => {
    if (!isOpen) {
      newDoc.value = { name: '', type: '', issueDate: '', file: null };
    }
  }
);

const notification = useNotificationStore();
const showGuideModal = ref(false);
const selectedDoc = ref(null);

// 상품 리스트 모달 상태
const showProductsModal = ref(false);
const selectedRequiredDoc = ref(null);
const productsForSelectedDoc = ref([]);

// 즐겨찾기 관련 상태
const showFavoritesModal = ref(false);

// 즐겨찾기 상품 수
const favoriteCount = ref(0);

const newDoc = ref({
  name: '',
  type: '',
  issueDate: '',
  file: null,
});

// 실제 API에서 가져온 데이터
const myDocuments = ref([]);
const requiredDocuments = ref([]);
const favoriteProducts = ref([]);
const isLoading = ref(false);

const isSelectionMode = ref(false);
const selectedDocuments = ref([]);

// 일괄 처리 확인 모달 상태
const showConfirmModal = ref(false);
const confirmActionType = ref('download'); // 'download' | 'delete'

// API 호출 함수들
const fetchMyDocuments = async () => {
  try {
    isLoading.value = true;
    const response = await getUserDocuments();
    console.log('API 응답:', response); // 디버깅용 로그 추가
    // API 응답 데이터를 컴포넌트에서 사용하는 필드명으로 매핑
    myDocuments.value = (response.data || []).map(doc => ({
      id: doc.userDocumentId,
      name: doc.documentName,
      type: doc.type || '기타', // API에 type 필드가 없으므로 기본값 설정
      issueDate: doc.issuedAt,
      daysSinceIssue: doc.daysElapsed,
      fileKey: doc.fileKey,
    }));
    console.log('매핑된 데이터:', myDocuments.value); // 디버깅용 로그 추가
  } catch (error) {
    console.error('서류 목록 조회 실패:', error);
    notification.show('error', '서류 목록을 불러오는데 실패했습니다.');
  } finally {
    isLoading.value = false;
  }
};

const fetchRequiredDocuments = async () => {
  try {
    const response = await getBookmarkDocuments();
    console.log('즐겨찾기 서류 목록 API 응답:', response);

    // API 응답 데이터를 컴포넌트에서 사용하는 필드명으로 매핑
    if (response && response.documents) {
      requiredDocuments.value = response.documents.map(doc => ({
        id: doc.documentName, // 서류명을 ID로 사용
        name: doc.documentName,
        count: doc.productCount,
        owned: doc.possessionStatus,
        issuingUrl: doc.issuingUrl,
      }));
    } else {
      requiredDocuments.value = [];
    }
  } catch (error) {
    console.error('필요서류 목록 조회 실패:', error);
    notification.show('error', '필요서류 목록을 불러오는데 실패했습니다.');
  }
};

const fetchFavoriteCount = async () => {
  try {
    const response = await getBookmarkDocuments();
    console.log('즐겨찾기 상품 수 API 응답:', response);

    // totalBookmarkCount를 사용하여 즐겨찾기 상품 수 설정
    favoriteCount.value = response?.totalBookmarkCount || 0;
  } catch (error) {
    console.error('즐겨찾기 상품 수 조회 실패:', error);
    favoriteCount.value = 0;
  }
};

const fetchFavoriteProducts = async () => {
  try {
    const response = await getBookmarkedProducts();
    console.log('즐겨찾기 상품 목록 API 응답:', response);

    // API 응답 데이터를 컴포넌트에서 사용하는 필드명으로 매핑
    if (response && Array.isArray(response)) {
      favoriteProducts.value = response.map(product => ({
        id: product.name, // 상품명을 ID로 사용
        name: product.name,
        type: product.type === 'POLICY' ? '정책' : '대출',
        institution: product.organization,
        deadline: product.dDay ? `D-${product.dDay}` : '상시',
        completedDocs: product.prepared || 0,
        totalDocs: product.required || 0,
      }));
    } else {
      favoriteProducts.value = [];
    }
  } catch (error) {
    console.error('즐겨찾기 상품 목록 조회 실패:', error);
    favoriteProducts.value = [];
  }
};

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

const downloadSelectedDocuments = async () => {
  try {
    // 선택된 서류가 없는 경우
    if (selectedDocuments.value.length === 0) {
      notification.show('error', '다운로드할 파일이 없습니다.');
      return;
    }

    const response = await downloadUserDocuments(selectedDocuments.value);

    // Blob을 파일로 다운로드
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'documents.zip');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    notification.show(
      'success',
      `${selectedDocuments.value.length}개의 서류가 다운로드되었습니다.`
    );
    selectedDocuments.value = []; // 선택 해제
  } catch (error) {
    console.error('서류 다운로드 실패:', error);
    notification.show('error', '서류 다운로드에 실패했습니다.');
  }
};

const deleteSelectedDocuments = async () => {
  try {
    await deleteUserDocuments(selectedDocuments.value);

    // 삭제 성공 후 목록에서 제거
    myDocuments.value = myDocuments.value.filter(
      doc => !selectedDocuments.value.includes(doc.id)
    );

    const count = selectedDocuments.value.length;
    selectedDocuments.value = []; // 선택 해제
    notification.show('success', `${count}개의 서류가 삭제되었습니다.`);
  } catch (error) {
    console.error('서류 삭제 실패:', error);
    notification.show('error', '서류 삭제에 실패했습니다.');
  }
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

const addDocument = async () => {
  if (newDoc.value.name && newDoc.value.issueDate && newDoc.value.file) {
    try {
      const formData = new FormData();
      // 백엔드 API 스펙에 맞게 필드명 수정
      formData.append('documentId', Date.now());
      formData.append('documentName', newDoc.value.name);
      formData.append('issuedAt', newDoc.value.issueDate);
      formData.append('file', newDoc.value.file);

      await uploadUserDocument(formData);

      // 성공 후 목록 새로고침
      await fetchMyDocuments();

      // 폼 초기화
      newDoc.value = { name: '', type: '', issueDate: '', file: null };
      emit('closeUploadModal');
      notification.show('success', '서류가 성공적으로 추가되었습니다.');
    } catch (error) {
      console.error('서류 추가 실패:', error);
      notification.show('error', '서류 추가에 실패했습니다.');
    }
  }
};

const downloadDocument = async doc => {
  try {
    const response = await downloadUserDocuments([doc.id]);

    // 단일 다운로드: S3 URL을 받아서 직접 다운로드
    if (typeof response === 'string') {
      // S3 URL인 경우 직접 링크로 다운로드
      const link = document.createElement('a');
      link.href = response;
      link.setAttribute('download', `${doc.name}.pdf`);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      // Blob 데이터인 경우 (fallback)
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${doc.name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }

    notification.show('success', `'${doc.name}'이(가) 다운로드되었습니다.`);
  } catch (error) {
    console.error('서류 다운로드 실패:', error);
    notification.show('error', `'${doc.name}' 다운로드에 실패했습니다.`);
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

const goToFavorites = () => {
  router.push('/schedule/favorites');
};

const goToScheduleList = () => {
  router.push('/schedule/list');
};

const openProductsModal = async doc => {
  try {
    selectedRequiredDoc.value = doc;
    showProductsModal.value = true;

    // 서류명으로 documentId 찾기
    const documentId = docsStore.getDocumentIdByName(doc.name);
    if (!documentId) {
      console.error(
        '서류명에 해당하는 documentId를 찾을 수 없습니다:',
        doc.name
      );
      productsForSelectedDoc.value = [];
      return;
    }

    const response = await getProductsByDocument(documentId);
    console.log('서류별 상품 목록 API 응답:', response);

    // API 응답 데이터를 컴포넌트에서 사용하는 필드명으로 매핑
    if (response && response.data) {
      productsForSelectedDoc.value = response.data.map(product => ({
        id: product.name, // 상품명을 ID로 사용
        name: product.name,
        type: product.type === 'POLICY' ? '정책' : '대출',
        institution: product.organization,
        deadline: product.dDay ? `D-${product.dDay}` : '상시',
        completedDocs: product.prepared || 0,
        totalDocs: product.required || 0,
      }));
    } else {
      productsForSelectedDoc.value = [];
    }
  } catch (error) {
    console.error('서류별 상품 목록 조회 실패:', error);
    productsForSelectedDoc.value = [];
  }
};

const openRemoveFavoriteModal = product => {
  // 바로 제거하고 토스트 표시
  removeFromFavorites(product);
};

const removeFromFavorites = product => {
  if (product) {
    // 실제로는 API 호출로 즐겨찾기 제거
    // 여기서는 간단히 favoriteCount만 감소
    favoriteCount.value = Math.max(0, favoriteCount.value - 1);
    notification.show(
      'success',
      `'${product.name}'이(가)\n즐겨찾기에서 제거되었습니다.`
    );
  }
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  // document types가 아직 로드되지 않았다면 로드
  if (docsStore.documentTypes.length === 0) {
    await docsStore.loadDocumentTypes();
  }

  await fetchMyDocuments();
  await fetchRequiredDocuments();
  await fetchFavoriteCount();
  await fetchFavoriteProducts();
});
</script>
