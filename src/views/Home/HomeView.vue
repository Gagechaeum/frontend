<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 히어로 배너-->
    <section
      class="relative overflow-hidden bg-gradient-to-b from-blue-50 to-transparent"
    >
      <div class="absolute inset-0 opacity-30">
        <div
          class="absolute left-10 top-20 h-32 w-32 animate-pulse rounded-full bg-blue-200 blur-xl"
        ></div>
        <div
          class="animation-delay-1000 absolute right-20 top-40 h-24 w-24 animate-pulse rounded-full bg-indigo-200 blur-xl"
        ></div>
        <div
          class="animation-delay-2000 absolute bottom-20 left-1/4 h-20 w-20 animate-pulse rounded-full bg-purple-200 blur-xl"
        ></div>
      </div>

      <div class="absolute inset-0 overflow-hidden">
        <div
          class="animation-delay-500 absolute right-32 top-16 h-2 w-2 animate-bounce rounded-full bg-blue-400"
        ></div>
        <div
          class="animation-delay-1000 absolute right-40 top-24 h-1 w-1 animate-bounce rounded-full bg-indigo-400"
        ></div>
        <div
          class="animation-delay-1500 absolute right-28 top-32 h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400"
        ></div>
      </div>

      <div class="relative z-10 mx-auto max-w-6xl px-4">
        <div class="flex h-[500px] items-center justify-between pb-20 pt-24">
          <div class="max-w-2xl flex-1">
            <div class="mb-6">
              <h1
                class="mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl"
              >
                정부 지원·대출 상품 한눈에,<br />
                <span
                  class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                >
                  서류까지 한번에
                </span>
              </h1>
              <p class="mb-8 text-xl leading-relaxed text-gray-600">
                업종/지역 기반 추천과 올인원 서류 관리로<br />
                <span class="font-medium text-gray-700"
                  >더 스마트한 비즈니스 지원</span
                >
              </p>
            </div>

            <div
              class="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
            >
              <button
                class="group relative transform rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:bg-blue-700 hover:shadow-xl"
                @click="goDocs"
              >
                <span class="flex items-center space-x-2">
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <span>내 서류함 보기</span>
                </span>
              </button>

              <button
                class="group transform rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 font-semibold text-gray-700 shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-300 hover:text-blue-700 hover:shadow-lg"
                @click="goReport"
              >
                <span class="flex items-center space-x-2">
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                  <span>내 리포트 보기</span>
                </span>
              </button>
            </div>
          </div>

          <div class="relative hidden flex-1 items-center justify-end lg:flex">
            <!-- 메인 일러스트 -->
            <div class="relative">
              <div
                class="absolute inset-0 animate-pulse rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 opacity-60 blur-2xl"
              ></div>
              <div
                class="relative rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-sm"
              >
                <div
                  class="flex h-48 w-48 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100"
                >
                  <svg
                    class="h-24 w-24 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                </div>
              </div>

              <!-- 부유하는 아이콘들 -->
              <div
                class="absolute -right-4 -top-4 animate-bounce rounded-full bg-green-100 p-3 shadow-lg"
              >
                <svg
                  class="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>

              <div
                class="animation-delay-1000 absolute -bottom-4 -left-4 animate-bounce rounded-full bg-yellow-100 p-3 shadow-lg"
              >
                <svg
                  class="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
            </div>
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
            class="relative z-10 shrink-0 rounded-2xl bg-primary px-4 py-3 text-sm text-white hover:bg-brand-blue-royal"
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
    <main class="mx-auto max-w-6xl px-6 py-20">
      <!-- 추천 대출 섹션 -->
      <div v-inview.once style="margin-bottom: 6rem" class="-mx-6 px-6 py-8">
        <Section
          :title="'대출을 한눈에 비교하고, 내 조건에 맞는 상품을 확인하세요'"
        >
          <template #description>
            <div class="reveal-item">
              <ul class="mt-3 flex flex-wrap gap-3">
                <li v-for="t in loanTags" :key="t" class="reveal-item">
                  <UiButton
                    variant="ghost"
                    size="sm"
                    class="pointer-events-none cursor-default"
                  >
                    {{ t }}
                  </UiButton>
                </li>
              </ul>
            </div>
          </template>
          <div
            class="reveal-item reveal-stagger grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <div
              v-for="loan in loans"
              :key="loan.id"
              class="reveal-item card-hover-wrap"
            >
              <CardLg
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
          </div>
        </Section>
      </div>

      <!-- 추천 정책 -->
      <div
        v-inview.once
        style="
          margin-bottom: 6rem;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
          width: 100vw;
        "
        class="bg-blue-50"
      >
        <div class="mx-auto max-w-6xl px-6 py-16">
          <Section :title="'추천 정책도 한 번에 확인하세요'">
            <template #description>
              <p class="reveal-item text-lg text-gray-600">
                내 조건에 맞는 정책을 추천해드립니다
              </p>
            </template>

            <div
              class="reveal-item reveal-stagger grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <div
                v-for="policy in policies"
                :key="policy.id"
                class="reveal-item card-hover-wrap"
              >
                <CardLg
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
            </div>
          </Section>
        </div>
      </div>

      <!-- 동종업 인기 상품 -->
      <div v-inview.once style="margin-bottom: 6rem" class="-mx-6 px-6 py-8">
        <Section :title="'내 업종 사람들이 많이 보는 상품'">
          <template #description>
            <p class="reveal-item text-lg text-gray-600">
              나와 같은 업종에 종사하는 사용자가 많이 보는 상품을 추천해드립니다
            </p>
          </template>
          <div
            class="reveal-item reveal-stagger grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5"
          >
            <div
              v-for="popular in popularProducts"
              :key="popular.id"
              class="reveal-item card-hover-wrap"
            >
              <CardSm
                :title="popular.title"
                :label="popular.industry"
                label-tone="yellow"
                :meta="popular.meta"
                @click="handlePopularDetail(popular)"
              />
            </div>
          </div>
        </Section>
      </div>

      <!-- 마감 임박 -->
      <div
        v-inview.once
        style="
          margin-bottom: 6rem;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
          width: 100vw;
        "
        class="bg-blue-50"
      >
        <div class="mx-auto max-w-6xl px-6 py-16">
          <Section :title="'마감 임박! 놓치기 전에 확인하세요'">
            <template #description>
              <p class="reveal-item text-lg text-gray-600">
                신청 기간이 얼마 남지 않은 상품을 추천해드립니다
              </p>
            </template>
            <div
              class="reveal-item reveal-stagger grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6"
            >
              <div
                v-for="urgent in urgentProducts"
                :key="urgent.id"
                class="reveal-item card-hover-wrap"
              >
                <CardSm
                  :title="urgent.title"
                  :label="urgent.dday"
                  label-tone="red"
                  :meta="urgent.meta"
                  @click="handleUrgentDetail(urgent)"
                />
              </div>
            </div>
          </Section>
        </div>
      </div>

      <!-- 하단 분할 섹션 -->
      <div v-inview.once class="-mx-6 px-6 py-8">
        <Section title="인기 채팅방">
          <template #description>
            <p class="reveal-item text-lg text-gray-600">
              지금 가장 인기 있는 채팅방을 추천해드립니다
            </p>
          </template>
          <template #actions>
            <button
              class="cursor-pointer text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
              @click="goCommunity"
            >
              더 보기
            </button>
          </template>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="space-y-3">
              <div
                v-for="chat in chatRooms.slice(0, 5)"
                :key="chat.roomId"
                class="cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
                @click="handleChatRoom(chat)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="mb-2 flex items-center gap-2">
                      <Tag
                        :label="chat.roomType"
                        :tone="getChatRoomTone(chat.roomType)"
                        size="xs"
                      />
                    </div>
                    <h3 class="mb-1 font-medium text-gray-900">
                      {{ chat.name }}
                    </h3>
                    <div class="flex items-center text-sm text-gray-600">
                      <i class="fas fa-users mr-1"></i>
                      <span>{{ chat.participantCount }}명</span>
                    </div>
                  </div>
                  <i class="fas fa-chevron-right text-gray-400"></i>
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <div
                v-for="chat in chatRooms.slice(5, 10)"
                :key="chat.roomId"
                class="cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
                @click="handleChatRoom(chat)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="mb-2 flex items-center gap-2">
                      <Tag
                        :label="chat.roomType"
                        :tone="getChatRoomTone(chat.roomType)"
                        size="xs"
                      />
                    </div>
                    <h3 class="mb-1 font-medium text-gray-900">
                      {{ chat.name }}
                    </h3>
                    <div class="flex items-center text-sm text-gray-600">
                      <i class="fas fa-users mr-1"></i>
                      <span>{{ chat.participantCount }}명</span>
                    </div>
                  </div>
                  <i class="fas fa-chevron-right text-gray-400"></i>
                </div>
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
import { vInview } from '@/utils/inview.js';
import SearchBar from '@/components/common/SearchBar.vue';
import SearchResults from '@/components/common/SearchResults.vue';
import Section from '@/components/common/Section.vue';
import CardLg from '@/components/common/cards/CardLg.vue';
import CardSm from '@/components/common/cards/CardSm.vue';
import UiButton from '@/components/common/UiButton.vue';
import Tag from '@/components/common/Tag.vue';

