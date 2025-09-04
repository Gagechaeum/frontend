<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="font-pretendard min-h-screen bg-white">
    <!-- 히어로 섹션 -->
    <HeroSection
      :title="policyData.policy_name"
      :description="policyData.policy_summary"
      cta-text="바로 신청하기"
      :agency="policyData.supervising_organization_name"
      :image="
        policyData.image ||
        'https://readdy.ai/api/search-image?query=government%20policy%20support%20illustration%20with%20official%20documents%20and%20business%20people%20in%20clean%20minimalist%20style%20with%20green%20accent%20colors%20and%20professional%20atmosphere&width=600&height=400&seq=policy001&orientation=landscape'
      "
      :image-alt="`${policyData.policy_name} 이미지`"
      product-type="policy"
    />

    <!-- 탭 네비게이션 -->
    <TabNavigation
      :tabs="tabs"
      :active-tab="activeTab"
      @update:active-tab="activeTab = $event"
    />

    <!-- 본문 콘텐츠 -->
    <main class="mx-auto max-w-7xl px-6 py-8">
      <!-- 주요내용 -->
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
                  <h4 class="font-semibold text-gray-900">주관기관</h4>
                  <p class="text-sm text-gray-600">
                    {{ policyData.supervising_organization_name }}
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
                  <i class="fas fa-handshake text-green-600"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">접수기관</h4>
                  <p class="text-sm text-gray-600">
                    {{
                      policyData.receiving_organization_name ||
                      policyData.supervising_organization_name
                    }}
                  </p>
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
                  <h4 class="font-semibold text-gray-900">신청기간</h4>
                  <p class="text-sm text-gray-600">
                    {{ policyData.application_period }}
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
                  <i class="fas fa-tags text-purple-600"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">정책분야</h4>
                  <p class="text-sm text-gray-600">
                    {{ policyData.policy_field }}
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
                  <i class="fas fa-phone text-red-600"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">문의 연락처</h4>
                  <p class="whitespace-pre-line text-sm text-gray-600">
                    {{ policyData.contact }}
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
                    :href="policyData.announcement_url"
                    target="_blank"
                    class="text-sm text-blue-600 hover:underline"
                    >바로가기</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 하단: 정책상세 정보 -->
        <div>
          <h3 class="mb-6 text-xl font-semibold text-gray-900">
            정책 상세 정보
          </h3>
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- 좌측: 지원내용 + 선정기준 -->
            <div class="space-y-6">
              <!-- 지원내용 -->
              <div
                class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <h4 class="mb-3 font-semibold text-gray-900">지원내용</h4>
                <ul class="space-y-2 text-gray-600">
                  <li>• 보증료의 90% 지원 (연간 최대 200만원)</li>
                  <li>• 신용보증료 및 기술보증료 지원</li>
                  <li>• 분기별 지급</li>
                  <li>• 보증기관에서 직접 차감하여 지급</li>
                </ul>
              </div>

              <!-- 선정기준 -->
              <div
                class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <h4 class="mb-3 font-semibold text-gray-900">선정기준</h4>
                <ul class="space-y-2 text-gray-600">
                  <li>• 소상공인 (상시근로자 5인 미만)</li>
                  <li>• 사업개시일로부터 3개월 이상</li>
                  <li>• 세금 체납이 없는 사업자</li>
                  <li>• 신용등급 BB- 이상</li>
                </ul>
              </div>
            </div>

            <!-- 우측: 필요서류 -->
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
                        <div>해당 정책 신청을 위해 필요한 서류 목록입니다.</div>
                        <div class="mt-1 text-gray-300">
                          등록하지 않은 서류는 '등록하기' 버튼으로 바로 업로드할
                          수 있습니다.
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
            </div>
          </div>
        </div>
      </div>

      <!-- 신청방법 -->
      <div v-if="activeTab === 1" class="space-y-6">
        <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
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
                <p class="mb-3 text-gray-600">지원대상 자격을 확인합니다.</p>
                <div class="rounded-lg bg-gray-50 p-3">
                  <p class="text-sm text-gray-600">
                    <strong>예상 소요시간:</strong> 1-2일
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
                  정책 신청에 필요한 서류를 준비합니다.
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
                3
              </div>
              <div class="flex-1">
                <h4 class="mb-2 font-semibold text-gray-900">온라인신청</h4>
                <p class="mb-3 text-gray-600">
                  {{ policyData.receiving_organization_name }} 홈페이지에서
                  온라인으로 신청합니다.
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
                <h4 class="mb-2 font-semibold text-gray-900">서류검토</h4>
                <p class="mb-3 text-gray-600">
                  제출된 서류를 검토하고 보완이 필요한 경우 요청합니다.
                </p>
                <div class="rounded-lg bg-gray-50 p-3">
                  <p class="text-sm text-gray-600">
                    <strong>예상 소요시간:</strong> 5-7일
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
                <h4 class="mb-2 font-semibold text-gray-900">심사결정</h4>
                <p class="mb-3 text-gray-600">
                  최종 심사 후 선정결과를 통보하고 지원금 지급을 안내합니다.
                </p>
                <div class="rounded-lg bg-gray-50 p-3">
                  <p class="text-sm text-gray-600">
                    <strong>예상 소요시간:</strong> 7-10일
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
                  class="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100"
                >
                  <i class="fas fa-users text-yellow-600"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">
                    {{ policyData.policy_name }} 채팅방
                  </h4>
                  <Tag label="정책" tone="yellow" size="sm" />
                </div>
              </div>
              <div class="space-y-2">
                <div class="text-sm text-gray-600">
                  <span class="font-medium">참여자:</span>
                  {{ communityStats.participants }}명
                </div>
                <div class="text-sm text-gray-600">
                  <span class="font-medium">주제:</span>
                  {{ policyData.policy_name }} 관련 채팅
                </div>
              </div>
            </div>

            <!-- 입장하기 카드 -->
            <div
              class="rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-100 p-6 shadow-sm"
            >
              <div class="text-center">
                <div
                  class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500"
                >
                  <i class="fas fa-comments text-xl text-white"></i>
                </div>
                <h4 class="mb-2 font-semibold text-gray-900">
                  실시간 채팅 참여
                </h4>
                <p class="mb-4 text-sm text-gray-600">
                  다른 사용자들과 의견을 나누고 정보를 공유해보세요
                </p>
                <button
                  class="w-full rounded-2xl bg-yellow-500 px-6 py-3 font-medium text-white transition-colors hover:bg-yellow-600"
                  @click="goToCommunity"
                >
                  입장하기
                </button>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </main>

    <!-- 관련 정책 -->
    <Section title="관련 정책" class="mx-auto max-w-7xl px-6 py-8">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CardLg
          v-for="(policy, index) in relatedPolicies"
          :key="index"
          :title="policy.title"
          badge="정책"
          badge-tone="gray"
          :details="[
            { label: '필요서류', value: policy.documents },
            { label: '마감', value: policy.deadline, tone: 'danger' },
          ]"
          action-label="자세히 보기"
          @action="() => console.log('관련 정책 클릭:', policy.title)"
        />
      </div>
    </Section>

    <!-- 모바일 FAB -->
    <button
      class="fixed bottom-6 right-6 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-green-400 text-white shadow-lg hover:bg-green-500 md:hidden"
    >
      <i class="fas fa-plus"></i>
    </button>
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeroSection from '@/components/detail/HeroSection.vue';
import TabNavigation from '@/components/detail/TabNavigation.vue';

