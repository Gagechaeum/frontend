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
            :policy-series="policySeries"
            :loan-series="loanSeries"
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
/* ===== Imports ===== */
import { ref, computed, onMounted, nextTick } from 'vue';
import ReportHeader from '@/components/report/ReportHeader.vue';
import TwoWeekCalendar from '@/components/report/TwoWeekCalendar.vue';
import MonthlySummary from '@/components/report/MonthlySummary.vue';
import CashflowChart from '@/components/report/CashflowChart.vue';
import ReportList from '@/components/report/ReportList.vue';
import RegisterModal from '@/components/report/RegisterModal.vue';
import { useReportStore } from '@/stores/reports';
import {
  getTwoWeekSchedule,
  getMonthlySummary,
  getIncomeExpenseTrend,
  getDashboard,
} from '@/lib/api/reports.js';

/* ===== Stores ===== */
const reportStore = useReportStore();

/* ===== UI State ===== */
const showPolicyModal = ref(false);
const onClickLoan = () => console.log('대출 등록 버튼 클릭');
const activeTab = ref('all');
const sortBy = ref('name');
const expandedItems = ref([]);

/* ===== Summary / Chart State ===== */
const monthlyBenefit = ref(0); // 이번달 혜택금액
const monthlyPayment = ref(0); // 이번달 납부예정금액
const policySeries = ref([]); // 그래프: 정책 수입 (월별)
const loanSeries = ref([]); // 그래프: 대출 상환 (월별)
const trendLabels = ref([]); // 그래프: x축 라벨 (예: ['3월','4월',...])

/* ===== Calendar (2주) ===== */
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayISO = ref(toISO(today));
const calendarDays = ref([]); // [{date, day, dayName, events:[]}] 14일

/* ===== List (대시보드 아이템) ===== */
const items = ref([]); // 정책/대출 리스트(스토어→매핑)

/* ===== Favorites (그대로 유지 가능) ===== */
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
const openLoanDetail = item => console.log('대출 상세보기', item);
const openPolicyDetail = item => console.log('정책 상세보기', item);

/* ===== Policy Register (예시 유지) ===== */
const handlePolicyRegister = async ({ selected, form }) => {
  const newId = Date.now();
  const newPolicy = {
    id: newId,
    type: 'policy',
    name: selected?.name || '정책',
    startDate: form?.periodStart || todayISO.value,
    endDate: form?.periodEnd || todayISO.value,
    totalAmount: toNumber(form?.totalAmount) || 0,
    monthlyAmount: toNumber(form?.monthlyAmount) || 0,
    status: 'active',
  };
  items.value.unshift(newPolicy);
  if (form?.paymentDate) {
    addCalendarEvent(calendarDays.value, {
      date: form.paymentDate,
      title: '지급일',
      type: 'payment_due',
    });
  }
  showPolicyModal.value = false;
  await nextTick();
  activeTab.value = 'policy';
};

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
function monthStr(d) {
  return toISO(d).slice(0, 7);
} // 'YYYY-MM'
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
function addCalendarEvent(days, { date, title, type }) {
  const idx = days.findIndex(d => d.date === date);
  if (idx !== -1) {
    days[idx].events.push({ id: cryptoRandom(), title, type });
  }
}
function mapEvent(e) {
  const type = e.type || e.kind || 'other';
  const title =
    e.title ||
    (type === 'repayment'
      ? '상환일'
      : type === 'payment_due'
        ? '지급일'
        : type === 'expiry'
          ? '만기일'
          : '일정');
  return {
    id: e.id ?? cryptoRandom(),
    date: e.date || e.dueDate,
    type,
    title,
    amount: Number(e.amount ?? e.monthlyAmount ?? 0),
    detail: e.detail ?? {},
  };
}
function safeRate(done, total) {
  if (!total) return 0;
  const r = Number(done || 0) / Number(total);
  return isFinite(r) ? Math.max(0, Math.min(1, r)) : 0;
}

