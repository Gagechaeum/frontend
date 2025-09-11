<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="font-pretendard min-h-screen bg-white">
    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <div
          class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-yellow-400"
        ></div>
        <p class="text-gray-600">대출 정보를 불러오는 중...</p>
      </div>
    </div>

    <!-- 에러 상태 -->
    <div
      v-else-if="error"
      class="flex min-h-screen items-center justify-center"
    >
      <div class="text-center">
        <div class="mb-4 text-6xl text-red-500">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h2 class="mb-2 text-xl font-semibold text-gray-900">
          오류가 발생했습니다
        </h2>
        <p class="mb-4 text-gray-600">{{ error }}</p>
        <UiButton
          variant="primary"
          @click="() => fetchLoanDetail(route.params.id)"
        >
          다시 시도
        </UiButton>
      </div>
    </div>

    <!-- 정상 콘텐츠 -->
    <template v-else>
      <!-- 히어로 섹션 -->
      <HeroSection
        :title="loanData.productName"
        :description="
          loanData.description || '소상공인을 위한 맞춤형 대출입니다'
        "
        cta-text="바로 신청하기"
        :agency="loanData.companyName"
        product-type="loan"
      />

      <!-- 탭 네비게이션 -->
      <TabNavigation
        :tabs="tabs"
        :active-tab="activeTab"
        @update:active-tab="activeTab = $event"
      />

      <!-- 본문 콘텐츠 -->
      <main class="mx-auto max-w-7xl px-6 py-8">
        <!-- 주요내용 (통합) -->
        <div v-if="activeTab === 0" class="space-y-8">
          <!-- 상단: 주요내용 카드들 -->
          <div>
            <h3 class="mb-6 text-xl font-semibold text-gray-900">주요 정보</h3>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div
                class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div class="mb-3 flex items-center space-x-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100"
                  >
                    <i class="fas fa-building text-blue-600"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">금융회사</h4>
                    <p class="text-sm text-gray-600">
                      {{ loanData.companyName }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div class="mb-3 flex items-center space-x-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100"
                  >
                    <i class="fas fa-laptop text-green-600"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">가입방법</h4>
                    <p class="text-sm text-gray-600">{{ loanData.joinWay }}</p>
                  </div>
                </div>
              </div>
              <div
                class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div class="mb-3 flex items-center space-x-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100"
                  >
                    <i class="fas fa-calendar text-yellow-600"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">공시기간</h4>
                    <p class="text-sm text-gray-600">
                      {{ formatDate(loanData.beginDate) }} ~
                      {{ formatDate(loanData.endDate) }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div class="mb-3 flex items-center space-x-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100"
                  >
                    <i class="fas fa-won-sign text-purple-600"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">대출한도</h4>
                    <p class="text-sm text-gray-600">
                      {{ formatCurrency(loanData.minLimit) }} ~
                      {{ formatCurrency(loanData.maxLimit) }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div class="mb-3 flex items-center space-x-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100"
                  >
                    <i class="fas fa-percentage text-red-600"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">기본금리</h4>
                    <p class="text-sm text-gray-600">
                      연 {{ loanData.basicRate }}%
                    </p>
                  </div>
                </div>
              </div>
              <div
                class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div class="mb-3 flex items-center space-x-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
                  >
                    <i class="fas fa-external-link-alt text-gray-600"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">안내 페이지</h4>
                    <a
                      :href="loanData.productPageUrl"
                      target="_blank"
                      class="text-sm text-blue-600 hover:underline"
                      >바로가기</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 하단: 대출상세 정보 -->
          <div>
            <h3 class="mb-6 text-xl font-semibold text-gray-900">
              대출 상세 정보
            </h3>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div
                class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <h4 class="mb-3 font-semibold text-gray-900">대출 정보</h4>
                <ul class="space-y-2 text-gray-600">
                  <li>• 소상공인 전용 맞춤형 대출</li>
                  <li>• 신용도에 따른 차등 금리 적용</li>
                  <li>• 빠른 심사 및 대출 실행</li>
                  <li>• 온라인/방문 신청 가능</li>
                </ul>
              </div>
              <div
                class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <h4 class="font-semibold text-gray-900">필요서류</h4>
                    <div class="group relative">
                      <button
                        class="text-gray-400 transition-colors hover:text-gray-600"
                      >
                        <i class="fas fa-info-circle text-sm"></i>
                      </button>
                      <div
                        class="absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 transform rounded-lg bg-gray-900 px-3 py-2 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >
                        <div class="text-left leading-relaxed">
                          <div>
                            해당 대출 신청을 위해 필요한 서류 목록입니다.
                          </div>
                          <div class="mt-1 text-gray-300">
                            등록하지 않은 서류는 '등록하기' 버튼으로 바로
                            업로드할 수 있습니다.
                          </div>
                        </div>
                        <div
                          class="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <UiButton variant="ghost" size="sm" @click="goToDocs">
                    <template #leading>
                      <i class="fas fa-folder text-neutral-700"></i>
                    </template>
                    내 서류함
                  </UiButton>
                </div>
                <!-- 서류 등록 현황 -->
                <div class="mb-1 p-1">
                  <span class="text-sm font-medium text-gray-600"
                    >{{ uploadedDocumentsCount }}/{{
                      requiredDocuments.length
                    }}</span
                  >
                </div>

                <!-- 필요서류가 없을 때 -->
                <div
                  v-if="requiredDocuments.length === 0"
                  class="flex flex-col items-center justify-center py-12"
                >
                  <div class="mb-4 rounded-full bg-gray-100 p-4">
                    <i class="fas fa-file-alt text-2xl text-gray-400"></i>
                  </div>
                  <h4 class="mb-2 text-lg font-medium text-gray-900">
                    필요서류가 없습니다
                  </h4>
                  <p class="text-center text-sm text-gray-500">
                    이 대출 상품은 별도의 서류가 필요하지 않습니다.
                  </p>
                </div>

                <!-- 필요서류 목록 -->
                <div v-else class="space-y-3">
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
              </div>
            </div>
          </div>
        </div>

        <!-- 신청방법 -->
        <div v-if="activeTab === 1" class="space-y-6">
          <div
            class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <h3 class="mb-6 text-xl font-semibold text-gray-900">신청절차</h3>
            <div class="space-y-6">
              <div class="flex items-start">
                <div
                  class="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 font-semibold text-gray-900"
                >
                  1
                </div>
                <div class="flex-1">
                  <h4 class="mb-2 font-semibold text-gray-900">자격확인</h4>
                  <p class="mb-3 text-gray-600">대출 신청 자격을 확인합니다.</p>
                  <div class="rounded-lg bg-gray-50 p-3">
                    <p class="text-sm text-gray-600">
                      <strong>예상 소요시간:</strong> 1일
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex items-start">
                <div
                  class="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 font-semibold text-gray-900"
                >
                  2
                </div>
                <div class="flex-1">
                  <h4 class="mb-2 font-semibold text-gray-900">서류준비</h4>
                  <p class="mb-3 text-gray-600">
                    대출 신청에 필요한 서류를 준비합니다.
                  </p>
                  <div class="rounded-lg bg-gray-50 p-3">
                    <p class="text-sm text-gray-600">
                      <strong>예상 소요시간:</strong> 2-3일
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex items-start">
                <div
                  class="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 font-semibold text-gray-900"
                >
                  3
                </div>
                <div class="flex-1">
                  <h4 class="mb-2 font-semibold text-gray-900">온라인신청</h4>
                  <p class="mb-3 text-gray-600">
                    은행 홈페이지에서 온라인으로 신청합니다.
                  </p>
                  <div class="rounded-lg bg-gray-50 p-3">
                    <p class="text-sm text-gray-600">
                      <strong>예상 소요시간:</strong> 30분
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex items-start">
                <div
                  class="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 font-semibold text-gray-900"
                >
                  4
                </div>
                <div class="flex-1">
                  <h4 class="mb-2 font-semibold text-gray-900">심사</h4>
                  <p class="mb-3 text-gray-600">
                    제출된 서류를 바탕으로 대출 심사를 진행합니다.
                  </p>
                  <div class="rounded-lg bg-gray-50 p-3">
                    <p class="text-sm text-gray-600">
                      <strong>예상 소요시간:</strong> 3-5일
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex items-start">
                <div
                  class="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 font-semibold text-gray-900"
                >
                  5
                </div>
                <div class="flex-1">
                  <h4 class="mb-2 font-semibold text-gray-900">대출실행</h4>
                  <p class="mb-3 text-gray-600">
                    심사완료 후 대출금이 지급됩니다.
                  </p>
                  <div class="rounded-lg bg-gray-50 p-3">
                    <p class="text-sm text-gray-600">
                      <strong>예상 소요시간:</strong> 1-2일
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 커뮤니티 -->
        <div v-if="activeTab === 2" class="space-y-6">
          <Section title="커뮤니티" card>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <!-- 채팅방 정보 카드 -->
              <div
                class="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
              >
                <div class="mb-4 flex flex-col items-center space-y-3">
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"
                  >
                    <i class="fas fa-users text-blue-600"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">
                      {{ loanData.productName }} 채팅방
                    </h4>
                    <Tag label="대출" tone="blue" size="sm" />
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="text-sm text-gray-600">
                    <span class="font-medium">참여자:</span>
                    {{ communityStats.participants }}명
                  </div>
                  <div class="text-sm text-gray-600">
                    <span class="font-medium">주제:</span>
                    {{ loanData.productName }} 관련 채팅
                  </div>
                </div>
              </div>

              <!-- 입장하기 카드 -->
              <div
                class="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 shadow-sm"
              >
                <div class="text-center">
                  <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500"
                  >
                    <i class="fas fa-comments text-xl text-white"></i>
                  </div>
                  <h4 class="mb-2 font-semibold text-gray-900">
                    실시간 채팅 참여
                  </h4>
                  <p class="mb-4 text-sm text-gray-600">
                    다른 사용자들과 의견을 나누고 정보를 공유해보세요
                  </p>
                  <UiButton
                    variant="primary"
                    size="lg"
                    class="w-full"
                    @click="goToCommunity"
                  >
                    입장하기
                  </UiButton>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </main>

      <!-- 관련 대출 -->
      <Section title="관련 대출" class="mx-auto max-w-7xl px-6 py-8">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CardLg
            v-for="(service, index) in relatedLoans"
            :key="index"
            :title="service.title"
            badge="대출"
            badge-tone="gray"
            :details="[
              { label: '금리', value: service.rate },
              { label: '한도', value: service.limit },
            ]"
            action-label="자세히 보기"
            @action="() => console.log('관련 대출 클릭:', service.title)"
          />
        </div>
      </Section>

      <!-- 모바일 FAB -->
      <button
        class="fixed bottom-6 right-6 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-yellow-400 text-gray-900 shadow-lg hover:bg-yellow-500 md:hidden"
      >
        <i class="fas fa-plus"></i>
      </button>
    </template>
  </div>

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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/notification';
import { getLoanDetail } from '@/lib/api/products.js';
import {
  uploadUserDocument,
  getDocumentTypes,
  getDocumentChecklist,
} from '@/lib/api/documents.js';
import HeroSection from '@/components/detail/HeroSection.vue';
import TabNavigation from '@/components/detail/TabNavigation.vue';

import Section from '@/components/common/Section.vue';
import UiButton from '@/components/common/UiButton.vue';
import CardLg from '@/components/common/cards/CardLg.vue';
import Tag from '@/components/common/Tag.vue';
import Modal from '@/components/common/Modal.vue';

const route = useRoute();
const router = useRouter();
const notification = useNotificationStore();
const activeTab = ref(0);
const tabs = ['주요내용', '신청방법', '커뮤니티'];

// 대출 타입 결정 (현재는 대출으로 고정)
const productType = computed(() => 'loan');

// 대출 데이터 (API에서 가져올 데이터)
const loanData = ref({
  loanId: null,
  companyName: '',
  productName: '',
  joinWay: '',
  beginDate: '',
  endDate: '',
  productPageUrl: '',
  minLimit: 0,
  maxLimit: 0,
  basicRate: 0,
  description: '',
  image: '',
  modificationDate: '',
});

// 로딩 상태
const isLoading = ref(false);
const error = ref(null);

// 문의 정보 (computed로 변경하여 반응형으로 만들기)
const contactInfo = computed(() => ({
  name: loanData.value.companyName,
  address: '서울시 중구 을지로 66',
  hours: '평일 09:00 ~ 18:00',
}));

const contactChannels = [
  {
    icon: 'fas fa-phone',
    color: 'text-blue-600',
    text: '대출상담: 1588-0000',
  },
  {
    icon: 'fas fa-envelope',
    color: 'text-green-600',
    text: '이메일: loan@shinhan.com',
  },
  {
    icon: 'fas fa-comments',
    color: 'text-purple-600',
    text: '온라인 상담',
  },
  {
    icon: 'fas fa-map-marker-alt',
    color: 'text-orange-600',
    text: '지점 방문 상담',
  },
];

// 커뮤니티 통계
const communityStats = ref({
  participants: 127,
  todayMessages: 23,
  totalTopics: 45,
});

// 관련 대출
const relatedLoans = ref([
  {
    title: '소상공인 정책자금',
    rate: '연 2.5%~3.9%',
    limit: '최대 1억원',
    agency: '기술보증기금',
  },
  {
    title: '청년창업 지원대출',
    rate: '연 2.8%~4.5%',
    limit: '최대 2억원',
    agency: '중소벤처기업진흥공단',
  },
  {
    title: '기술보증기금 대출',
    rate: '연 3.2%~4.8%',
    limit: '최대 10억원',
    agency: '기술보증기금',
  },
  {
    title: '중소기업 운영자금 대출',
    rate: '연 3.5%~5.2%',
    limit: '최대 5억원',
    agency: '신한은행',
  },
]);

// 유틸리티 함수들
const formatDate = date => {
  if (!date) return '미정';
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR');
};

const formatCurrency = amount => {
  if (!amount) return '미정';
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};

// 채팅방 이동
const goToChat = () => {
  // CommunityView의 채팅방으로 이동
  router.push({
    path: '/community',
    query: {
      tab: 'chat',
      product: productType.value,
      productId: route.params.id,
      productName: loanData.value.productName,
    },
  });
};

// 빠른 문의 처리
const handleQuickQuestion = question => {
  // 빠른 문의를 채팅방으로 전달
  router.push({
    path: '/community',
    query: {
      tab: 'chat',
      product: productType.value,
      productId: route.params.id,
      productName: loanData.value.productName,
      question: question.question,
    },
  });
};

// 커뮤니티로 이동
const goToCommunity = () => {
  // CommunityView로 이동하면서 대출 정보를 전달
  router.push({
    path: '/community',
    query: {
      productType: 'loan',
      productId: route.params.id,
      productName: loanData.value.productName,
    },
  });
};

// 내 서류함으로 이동
const goToDocs = () => {
  router.push('/docs');
};

// 필요서류 데이터 (API에서 가져올 데이터)
const requiredDocuments = ref([]);
const checklistData = ref(null);

// 업로드된 서류 수 계산
const uploadedDocumentsCount = computed(() => {
  return requiredDocuments.value.filter(doc => doc.completed).length;
});

// 서류 업로드 모달 상태
const showUploadModal = ref(false);

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

// 서류 업로드 여부 확인
const isDocumentUploaded = file => {
  // API에서 받은 completed 상태를 사용
  return file.completed || false;
};

// 서류 업로드 모달 열기
const openUploadModal = async file => {
  showUploadModal.value = true;
  try {
    const res = await getDocumentTypes();
    documentTypes.value = (res && res.data && res.data.list) || [];

    // file.documentName과 일치하는 서류 유형 찾기
    const matchingType = documentTypes.value.find(
      type => type.name === file.documentName
    );

    if (matchingType) {
      // 일치하는 유형이 있으면 자동 선택
      newDoc.value.typeId = matchingType.id;
      newDoc.value.typeName = matchingType.name;
      newDoc.value.customName = '';
    } else {
      // 일치하는 유형이 없으면 초기화
      newDoc.value.typeId = '';
      newDoc.value.typeName = '';
      newDoc.value.customName = '';
    }
  } catch (e) {
    notification.show('error', '서류 유형을 불러오지 못했습니다.');
    // 에러 발생 시 초기화
    newDoc.value.typeId = '';
    newDoc.value.typeName = '';
    newDoc.value.customName = '';
  }
};

// 서류 업로드 모달 닫기
const closeUploadModal = () => {
  showUploadModal.value = false;
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
      // API를 통해 서류 업로드
      const formData = new FormData();
      // 백엔드 API 스펙에 맞게 필드명 수정
      formData.append('documentId', newDoc.value.typeId);
      formData.append('documentName', documentName);
      formData.append('issuedAt', newDoc.value.issueDate);
      formData.append('file', newDoc.value.file);

      const response = await uploadUserDocument(formData);

      if (response.success) {
        notification.show('success', '서류가 성공적으로 업로드되었습니다.');

        // 체크리스트 데이터 새로고침
        await loadChecklistData();

        // 폼 초기화 및 모달 닫기
        newDoc.value = {
          typeId: '',
          typeName: '',
          customName: '',
          issueDate: '',
          file: null,
        };
        showUploadModal.value = false;
      }
    } catch (error) {
      console.error('서류 업로드 실패:', error);
      notification.show('error', '서류 업로드에 실패했습니다.');
    }
  }
};

