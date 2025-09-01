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
import { ref, computed, onMounted, nextTick } from 'vue';
import ReportHeader from '@/components/report/ReportHeader.vue';
import TwoWeekCalendar from '@/components/report/TwoWeekCalendar.vue';
import MonthlySummary from '@/components/report/MonthlySummary.vue';
import CashflowChart from '@/components/report/CashflowChart.vue';
import ReportList from '@/components/report/ReportList.vue';
import RegisterModal from '@/components/report/RegisterModal.vue';

/* ===== 헤더 버튼/모달 ===== */
const showPolicyModal = ref(false);
const onClickLoan = () => {
  // TODO: 대출 등록 모달 연결 예정
  console.log('대출 등록 버튼 클릭');
};

/* ===== 탭/정렬/확장 ===== */
const activeTab = ref('all'); // all | loan | policy | expired
const sortBy = ref('name'); // name | date | alphabet
const expandedItems = ref([]);

/* ===== 요약/차트(데모) ===== */
const monthlyBenefit = ref(2_500_000);
const monthlyPayment = ref(850_000);
const policySeries = ref([150000, 220000, 350000, 220000, 250000]);
const loanSeries = ref([85000, 90000, 95000, 85000, 90000]);

/* ===== 달력 ===== */
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayISO = ref(toISO(today));
const calendarDays = ref([]);

onMounted(() => {
  calendarDays.value = generateTwoWeeksAlignedToSunday(today);
  seedDemoCalendar(calendarDays.value); // 데모 이벤트 한두 개
  enrichSeededEvents(calendarDays.value, items.value); // [추가] 데모 이벤트에 detail 주입
});

/* ===== 리스트 데이터 ===== */
const items = ref([
  // policy
  {
    id: 101,
    type: 'policy',
    name: '청년 창업 지원금',
    startDate: '2024-01-15',
    endDate: '2024-12-15',
    totalAmount: 5_000_000,
    monthlyAmount: 500_000,
    status: 'active',
  },
  {
    id: 102,
    type: 'policy',
    name: '중소기업 성장지원금',
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    totalAmount: 8_000_000,
    monthlyAmount: 800_000,
    status: 'active',
  },
  // loan
  {
    id: 201,
    type: 'loan',
    name: '주택담보대출',
    startDate: '2023-06-01',
    endDate: '2033-05-31',
    totalAmount: 200_000_000,
    repaymentMethod: '분할상환',
    totalPayments: 120,
    completedPayments: 18,
    paidAmount: 30_000_000,
    interestRate: '3.5',
    status: 'active',
  },
  {
    id: 202,
    type: 'loan',
    name: '사업자금대출',
    startDate: '2024-01-01',
    endDate: '2029-12-31',
    totalAmount: 50_000_000,
    repaymentMethod: '원리금균등',
    totalPayments: 72,
    completedPayments: 8,
    paidAmount: 6_000_000,
    interestRate: '4.2',
    status: 'active',
  },
  // ✅ 만료된 정책
  {
    id: 5,
    type: 'policy',
    name: '청년 주거안정 지원금',
    startDate: '2023-02-01',
    endDate: '2023-07-31',
    totalAmount: 3_600_000,
    monthlyAmount: 600_000,
    status: 'expired',
  },
  // ✅ 만료된 대출
  {
    id: 6,
    type: 'loan',
    name: '전세자금대출',
    startDate: '2022-01-01',
    endDate: '2023-06-30',
    totalAmount: 30_000_000,
    repaymentMethod: '만기일시',
    paidAmount: 30_000_000,
    interestRate: 2.8,
    status: 'expired',
  },
]);

/* 정책 검색 즐겨찾기(모달용) – 정책만 */
const policyFavorites = ref([
  { id: 'pf-1', type: 'policy', name: '중소기업 성장지원금' },
  { id: 'pf-2', type: 'policy', name: '청년 창업 지원금' },
  { id: 'pf-3', type: 'policy', name: '소상공인 경영안정자금' },
]);

/* 탭 */
const tabs = [
  { key: 'all', label: '전체' },
  { key: 'loan', label: '대출' },
  { key: 'policy', label: '정책' },
  { key: 'expired', label: '만료' },
];

/* 필터 + 정렬 */
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

/* 행 토글 */
const toggleDetail = id => {
  const i = expandedItems.value.indexOf(id);
  if (i > -1) expandedItems.value.splice(i, 1);
  else expandedItems.value.push(id);
};

/* 상세보기 버튼 (placeholder) */
const openLoanDetail = item => console.log('대출 상세보기', item);
const openPolicyDetail = item => console.log('정책 상세보기', item);