/* ===== Store -> View Sync (리스트/차트 보조) ===== */
function syncFromStore() {
  // Summary
  const s = reportStore.summary || {};
  monthlyBenefit.value = Number(s.supportTotal ?? 0);
  monthlyPayment.value = Number(s.repayTotal ?? 0);

  // Lists
  const policies = Array.isArray(reportStore.policy) ? reportStore.policy : [];
  const loans = Array.isArray(reportStore.loan) ? reportStore.loan : [];

  const mappedPolicies = policies.map(p => ({
    id: p.id ?? cryptoRandom(),
    type: 'policy',
    name: p.name ?? p.title ?? '정책',
    startDate: p.startDate ?? p.periodStart ?? p.beginDate ?? todayISO.value,
    endDate: p.endDate ?? p.periodEnd ?? p.finishDate ?? todayISO.value,
    totalAmount: toNumber(p.totalAmount ?? p.amountTotal ?? 0),
    monthlyAmount: toNumber(p.monthlyAmount ?? p.amountMonthly ?? 0),
    status: p.status ?? 'active',
  }));

  const mappedLoans = loans.map(l => ({
    id: l.id ?? cryptoRandom(),
    type: 'loan',
    name: l.name ?? l.title ?? '대출',
    startDate: l.startDate ?? l.beginDate ?? todayISO.value,
    endDate: l.endDate ?? l.finishDate ?? todayISO.value,
    totalAmount: toNumber(l.totalAmount ?? l.principal ?? 0),
    repaymentMethod: l.repaymentMethod ?? l.method ?? '—',
    totalPayments: Number(l.totalPayments ?? l.termCount ?? 0),
    completedPayments: Number(l.completedPayments ?? l.paidCount ?? 0),
    paidAmount: toNumber(l.paidAmount ?? 0),
    interestRate: String(l.interestRate ?? l.rate ?? '—'),
    status: l.status ?? 'active',
  }));

  if (mappedPolicies.length || mappedLoans.length) {
    items.value = [...mappedPolicies, ...mappedLoans];
  }

  // Chart (series) — 대시보드 기반 보조 (trend는 별도 API에서 메인으로 채움)
  if (mappedPolicies.length && policySeries.value.length === 0) {
    policySeries.value = mappedPolicies
      .slice(0, 5)
      .map(p => p.monthlyAmount || 0);
  }
  if (mappedLoans.length && loanSeries.value.length === 0) {
    loanSeries.value = mappedLoans.slice(0, 5).map(l => {
      const per = l.totalPayments
        ? Math.round(l.totalAmount / l.totalPayments)
        : 0;
      return per || 0;
    });
  }
}

/* ===== Paging (옵션) ===== */
async function loadNextPage() {
  const token = localStorage.getItem('token');
  await reportStore.fetchNextPage(token);
  syncFromStore();
}

/* ===== Mounted: 모든 데이터 로드 ===== */
onMounted(async () => {
  const token = localStorage.getItem('token');
  const userId = undefined; // 필요 시 연결

  // 1) 캘린더 2주 생성
  calendarDays.value = generateTwoWeeksAlignedToSunday(today);

  // 2) 2주 일정 로드 (지급/상환/만기)
  {
    const start = calendarDays.value[0].date;
    const end = calendarDays.value.at(-1).date;
    const rows = await getTwoWeekSchedule({ start, end, userId }, token); // catch 내장: 실패 시 []
    const byDate = rows.reduce((acc, r) => {
      const ev = mapEvent(r);
      if (!ev.date) return acc;
      (acc[ev.date] ||= []).push(ev);
      return acc;
    }, {});
    calendarDays.value = calendarDays.value.map(d => ({
      ...d,
      events: byDate[d.date] || [],
    }));
  }

  // 3) 이번달 요약
  {
    const month = monthStr(today);
    const s = await getMonthlySummary({ month, userId }, token); // {supportTotal, repayTotal}
    monthlyBenefit.value = Number(s.supportTotal || 0);
    monthlyPayment.value = Number(s.repayTotal || 0);
    reportStore.summary = s; // 스토어에도 반영(선택)
  }

  // 4) 그래프(최근 6개월)
  {
    const endM = monthStr(today);
    const startD = new Date(today);
    startD.setMonth(startD.getMonth() - 5);
    const startM = monthStr(startD);
    const trend = await getIncomeExpenseTrend(
      { from: startM, to: endM, userId },
      token
    ); // [] fallback
    reportStore.trend = trend;

    // 라벨/시리즈 세팅
    trendLabels.value = trend.map(r => {
      const m = (r.month || '').split('-')[1];
      return (m ? Number(m) : '').toString() + '월';
    });
    policySeries.value = trend.map(r => Number(r.policyIncome || 0));
    loanSeries.value = trend.map(r => Number(r.loanRepay || 0));
  }

  // 5) 대시보드(정책/대출 리스트 등)
  {
    const data = await getDashboard({ page: 0, size: 20 }, token);
    reportStore.summary = data.summary;
    reportStore.policy = data.policy;
    reportStore.loan = data.loan;
    reportStore.page = 0;
    reportStore.size = 20;
    reportStore.hasNext = !!data.hasNext;

    syncFromStore(); // 리스트/보조 시리즈 반영
  }
});
</script>