// 체크리스트 데이터 로드
const loadChecklistData = async () => {
  if (!route.params.id) return;

  try {
    const productId = route.params.id;
    const type = 'loan'; // 대출 페이지이므로 'loan'으로 고정

    const response = await getDocumentChecklist(productId, type);
    checklistData.value = response.data;
    requiredDocuments.value = response.data.documents || [];
  } catch (error) {
    console.error('체크리스트 데이터 로드 실패:', error);
    notification.show('error', '체크리스트를 불러오는데 실패했습니다.');
  }
};

// 대출 상세 정보 가져오기
const fetchLoanDetail = async loanId => {
  try {
    isLoading.value = true;
    error.value = null;

    const response = await getLoanDetail(loanId);

    // API 응답 데이터를 컴포넌트 데이터 구조에 맞게 변환
    loanData.value = {
      loanId: response.data.loanId,
      companyName: response.data.companyName,
      productName: response.data.productName,
      joinWay: response.data.joinWay,
      beginDate: response.data.beginDate,
      endDate: response.data.endDate,
      productPageUrl: response.data.productPageUrl,
      minLimit: response.data.minLimit,
      maxLimit: response.data.maxLimit,
      basicRate: response.data.basicRate,
      description:
        response.data.description || '소상공인을 위한 맞춤형 대출입니다',
      image:
        response.data.image ||
        'https://readdy.ai/api/search-image?query=modern%20business%20financial%20support%20illustration%20with%20small%20business%20owners%20receiving%20government%20assistance%20in%20clean%20minimalist%20style%20with%20yellow%20accent%20colors%20and%20professional%20atmosphere&width=600&height=400&seq=hero001&orientation=landscape',
      modificationDate: response.data.modificationDate,
    };
  } catch (err) {
    console.error('대출 정보 로드 실패:', err);
    error.value = err.message || '대출 정보를 불러오는데 실패했습니다.';
    notification.show('error', '대출 정보를 불러오는데 실패했습니다.');
  } finally {
    isLoading.value = false;
  }
};

// 컴포넌트 마운트 시 대출 ID에 따른 데이터 로드
onMounted(async () => {
  const productId = route.params.id;
  console.log('대출 ID:', productId, '타입:', productType.value);

  if (productId) {
    await fetchLoanDetail(productId);
    await loadChecklistData();
  } else {
    error.value = '대출 ID가 제공되지 않았습니다.';
    notification.show('error', '대출 ID가 제공되지 않았습니다.');
  }
});
</script>

<style scoped>
.font-pretendard {
  font-family:
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    Roboto,
    'Helvetica Neue',
    'Segoe UI',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'Malgun Gothic',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    sans-serif;
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

:root {
  --brand-primary: #ffcc33;
  --brand-deep: #1c1c1c;
  --brand-muted: #6b7280;
  --surface: #fff;
  --bg-soft: #f7f8fa;
  --line: #e5e7eb;
  --link: #0b5fff;
}
</style>
