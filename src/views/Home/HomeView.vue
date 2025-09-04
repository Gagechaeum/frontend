<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 히어로 배너: 헤더가 겹치는 레이아웃 -->
    <section
      class="relative overflow-hidden bg-gradient-to-b from-blue-50 to-transparent"
    >
      <div class="mx-auto max-w-6xl px-4">
        <div class="flex h-[360px] items-center justify-between pt-16">
          <div class="flex-1">
            <h1 class="mb-4 text-3xl font-bold text-gray-900">
              정부 지원·대출 상품 한눈에,<br />서류까지 한번에
            </h1>
            <p class="mb-6 text-lg text-gray-600">
              업종/지역 기반 추천과 마감 알림 제공
            </p>
            <div class="flex space-x-4">
              <UiButton variant="primary" size="lg" @click="goDocs">
                내 서류함 보기
              </UiButton>
              <UiButton variant="secondary" size="lg" @click="goReport">
                내 리포트 보기
              </UiButton>
            </div>
          </div>
          <div class="hidden flex-1 items-center justify-end md:flex">
            <img
              src="/vite.svg"
              alt="illustration"
              class="h-40 w-40 opacity-20"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 전역 검색창: 배너 아래로 이동 -->
    <div class="border-b border-gray-200 bg-white py-4">
      <div class="mx-auto max-w-2xl px-4">
        <div class="search-area relative flex items-center gap-1">
          <div class="relative flex-1">
            <SearchBar
              ref="searchBarRef"
              v-model="searchQuery"
              @submit="handleSearch"
            />
            <SearchResults
              :results="searchResults"
              :search-query="searchQuery"
              :has-searched="hasSearched"
              @detail-click="handleSearchResultDetail"
              @close="closeSearchResults"
            />
          </div>
          <button
            type="button"
            class="relative z-50 shrink-0 rounded-2xl bg-primary px-4 py-3 text-sm text-white hover:bg-brand-blue-royal"
            aria-label="검색 실행"
            @mousedown.prevent
            @click.stop="onSearchButtonClick"
          >
            검색
          </button>
        </div>
      </div>
    </div>

    <!-- 메인 컨테이너 -->
    <main class="mx-auto max-w-6xl px-4 py-8">
      <!-- 추천 대출 섹션 -->
      <Section title="추천 대출">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CardLg
            v-for="loan in loans"
            :key="loan.id"
            :title="loan.title"
            badge="대출"
            badge-tone="gray"
            :details="[
              { label: '금리', value: loan.rate },
              { label: '한도', value: loan.limit },
            ]"
            action-label="자세히 보기"
            @action="handleLoanDetail(loan)"
          />
        </div>
      </Section>

      <!-- 추천 정책 섹션 -->
      <Section title="추천 정책">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CardLg
            v-for="policy in policies"
            :key="policy.id"
            :title="policy.title"
            badge="정책"
            badge-tone="gray"
            :details="[
              { label: '필요서류', value: policy.documents },
              { label: '마감', value: policy.deadline, tone: 'danger' },
            ]"
            action-label="자세히 보기"
            @action="handlePolicyDetail(policy)"
          />
        </div>
      </Section>

      <!-- 동종업 인기 상품 섹션 -->
      <Section title="동종업 인기 상품">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <CardSm
            v-for="popular in popularProducts"
            :key="popular.id"
            :title="popular.title"
            :label="popular.industry"
            label-tone="yellow"
            :meta="popular.meta"
            @click="handlePopularDetail(popular)"
          />
        </div>
      </Section>

      <!-- 마감 임박 섹션 -->
      <Section title="마감 임박">
        <div class="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          <CardSm
            v-for="urgent in urgentProducts"
            :key="urgent.id"
            :title="urgent.title"
            :label="urgent.dday"
            label-tone="red"
            :meta="urgent.meta"
            @click="handleUrgentDetail(urgent)"
          />
        </div>
      </Section>

      <!-- 하단 분할 섹션 -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- 인기 채팅방 -->
        <Section title="인기 채팅방">
          <template #actions>
            <button class="cursor-pointer text-sm font-medium text-blue-600">
              더 보기
            </button>
          </template>
          <div class="space-y-3">
            <div
              v-for="chat in chatRooms"
              :key="chat.id"
              class="cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
              @click="handleChatRoom(chat)"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="mb-1 font-medium text-gray-900">
                    {{ chat.name }}
                  </h3>
                  <div class="flex items-center text-sm text-gray-600">
                    <i class="fas fa-users mr-1"></i>
                    <span>{{ chat.members }}명</span>
                    <span class="mx-2">·</span>
                    <span>{{ chat.lastActive }}</span>
                  </div>
                </div>
                <i class="fas fa-chevron-right text-gray-400"></i>
              </div>
            </div>
          </div>
        </Section>

        <!-- 인기 게시판 -->
        <Section title="인기 게시판">
          <template #actions>
            <button class="cursor-pointer text-sm font-medium text-blue-600">
              더 보기
            </button>
          </template>
          <div class="space-y-3">
            <div
              v-for="post in boardPosts"
              :key="post.id"
              class="cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
              @click="handleBoardPost(post)"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="mb-1 font-medium text-gray-900">
                    {{ post.title }}
                  </h3>
                  <p class="line-clamp-1 text-sm text-gray-600">
                    {{ post.summary }}
                  </p>
                </div>
                <i class="fas fa-chevron-right text-gray-400"></i>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/notification';