/* ===== 정책 등록 처리 =====
   RegisterModal에서 emit('register', { selected, form }) 형태로 전달됨.
   form 예상 키:
   - periodStart, periodEnd (기간)
   - paymentDay (지급일: 매월 n일)
   - paymentDate (지급날짜: 실제 최초 지급일 선택)
   - totalAmount, monthlyAmount
*/
const handlePolicyRegister = async ({ selected, form }) => {
  // 신규 아이템 생성
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

  // 캘린더 이벤트 주입(선택한 지급날짜가 있으면)
  if (form?.paymentDate) {
    addCalendarEvent(calendarDays.value, {
      date: form.paymentDate,
      title: '지급일',
      type: 'payment',
    });
  }

  showPolicyModal.value = false;
  await nextTick();
  activeTab.value = 'policy'; // 정책 탭으로 이동
};

/* ===== 유틸 ===== */
function toISO(d) {
  return new Date(d).toISOString().split('T')[0];
}
function toNumber(v) {
  if (v == null) return 0;
  if (typeof v === 'number') return v;
  return Number(String(v).replaceAll(',', '')) || 0;
}

function generateTwoWeeksAlignedToSunday(baseDate) {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const start = new Date(baseDate);
  start.setHours(0, 0, 0, 0);
  const sunday = new Date(start);
  sunday.setDate(start.getDate() - start.getDay());
  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    days.push({
      date: toISO(d),
      day: d.getDate(),
      dayName: dayNames[d.getDay()],
      events: [],
    });
  }
  return days;
}
function addCalendarEvent(days, { date, title, type }) {
  const idx = days.findIndex(d => d.date === date);
  if (idx !== -1) {
    days[idx].events.push({ id: `ev-${Date.now()}`, title, type });
  }
}
function seedDemoCalendar(days) {
  // 예시: 이번주 수요일 지급일, 다음주 화요일 상환일
  const firstWed = days.find(d => new Date(d.date).getDay() === 3);
  if (firstWed)
    firstWed.events.push({ id: 'demo-p1', title: '지급일', type: 'payment' });
  const secondTue = days.find(
    (d, i) => i >= 7 && new Date(d.date).getDay() === 2
  );
  if (secondTue)
    secondTue.events.push({
      id: 'demo-l1',
      title: '상환일',
      type: 'repayment',
    });
}

/* ====== [추가] 데모 이벤트 detail 주입 ====== */
/**
 * seedDemoCalendar가 넣은 '지급일'(payment) / '상환일'(repayment) 이벤트에
 * 툴팁에서 사용할 detail을 덧붙인다. (기존 이벤트는 제거/변경하지 않음)
 */
function enrichSeededEvents(days, itemList) {
  // 1) 이번 주 수요일 '지급일' detail
  const firstWed = days.find(d => new Date(d.date).getDay() === 3);
  if (firstWed) {
    const payEv = firstWed.events?.find(
      ev => ev?.type === 'payment' || ev?.type === 'policy'
    );
    if (payEv && !payEv.detail) {
      const policy =
        itemList.find(
          i => i.type === 'policy' && i.name.includes('중소기업 성장지원금')
        ) || itemList.find(i => i.type === 'policy');
      payEv.detail = {
        name: policy?.name || '정책',
        startDate: policy?.startDate ?? days[0]?.date,
        endDate: policy?.endDate ?? days[days.length - 1]?.date,
        amount: policy?.monthlyAmount ?? policy?.totalAmount ?? 0,
        status: policy?.status ?? 'active',
        paymentDate: firstWed.date,
      };
      // 타입은 그대로 두되, 필요하면 아래 주석 해제
      // if (payEv.type !== 'policy' && payEv.type !== 'repayment') payEv.type = 'policy';
    }
  }

  // 2) 다음 주 화요일 '상환일' detail
  const secondTue = days.find(
    (d, i) => i >= 7 && new Date(d.date).getDay() === 2
  );
  if (secondTue) {
    const repayEv = secondTue.events?.find(ev => ev?.type === 'repayment');
    if (repayEv && !repayEv.detail) {
      const loan =
        itemList.find(
          i => i.type === 'loan' && i.name.includes('주택담보대출')
        ) || itemList.find(i => i.type === 'loan');
      repayEv.detail = {
        name: loan?.name || '대출',
        startDate: loan?.startDate ?? days[0]?.date,
        endDate: loan?.endDate ?? days[days.length - 1]?.date,
        amount:
          Math.round((loan?.totalAmount ?? 0) / (loan?.totalPayments ?? 1)) ||
          0, // 월 상환액 예시
        status: loan?.status ?? 'active',
        repaymentRate: safeRate(loan?.completedPayments, loan?.totalPayments), // 0~1
        repaymentMethod: loan?.repaymentMethod ?? '—',
        interestRate: loan?.interestRate ?? '—',
      };
    }
  }
}

/* 보조: 상환율 0~1 계산 */
function safeRate(done, total) {
  if (!total) return 0;
  const r = Number(done || 0) / Number(total);
  return isFinite(r) ? Math.max(0, Math.min(1, r)) : 0;
}
</script>
