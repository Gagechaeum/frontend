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
            :labels="chartData.labels"
            :policy="chartData.policySeries"
            :loan="chartData.loanSeries"
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
          :filtered-items="paginatedItems"
          :expanded-items="expandedItems"
          @toggle-detail="toggleDetail"
          @collapse-all="expandedItems = []"
          @open-loan="openLoanDetail"
          @open-policy="openPolicyDetail"
        />
        <Pagination
          :current-page="currentPage"
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

import { ref, computed, onMounted, watch } from 'vue';
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
import { useNotificationStore } from '@/stores/notification';

/* ===== Stores ===== */
const reportStore = useReportStore();
const notificationStore = useNotificationStore();
const { summary, items, schedule, cashFlow } = storeToRefs(reportStore);

/* ===== UI State ===== */
const showPolicyModal = ref(false);
const onClickLoan = () => {
  // TODO: implement loan add flow
};
const activeTab = ref('all');
const sortBy = ref('date');
const expandedItems = ref([]);

/* ===== Client-side Pagination State ===== */
const currentPage = ref(0);
const pageSize = ref(5);

/* ===== Summary / Chart State ===== */
const monthlyBenefit = computed(() => summary.value?.supportTotal ?? 0);
const monthlyPayment = computed(() => summary.value?.repayTotal ?? 0);

const chartData = computed(() => {
  if (cashFlow.value && cashFlow.value.length > 0) {
    return {
      labels: cashFlow.value.map(cf => cf.month),
      policySeries: cashFlow.value.map(cf => cf.benefit),
      loanSeries: cashFlow.value.map(cf => cf.repayment),
    };
  }
  const labels = [];
  const todayForChart = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(todayForChart);
    d.setMonth(todayForChart.getMonth() - i);
    const ym = d.toISOString().slice(0, 7);
    labels.push(`${Number(ym.split('-')[1])}월`);
  }
  return {
    labels,
    policySeries: new Array(6).fill(0),
    loanSeries: new Array(6).fill(0),
  };
});

/* ===== Calendar (2주) ===== */
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayISO = ref(toISO(today));

const calendarDays = computed(() => {
  const days = generateTwoWeeksAlignedToSunday(today);
  // 아이템 이름으로 맵을 생성하여 빠른 조회를 지원
  const itemsMap = new Map(items.value.map(item => [item.name, item]));

  schedule.value.forEach(event => {
    const day = days.find(d => d.date === event.date);
    if (day) {
      // 스케줄 이벤트의 이름과 일치하는 상세 정보를 아이템 맵에서 찾습니다.
      const correspondingItem = itemsMap.get(event.name);

      // 상세 정보가 있는 경우, 이벤트 객체에 `detail`로 추가합니다.
      // 캘린더 컴포넌트는 이 `detail` 객체를 사용하여 팝오버를 렌더링합니다.
      day.events.push({
        ...event,
        detail: correspondingItem || null, // 일치하는 아이템이 없으면 null
      });
    }
  });

  return days;
});

/* ===== Tabs ===== */
const tabs = [
  { key: 'all', label: '전체' },
  { key: 'loan', label: '대출' },
  { key: 'policy', label: '정책' },
  { key: 'expired', label: '만료' },
];

/* ===== Full-list Filtering, Sorting, and Pagination ===== */

// 1. Filter and Sort the full list
const sortedItems = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 자정 기준으로 비교

  const activeItems = [];
  const expiredItems = [];

  items.value.forEach(item => {
    const endDate = item.endDate ? new Date(item.endDate) : null;
    if (endDate && endDate < today) {
      expiredItems.push({ ...item, status: 'expired' });
    } else {
      activeItems.push({ ...item, status: 'active' });
    }
  });

  let listToShow;
  if (activeTab.value === 'expired') {
    listToShow = expiredItems;
  } else {
    if (activeTab.value === 'all') {
      listToShow = activeItems;
    } else {
      // 'loan' or 'policy'
      listToShow = activeItems.filter(
        i => i.type.toLowerCase() === activeTab.value
      );
    }
  }

  // 정렬하기 전에 항상 새 배열을 생성하여 반응성을 보장합니다.
  const listToSort = [...listToShow];

  if (sortBy.value === 'name') {
    listToSort.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  } else if (sortBy.value === 'date') {
    listToSort.sort((a, b) => {
      const dateA = a.endDate ? new Date(a.endDate) : 0;
      const dateB = b.endDate ? new Date(b.endDate) : 0;
      return dateA - dateB;
    });
  }

  return listToSort;
});

// 2. Calculate total pages based on the sorted list
const totalPages = computed(() => {
  return Math.ceil(sortedItems.value.length / pageSize.value);
});

// 3. Get the items for the current page
const paginatedItems = computed(() => {
  const start = currentPage.value * pageSize.value;
  const end = start + pageSize.value;
  return sortedItems.value.slice(start, end);
});

// Reset to first page when filters change
watch([activeTab, sortBy], () => {
  currentPage.value = 0;
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
  currentPage.value = newPage;
};

/* ===== Utils ===== */
function toISO(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

  // Fetch all data
  await reportStore.fetchAllItems();
  await reportStore.fetchDashboard();

  notificationStore.show('info', '페이지가 로드되었습니다.');
});
</script>