const router = useRouter();

const goDocs = () => router.push('/docs');
const goReport = () => router.push('/report');
const goCommunity = () => router.push('/community');

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

const loanTags = ref([
  '# 중소기업',
  '# 청년창업',
  '# 소상공인',
  '# 여성기업',
  '# IT업종',
  '# 제조업',
  '# 서비스업',
]);

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
  {
    roomId: 1,
    roomType: '업종',
    name: '창업 준비 모임',
    participantCount: 124,
  },
  {
    roomId: 2,
    roomType: '정책',
    name: '정부지원금 정보공유',
    participantCount: 89,
  },
  {
    roomId: 3,
    roomType: '업종',
    name: 'IT 스타트업 네트워킹',
    participantCount: 156,
  },
  {
    roomId: 4,
    roomType: '대출',
    name: '대출 상담 및 후기',
    participantCount: 203,
  },
  { roomId: 5, roomType: '업종', name: '소상공인 모임', participantCount: 67 },
  {
    roomId: 6,
    roomType: '정책',
    name: '청년창업 지원팀',
    participantCount: 98,
  },
  {
    roomId: 7,
    roomType: '정책',
    name: 'R&D 지원사업 정보',
    participantCount: 134,
  },
  {
    roomId: 8,
    roomType: '업종',
    name: '여성기업 네트워킹',
    participantCount: 76,
  },
  {
    roomId: 9,
    roomType: '지역',
    name: '지역특화 산업정보',
    participantCount: 112,
  },
  {
    roomId: 10,
    roomType: '정책',
    name: '농업인 지원사업',
    participantCount: 89,
  },
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
    router.push(`/product/loan/${result.id}`);
  } else if (result.type === '정책') {
    router.push(`/product/policy/${result.id}`);
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
  router.push(`/product/loan/${loan.id}`);
};