import Section from '@/components/common/Section.vue';
import UiButton from '@/components/common/UiButton.vue';
import CardLg from '@/components/common/cards/CardLg.vue';
import Tag from '@/components/common/Tag.vue';
import Modal from '@/components/common/Modal.vue';

const route = useRoute();
const router = useRouter();
const activeTab = ref(0);
const tabs = ['주요내용', '신청방법', '커뮤니티'];

// 정책 타입 결정 (현재는 정책으로 고정)
const productType = computed(() => 'policy');

// 임시 정책 데이터 (ERD policies 테이블 구조에 맞춤)
const policyData = ref({
  policy_id: 'POL001',
  policy_name: '소상공인 보증료 지원사업',
  policy_summary:
    '소상공인의 자금조달 부담을 덜어드리기 위해 신용보증기관 보증료의 일부를 지원합니다. 이를 통해 소상공인이 더욱 안정적으로 사업을 운영할 수 있도록 돕습니다.',
  policy_field: '금융지원',
  selection_criteria:
    '소상공인 (상시근로자 5인 미만)\n사업개시일로부터 3개월 이상\n세금 체납이 없는 사업자\n신용등급 BB- 이상',
  supervising_organization_name: '소상공인시장진흥공단',
  receiving_organization_name: '지역별 소상공인센터',
  notice_date: '2025-01-01T00:00:00',
  modification_date: '2025-01-15T00:00:00',
  application_period: '2025.01.01 ~ 2025.12.31',
  begin_date: '2025-01-01',
  end_date: '2025-12-31',
  application_method: '온라인 신청 (소상공인시장진흥공단 홈페이지)',
  contact:
    '전화: 1599-0000\n이메일: help@service.go.kr\n홈페이지: www.semas.or.kr',
  support_detail:
    '보증료의 90% 지원 (연간 최대 200만원)\n신용보증료 및 기술보증료 지원\n분기별 지급\n보증기관에서 직접 차감하여 지급',
  support_target:
    '소상공인 (상시근로자 5인 미만)\n사업개시일로부터 3개월 이상\n세금 체납이 없는 사업자\n신용등급 BB- 이상',
  announcement_url: 'https://www.semas.or.kr/policy/detail/POL001',
  image:
    'https://readdy.ai/api/search-image?query=modern%20business%20financial%20support%20illustration%20with%20small%20business%20owners%20receiving%20government%20assistance%20in%20clean%20minimalist%20style%20with%20yellow%20accent%20colors%20and%20professional%20atmosphere&width=600&height=400&seq=hero001&orientation=landscape',
});

