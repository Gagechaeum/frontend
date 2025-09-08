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
      </div>
    </div>

    <!-- 정책 등록 모달 -->
    <RegisterModal
      :show="showPolicyModal"
      :favorite-items="policyFavorites"
      @close="showPolicyModal = false"
      @register="handlePolicyRegister"
    />
  </div>
</template>

<script setup>
/* eslint-env browser */

import { ref, computed, onMounted } from 'vue';
import { me } from '@/lib/api/auth';
import ReportHeader from '@/components/report/ReportHeader.vue';
import TwoWeekCalendar from '@/components/report/TwoWeekCalendar.vue';
import MonthlySummary from '@/components/report/MonthlySummary.vue';
import CashflowChart from '@/components/report/CashflowChart.vue';
import ReportList from '@/components/report/ReportList.vue';
import RegisterModal from '@/components/report/RegisterModal.vue';
import { useReportStore } from '@/stores/reports';
import { getDashboard } from '@/lib/api/reports.js';

/* ===== Stores ===== */
const reportStore = useReportStore();

/* ===== UI State ===== */
const showPolicyModal = ref(false);
const onClickLoan = () => {
  // TODO: implement loan add flow
};
const activeTab = ref('all');
const sortBy = ref('name');
const expandedItems = ref([]);

/* ===== Summary / Chart State ===== */
const monthlyBenefit = ref(0);
const monthlyPayment = ref(0);
const policySeries = ref([]);
const loanSeries = ref([]);
const trendLabels = ref([]);

/* ===== Calendar (2주) ===== */
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayISO = ref(toISO(today));
const calendarDays = ref([]);

/* ===== List ===== */
const items = ref([]);

/* ===== Favorites ===== */
const policyFavorites = ref([
  { id: 'pf-1', type: 'policy', name: '중소기업 성장지원금' },
  { id: 'pf-2', type: 'policy', name: '청년 창업 지원금' },
  { id: 'pf-3', type: 'policy', name: '소상공인 경영안정자금' },
]);

/* ===== Tabs ===== */
const tabs = [
  { key: 'all', label: '전체' },
  { key: 'loan', label: '대출' },
  { key: 'policy', label: '정책' },
  { key: 'expired', label: '만료' },
];

/* ===== Filters / Sorting ===== */
const filteredItems = computed(() => {
  let list =
    activeTab.value === 'all'
      ? items.value.filter(i => i.status !== 'expired')
      : activeTab.value === 'loan'
        ? items.value.filter(i => i.type === 'loan' && i.status !== 'expired')
        : activeTab.value === 'policy'
          ? items.value.filter(
              i => i.type === 'policy' && i.status !== 'expired'
            )
          : items.value.filter(i => i.status === 'expired');

  if (sortBy.value === 'alphabet' || sortBy.value === 'name') {
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
function handlePolicyRegister(newItem) {
  items.value.unshift({
    ...newItem,
    id: Date.now(),
    status: 'active',
  });
  showPolicyModal.value = false;
}

/* ===== Utils ===== */
function toISO(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10);
}
function toNumber(v) {
  if (v == null) return 0;
  if (typeof v === 'number') return v;
  return Number(String(v).replaceAll(',', '')) || 0;
}
function cryptoRandom() {
  return 'id-' + Math.random().toString(36).slice(2, 10);
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

/* ===== Store -> View Sync ===== */
function syncFromStore() {
  const s = reportStore.summary || {};
  monthlyBenefit.value = Number(s.supportTotal ?? 0);
  monthlyPayment.value = Number(s.repayTotal ?? 0);

  const policies = Array.isArray(reportStore.policy) ? reportStore.policy : [];
  const loans = Array.isArray(reportStore.loan) ? reportStore.loan : [];

  const mappedPolicies = policies.map(p => ({
    id: p.id ?? cryptoRandom(),
    type: 'policy',
    name: p.name ?? p.title ?? '정책',
    startDate: p.startDate ?? todayISO.value,
    endDate: p.endDate ?? todayISO.value,
    totalAmount: toNumber(p.totalAmount ?? 0),
    monthlyAmount: toNumber(p.monthlyAmount ?? 0),
    status: p.status ?? 'active',
  }));

  const mappedLoans = loans.map(l => ({
    id: l.id ?? cryptoRandom(),
    type: 'loan',
    name: l.name ?? l.title ?? '대출',
    startDate: l.startDate ?? todayISO.value,
    endDate: l.endDate ?? todayISO.value,
    totalAmount: toNumber(l.totalAmount ?? 0),
    repaymentMethod: l.repaymentMethod ?? '—',
    totalPayments: Number(l.totalPayments ?? 0),
    completedPayments: Number(l.completedPayments ?? 0),
    paidAmount: toNumber(l.paidAmount ?? 0),
    interestRate: String(l.interestRate ?? '—'),
    status: l.status ?? 'active',
  }));

  // 목록 구성
  items.value = [...mappedPolicies, ...mappedLoans];
}

/* ===== onMounted: 존재하는 API만 호출 ===== */
onMounted(async () => {
  // 로그인 사용자 확인
  let userId = null;
  try {
    const u = await me();
    userId = u?.id ?? u?.userId ?? u?.data?.id ?? null;
  } catch (e) {
     
    globalThis.console?.warn('[ReportView] 사용자 정보 확인 실패', e);
  }
  if (!userId) {
     
    globalThis.console?.error('[ReportView] 로그인 필요');
    return;
  }

  // 캘린더 스켈레톤
  calendarDays.value = generateTwoWeeksAlignedToSunday(today);

  // 대시보드만 호출
  const data = await getDashboard({ page: 0, size: 200, userId });

  // 스토어 반영
  reportStore.summary = data?.summary || {};
  reportStore.policy = Array.isArray(data?.policy) ? data.policy : [];
  reportStore.loan = Array.isArray(data?.loan) ? data.loan : [];
  reportStore.page = 0;
  reportStore.size = 200;
  reportStore.hasNext = !!data?.hasNext;

  // 요약 수치
  monthlyBenefit.value = Number(data?.summary?.supportTotal ?? 0);
  monthlyPayment.value = Number(data?.summary?.repayTotal ?? 0);

  // 리스트 동기화
  syncFromStore();

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
