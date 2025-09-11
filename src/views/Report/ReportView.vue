<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <ReportHeader
      @click-register-policy="showPolicyModal = true"
      @click-register-loan="onClickLoan"
    />

    <div class="mx-auto max-w-7xl px-6 py-6">
      <!-- 데스크톱 -->
      <div class="mb-6 hidden lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-6">
        <!-- 캘린더 카드 -->
        <div class="lg:col-span-2">
          <div class="h-full rounded-2xl border border-gray-200 bg-white p-4">
            <h2 class="mb-3 text-lg font-bold text-gray-900">2주 일정</h2>
            <TwoWeekCalendar
              :days="calendarDays"
              :columns="14"
              :today="todayISO"
              class="min-h-[70px]"
            />
          </div>
        </div>

        <!-- 이번달 요약 카드 -->
        <div>
          <MonthlySummary
            :monthly-benefit="monthlyBenefit"
            :monthly-payment="monthlyPayment"
            class="h-full"
          />
        </div>

        <!-- 현금흐름 차트 -->
        <div class="col-span-3 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 class="mb-4 text-lg font-bold text-gray-900">
            월별 현금 흐름 추이
          </h2>
          <CashflowChart
            :labels="trendLabels"
            :policy="policySeries"
            :loan="loanSeries"
          />
        </div>
      </div>

      <!-- 모바일 -->
      <div class="mb-6 lg:hidden">
        <MonthlySummary
          :monthly-benefit="monthlyBenefit"
          :monthly-payment="monthlyPayment"
        />
        <div class="rounded-2xl border border-gray-200 bg-white p-4">
          <h2 class="mb-4 text-lg font-bold text-gray-900">2주 일정</h2>
          <TwoWeekCalendar
            :days="calendarDays.slice(0, 14)"
            :columns="7"
            :today="todayISO"
          />
        </div>
      </div>

      <!-- 리스트 -->
      <div class="rounded-2xl border border-gray-200 bg-white">
        <ReportList
          v-model:active-tab="activeTab"
          v-model:sort-by="sortBy"
          :tabs="tabs"
          :filtered-items="filteredItems"
          :expanded-items="expandedItems"
          @toggle-detail="toggleDetail"
          @collapse-all="expandedItems = []"
          @open-loan="openLoanDetail"
          @open-policy="openPolicyDetail"
        />
        <Pagination
          :current-page="page"
          :total-pages="totalPages"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 정책 등록 모달 -->
    <RegisterModal
      :show="showPolicyModal"
      @close="showPolicyModal = false"
      @register="handlePolicyRegister"
    />
  </div>
</template>

<script setup>
/* eslint-env browser */

import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { me } from '@/lib/api/auth';
import ReportHeader from '@/components/report/ReportHeader.vue';
import TwoWeekCalendar from '@/components/report/TwoWeekCalendar.vue';
import MonthlySummary from '@/components/report/MonthlySummary.vue';
import CashflowChart from '@/components/report/CashflowChart.vue';
import ReportList from '@/components/report/ReportList.vue';
import RegisterModal from '@/components/report/RegisterModal.vue';
import Pagination from '@/components/common/Pagination.vue';
import { useReportStore } from '@/stores/reports';

/* ===== Stores ===== */
const reportStore = useReportStore();
const { summary, items, schedule, cashFlow, page, totalPages } =
  storeToRefs(reportStore);

/* ===== UI State ===== */
const showPolicyModal = ref(false);
const onClickLoan = () => {
  // TODO: implement loan add flow
};
const activeTab = ref('all');
const sortBy = ref('name');
const expandedItems = ref([]);

/* ===== Summary / Chart State ===== */
const monthlyBenefit = computed(() => summary.value?.supportTotal ?? 0);
const monthlyPayment = computed(() => summary.value?.repayTotal ?? 0);

const policySeries = computed(() => cashFlow.value.map(cf => cf.benefit));
const loanSeries = computed(() => cashFlow.value.map(cf => cf.repayment));
const trendLabels = computed(() => cashFlow.value.map(cf => cf.month));

/* ===== Calendar (2주) ===== */
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayISO = ref(toISO(today));

const calendarDays = computed(() => {
  const days = generateTwoWeeksAlignedToSunday(today);
  schedule.value.forEach(event => {
    const day = days.find(d => d.date === event.date);
    if (day) {
      day.events.push(event);
    }
  });
  return days;
});

/* ===== Tabs ===== */
const tabs = [
  { key: 'all', label: '전체' },
  { key: 'loan', label: '대출' },
  { key: 'policy', label: '정책' },
];

/* ===== Filters / Sorting ===== */
const filteredItems = computed(() => {
  let list = items.value;
  if (activeTab.value !== 'all') {
    list = items.value.filter(i => i.type === activeTab.value);
  }

  if (sortBy.value === 'name') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  } else if (sortBy.value === 'date') {
    list = [...list].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );
  }
  return list;
});

/* ===== Row expand / open detail ===== */
const toggleDetail = id => {
  const i = expandedItems.value.indexOf(id);
  if (i > -1) expandedItems.value.splice(i, 1);
  else expandedItems.value.push(id);
};
const openLoanDetail = item => {
  // TODO: implement loan detail
  void item;
};
const openPolicyDetail = item => {
  // TODO: implement policy detail
  void item;
};

/* ===== RegisterModal → ReportView 핸들러 ===== */
async function handlePolicyRegister(newItem) {
  await reportStore.savePolicy(newItem);
  showPolicyModal.value = false;
}

/* ===== Pagination ===== */
const handlePageChange = newPage => {
  reportStore.fetchItems(newPage);
};

/* ===== Utils ===== */
function toISO(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10);
}

/* Calendar helpers */
function generateTwoWeeksAlignedToSunday(baseDate) {
  const d = new Date(baseDate);
  d.setHours(0, 0, 0, 0);
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay()); // 일요일
  const out = [];
  for (let i = 0; i < 14; i++) {
    const cur = new Date(start);
    cur.setDate(start.getDate() + i);
    out.push({
      date: toISO(cur),
      day: cur.getDate(),
      dayName: ['일', '월', '화', '수', '목', '금', '토'][cur.getDay()],
      events: [],
    });
  }
  return out;
}

/* ===== onMounted: API 호출 ===== */
onMounted(async () => {
  // 로그인 사용자 확인
  try {
    await me();
  } catch (e) {
    globalThis.console?.warn('[ReportView] 사용자 정보 확인 실패', e);
    // TODO: 로그인 페이지로 리디렉션 또는 오류 메시지 표시
    return;
  }

  reportStore.resetItems(); // Reset items before fetching

  // Fetch dashboard first
  await reportStore.fetchDashboard();

  // Then fetch items for the first page
  await reportStore.fetchItems(0);

  // 캘린더 스켈레톤
  calendarDays.value = generateTwoWeeksAlignedToSunday(today);

  // 차트 기본 6개월(0값) — 데이터 없어도 틀 유지
  if (!trendLabels.value.length) {
    const end = new Date(today);
    const labels = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(end);
      d.setMonth(end.getMonth() - i);
      const ym = d.toISOString().slice(0, 7);
      labels.push(`${Number(ym.split('-')[1])}월`);
    }
    trendLabels.value = labels;
    policySeries.value = new Array(6).fill(0);
    loanSeries.value = new Array(6).fill(0);
  }
});
</script>