import SearchBar from '@/components/common/SearchBar.vue';
import SearchResults from '@/components/common/SearchResults.vue';
import Section from '@/components/common/Section.vue';
import CardLg from '@/components/common/cards/CardLg.vue';
import CardSm from '@/components/common/cards/CardSm.vue';
import UiButton from '@/components/common/UiButton.vue';

const router = useRouter();

const goDocs = () => router.push('/docs');
const goReport = () => router.push('/report');

const searchQuery = ref('');
const searchResults = ref([]);
const hasSearched = ref(false);
const searchBarRef = ref(null);
const isSearchButtonBeingClicked = ref(false); // 새로운 플래그 추가
const notificationStore = useNotificationStore();

// 컴포넌트 마운트 시 샘플 알림 추가 (테스트용)
onMounted(() => {
  // 샘플 알림 데이터 추가
  notificationStore.addSampleNotifications();

  // 검색창 포커스 이벤트 감지
  if (searchBarRef.value) {
    const searchInput = searchBarRef.value.$el.querySelector('input');
    if (searchInput) {
      searchInput.addEventListener('blur', handleSearchFocusOut);
    }
  }
});

// 검색창 내용이 바뀔 때 검색 결과 닫기
watch(searchQuery, (newQuery, oldQuery) => {
  // 검색어가 비어있거나 이전 검색어와 다를 때 검색 결과 닫기
  if (!newQuery || newQuery.trim() === '') {
    searchResults.value = [];
    hasSearched.value = false;
  } else if (oldQuery && newQuery !== oldQuery) {
    // 검색어가 변경되었을 때만 검색 결과 닫기 (초기 로드 시에는 제외)
    searchResults.value = [];
    hasSearched.value = false;
  }
});

const loans = ref([
  {
    id: 1,
    title: '중소기업 운영자금 대출',
    rate: '연 3.5%~5.2%',
    limit: '최대 5억원',
  },
  {
    id: 2,
    title: '청년창업 지원 대출',
    rate: '연 2.8%~4.5%',
    limit: '최대 2억원',
  },
  {
    id: 3,
    title: '기술보증기금 대출',
    rate: '연 3.2%~4.8%',
    limit: '최대 10억원',
  },
  {
    id: 4,
    title: '소상공인 특별대출',
    rate: '연 2.5%~3.9%',
    limit: '최대 1억원',
  },
]);