const handlePolicyDetail = policy => {
  router.push(`/product/policy/${policy.id}`);
};

const handlePopularDetail = popular => {
  // 인기 상품은 대출 또는 정책으로 분류하여 처리
  if (popular.title.includes('지원금') || popular.title.includes('지원')) {
    router.push(`/product/policy/${popular.id}`);
  } else {
    router.push(`/product/loan/${popular.id}`);
  }
};

const handleUrgentDetail = urgent => {
  // 마감 임박 상품도 대출 또는 정책으로 분류하여 처리
  if (urgent.title.includes('지원') || urgent.title.includes('지원금')) {
    router.push(`/product/policy/${urgent.id}`);
  } else {
    router.push(`/product/loan/${urgent.id}`);
  }
};

const handleChatRoom = chat => {
  console.log('채팅방 입장:', chat);
};

const handleBoardPost = post => {
  console.log('게시글 상세:', post);
};

const getChatRoomTone = roomType => {
  if (roomType === '업종') return 'gray';
  if (roomType === '정책') return 'yellow';
  if (roomType === '대출') return 'blue';
  if (roomType === '지역') return 'gray';
  return 'gray'; // 기본값
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Section 타이틀 크게 (기존 Section 구조 유지하면서 세분화) */
:deep(section > div > div > h2) {
  /* Section.vue의 h2 */
  font-size: clamp(1.25rem, 2vw + 1rem, 2.25rem);
  /* ≈ text-2xl~4xl (기존보다 작게) */
  line-height: 1.3;
  margin-bottom: 0.75rem;
  /* 24px에서 12px로 줄임 */
}

/* 섹션 간격 넓히기 - v-inview 래퍼들 사이 */
div[v-inview] {
  width: 100%;
  margin-bottom: 12rem !important;
  /* 192px - 섹션 간격 강제 적용 */
}

div[v-inview]:last-child {
  margin-bottom: 0;
}

/* 더 구체적인 선택자로 섹션 간격 강제 적용 */
main > div[v-inview] {
  margin-bottom: 12rem !important;
}

main > div[v-inview]:last-child {
  margin-bottom: 0 !important;
}

/* 하단 분할 섹션은 별도 처리 */
.grid.grid-cols-1.gap-8.lg\\:grid-cols-2 {
  gap: 5rem !important;
  /* 80px로 더 넓게 */
  margin-top: 4rem !important;
  /* 64px로 더 넓게 */
}

/* Section 컴포넌트 내부 여백 제거 (중복 방지) */
:deep(section) {
  margin-bottom: 0 !important;
  /* 기존 마진 제거 */
}

/* === Scroll Reveal (scoped에서도 동작) === */
.reveal-item {
  opacity: 0;
  transform: translateY(36px);
  transition:
    transform 1.2s cubic-bezier(0.22, 0.61, 0.36, 1),
    opacity 1.8s ease;
  will-change: transform, opacity;
}

.inview .reveal-item {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal-item {
    transition: none;
    opacity: 1;
    transform: none;
  }
}

/* === Card hover: 공통컴포넌트 수정 없이 래퍼만 === */
.card-hover-wrap {
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.card-hover-wrap:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

/* === 카드 hover: lift + 그림자 (이미 있음) + 배경/텍스트 틴트 === */
.card-hover-wrap {
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background-color 0.25s ease;
  border-radius: 1rem;
  /* 외곽 라운드 보정(시각적으로 부드럽게) */
}

.card-hover-wrap:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

/* 색 반전(과하지 않게 틴트 수준) */
.card-hover-wrap:hover :deep(article) {
  background: #f5f9ff;
  /* 연한 블루 틴트 */
  border-color: #d6e6ff;
}

/* 제목/텍스트 컬러 살짝 진하게 */
.card-hover-wrap:hover :deep(h3) {
  color: #0b4aa2;
  /* primary 계열 진한 블루 */
}

.card-hover-wrap:hover :deep(.text-gray-600) {
  color: #1f2d3d;
  /* 읽기 쉬운 중간 톤 */
}

/* 버튼이 있다면( CardLg ) 대비 높이기 */
.card-hover-wrap:hover :deep(button) {
  border-color: #0b4aa2;
}

/* === 리빌 스태거(선택): 같은 행 카드가 순차적으로 뜨게 === */

.reveal-stagger > .reveal-item:nth-child(1) {
  transition-delay: 0.05s;
}

.reveal-stagger > .reveal-item:nth-child(2) {
  transition-delay: 0.1s;
}

.reveal-stagger > .reveal-item:nth-child(3) {
  transition-delay: 0.15s;
}

.reveal-stagger > .reveal-item:nth-child(4) {
  transition-delay: 0.2s;
}

/* === loanTags UiButton 스타일 오버라이드 === */
.reveal-item .cursor-default {
  cursor: default !important;
  pointer-events: none !important;
}

.reveal-item .cursor-default:hover {
  background-color: transparent !important;
  color: inherit !important;
}
</style>