// 커뮤니티 통계
const communityStats = ref({
  participants: 89,
  todayMessages: 15,
  totalTopics: 32,
});

// 관련 정책
const relatedPolicies = ref([
  {
    title: '청년 창업 지원사업',
    documents: '3/5',
    deadline: 'D-7',
    agency: '중소벤처기업부',
  },
  {
    title: '중소기업 R&D 지원',
    documents: '2/4',
    deadline: 'D-12',
    agency: '기술보증기금',
  },
  {
    title: '여성기업 육성사업',
    documents: '4/6',
    deadline: 'D-5',
    agency: '여성가족부',
  },
  {
    title: '지역특화 산업육성',
    documents: '1/3',
    deadline: 'D-15',
    agency: '산업통상자원부',
  },
]);

// 유틸리티 함수들
const formatDate = date => {
  if (!date) return '미정';
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR');
};

// 커뮤니티로 이동
const goToCommunity = () => {
  // CommunityView로 이동하면서 정책 정보를 전달
  router.push({
    path: '/community',
    query: {
      productType: 'policy',
      productId: route.params.id,
      productName: policyData.value.policy_name,
    },
  });
};

// 내 서류함으로 이동
const goToDocs = () => {
  router.push('/docs');
};

// 필요서류 데이터
const requiredDocuments = ref([
  { name: '사업자등록증', uploaded: false },
  { name: '사업계획서', uploaded: false },
  { name: '소득증빙서류', uploaded: false },
  { name: '신분증 사본', uploaded: false },
  { name: '기타 관련 서류', uploaded: false },
]);

// 업로드된 서류 수 계산
const uploadedDocumentsCount = computed(() => {
  return requiredDocuments.value.filter(doc => doc.uploaded).length;
});

// 서류 업로드 모달 상태
const showUploadModal = ref(false);

// 새로운 서류 데이터
const newDoc = ref({
  name: '',
  issueDate: '',
  file: null,
});

// 서류 업로드 여부 확인
const isDocumentUploaded = file => {
  // TODO: API 연동 시 실제 업로드 상태 확인
  return file.uploaded;
};

// 서류 업로드 모달 열기
const openUploadModal = file => {
  newDoc.value.name = file.name;
  showUploadModal.value = true;
};

// 서류 업로드 모달 닫기
const closeUploadModal = () => {
  showUploadModal.value = false;
  newDoc.value = { name: '', issueDate: '', file: null };
};

// 파일 업로드 처리
const handleFileUpload = event => {
  newDoc.value.file = event.target.files[0];
};

// 서류 추가
const addDocument = () => {
  if (newDoc.value.name && newDoc.value.issueDate && newDoc.value.file) {
    // TODO: 실제 서류 추가 로직 구현
    console.log('서류 추가:', newDoc.value);

    // 폼 초기화 및 모달 닫기
    newDoc.value = { name: '', issueDate: '', file: null };
    showUploadModal.value = false;
  }
};

// 컴포넌트 마운트 시 정책 ID에 따른 데이터 로드 (향후 API 연동 시 사용)
onMounted(() => {
  const policyId = route.params.id;
  console.log('정책 ID:', policyId, '타입:', productType.value);

  // TODO: API 연동 시 여기서 실제 데이터를 가져옴
  // const fetchPolicyDetail = async () => {
  //     try {
  //         const response = await api.getPolicyDetail(policyId);
  //         productData.value = response.data;
  //     } catch (error) {
  //         console.error('정책 정보 로드 실패:', error);
  //     }
  // };
  // fetchPolicyDetail();
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

.prose {
  line-height: 1.6;
}

.whitespace-pre-line {
  white-space: pre-line;
}

:root {
  --brand-primary: #10b981;
  --brand-deep: #1c1c1c;
  --brand-muted: #6b7280;
  --surface: #fff;
  --bg-soft: #f7f8fa;
  --line: #e5e7eb;
  --link: #0b5fff;
}
</style>