const policies = ref([
  {
    id: 1,
    title: '청년 창업 지원사업',
    documents: '3/5',
    deadline: 'D-7',
  },
  {
    id: 2,
    title: '중소기업 R&D 지원',
    documents: '2/4',
    deadline: 'D-12',
  },
  {
    id: 3,
    title: '여성기업 육성사업',
    documents: '4/6',
    deadline: 'D-5',
  },
  {
    id: 4,
    title: '지역특화 산업육성',
    documents: '1/3',
    deadline: 'D-15',
  },
]);

const popularProducts = ref([
  {
    id: 1,
    title: 'IT 스타트업 지원금',
    industry: 'IT업종',
    meta: '최대 3천만원',
  },
  {
    id: 2,
    title: '소프트웨어 개발지원',
    industry: 'IT업종',
    meta: '연 2.5% 금리',
  },
  {
    id: 3,
    title: '디지털 전환지원',
    industry: 'IT업종',
    meta: '최대 1억원',
  },
  {
    id: 4,
    title: '기술창업 인큐베이팅',
    industry: 'IT업종',
    meta: '무이자 3년',
  },
  {
    id: 5,
    title: 'AI 기술개발 지원',
    industry: 'IT업종',
    meta: '최대 5천만원',
  },
]);

const urgentProducts = ref([
  {
    id: 1,
    title: '긴급 운영자금 지원',
    dday: 'D-2',
    meta: '최대 2억원',
  },
  {
    id: 2,
    title: '코로나19 피해지원',
    dday: 'D-3',
    meta: '무이자 대출',
  },
  {
    id: 3,
    title: '청년 취업지원금',
    dday: 'D-1',
    meta: '월 50만원',
  },
  {
    id: 4,
    title: '소상공인 임대료 지원',
    dday: 'D-4',
    meta: '월 100만원',
  },
  {
    id: 5,
    title: '농업인 재해지원',
    dday: 'D-2',
    meta: '최대 3천만원',
  },
  {
    id: 6,
    title: '문화예술인 지원',
    dday: 'D-5',
    meta: '월 80만원',
  },
]);

const chatRooms = ref([
  { id: 1, name: '창업 준비 모임', members: 124, lastActive: '3분 전' },
  { id: 2, name: '정부지원금 정보공유', members: 89, lastActive: '7분 전' },
  { id: 3, name: 'IT 스타트업 네트워킹', members: 156, lastActive: '12분 전' },
  { id: 4, name: '대출 상담 및 후기', members: 203, lastActive: '18분 전' },
  { id: 5, name: '소상공인 모임', members: 67, lastActive: '25분 전' },
]);

const boardPosts = ref([
  {
    id: 1,
    title: '청년창업지원금 신청 후기',
    summary: '서류 준비부터 승인까지의 전 과정을 상세히 공유합니다.',
  },
  {
    id: 2,
    title: '정부지원 대출 금리 비교',
    summary: '각 기관별 대출 상품의 금리와 조건을 정리했습니다.',
  },
  {
    id: 3,
    title: '사업자등록 전 알아야 할 것들',
    summary: '창업 전 필수로 확인해야 할 세무 및 법적 사항들',
  },
  {
    id: 4,
    title: '코로나19 피해지원금 신청 가이드',
    summary: '피해지원금 신청 자격과 필요서류를 정리했습니다.',
  },
  {
    id: 5,
    title: 'R&D 지원사업 선정 팁',
    summary: '연구개발 지원사업 선정을 위한 실전 노하우 공유',
  },
]);

// 임시 검색 결과 함수 (API 연동 전까지 사용)
const getMockSearchResults = query => {
  const allProducts = [
    {
      id: 1,
      name: '중소기업 운영자금 대출',
      type: '대출',
      typeLabel: '대출',
      description: '중소기업의 운영자금 조달을 위한 대출 상품',
      rate: '연 3.5%~5.2%',
      limit: '최대 5억원',
    },
    {
      id: 2,
      name: '청년창업 지원 대출',
      type: '대출',
      typeLabel: '대출',
      description: '청년 창업가를 위한 특별 대출 상품',
      rate: '연 2.8%~4.5%',
      limit: '최대 2억원',
    },
    {
      id: 3,
      name: '기술보증기금 대출',
      type: '대출',
      typeLabel: '대출',
      description: '기술력을 보유한 기업을 위한 대출',
      rate: '연 3.2%~4.8%',
      limit: '최대 10억원',
    },
    {
      id: 4,
      name: '소상공인 특별대출 1',
      type: '대출',
      typeLabel: '대출',
      description: '소상공인을 위한 특별 대출 상품',
      rate: '연 2.5%~3.9%',
      limit: '최대 1억원',
    },
    {
      id: 5,
      name: '소상공인 특별대출 2',
      type: '대출',
      typeLabel: '대출',
      description: '소상공인 특별 대출 상품 2차',
      rate: '연 2.8%~4.2%',
      limit: '최대 1.5억원',
    },
    {
      id: 6,
      name: '청년 창업 지원사업',
      type: '정책',
      typeLabel: '정책',
      description: '청년 창업가를 위한 정부 지원 사업',
      documents: '3/5',
      deadline: 'D-7',
    },
    {
      id: 7,
      name: '중소기업 R&D 지원',
      type: '정책',
      typeLabel: '정책',
      description: '중소기업 연구개발 지원 정책',
      documents: '2/4',
      deadline: 'D-12',
    },
    {
      id: 8,
      name: '여성기업 육성사업',
      type: '정책',
      typeLabel: '정책',
      description: '여성 기업가 육성을 위한 지원 사업',
      documents: '4/6',
      deadline: 'D-5',
    },
  ];

  if (!query || query.trim() === '') {
    return [];
  }

  const searchTerm = query.toLowerCase();
  return allProducts.filter(
    product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
  );
};

// 이벤트 핸들러들
const handleSearch = async query => {
  if (!query || query.trim() === '') {
    searchResults.value = [];
    hasSearched.value = false;
    return;
  }

  try {
    hasSearched.value = true;
    // 실제 API 연동 시에는 searchProducts(query) 사용
    const results = getMockSearchResults(query);
    searchResults.value = results;
  } catch (error) {
    console.error('검색 실패:', error);
    searchResults.value = [];
  }
};

const onSearchButtonClick = () => {
  isSearchButtonBeingClicked.value = true; // 플래그 설정
  handleSearch(searchQuery.value);
  // 짧은 지연 후 플래그 초기화하여 일반적인 blur 동작 허용
  setTimeout(() => {
    isSearchButtonBeingClicked.value = false;
  }, 200);
};

const handleSearchResultDetail = result => {
  if (result.type === '대출') {
    router.push(`/loan/${result.id}`);
  } else if (result.type === '정책') {
    router.push(`/policy/${result.id}`);
  }
};

const closeSearchResults = () => {
  searchResults.value = [];
  hasSearched.value = false;
};

const handleSearchFocusOut = () => {
  // 검색창에서 포커스가 벗어났을 때 검색 결과 닫기
  // 검색 버튼 클릭 중이 아니라면 닫기
  setTimeout(() => {
    if (isSearchButtonBeingClicked.value) {
      return; // 검색 버튼 클릭 중이면 닫지 않음
    }
    if (!document.activeElement?.closest('.search-results')) {
      closeSearchResults();
    }
  }, 150);
};

const handleLoanDetail = loan => {
  console.log('대출 상세:', loan);
};

const handlePolicyDetail = policy => {
  console.log('정책 상세:', policy);
};

const handlePopularDetail = popular => {
  console.log('인기 상품 상세:', popular);
};

const handleUrgentDetail = urgent => {
  console.log('마감 임박 상세:', urgent);
};

const handleChatRoom = chat => {
  console.log('채팅방 입장:', chat);
};

const handleBoardPost = post => {
  console.log('게시글 상세:', post);
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
