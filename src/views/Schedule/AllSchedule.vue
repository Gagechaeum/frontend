<template>
  <div>
    <ScheduleToolbar
      v-model="status"
      :year="year"
      :month="month"
      :query="query"
      @update:year="v => (year = v)"
      @update:month="v => (month = v)"
      @update:query="v => (query = v)"
      @open:filters="showFilters = true"
    />

    <div class="grid grid-cols-12 gap-4">
      <!-- 캘린더 -->
      <section
        class="col-span-12 rounded-xl border border-neutral-100 bg-white p-3 lg:col-span-8"
      >
        <div
          class="grid grid-cols-7 text-center text-xs font-bold text-neutral-500"
        >
          <div v-for="d in daysKo" :key="d" class="py-2">{{ d }}</div>
        </div>
        <div class="mt-1 grid grid-cols-7 gap-2">
          <button
            v-for="cell in cells"
            :key="cell.key"
            class="min-h-[88px] rounded-lg border border-neutral-200 p-2 text-left"
            :class="
              cell.date && selectedDate === cell.date
                ? 'ring-2 ring-blue-600'
                : ''
            "
            :disabled="!cell.date"
            @click="cell.date && selectDate(cell.date)"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-neutral-600">{{
                cell.day || ''
              }}</span>
              <span
                v-if="today === cell.date"
                class="h-1 w-6 rounded-full bg-blue-600"
              />
            </div>
            <ul class="mt-1 space-y-1">
              <li
                v-for="(e, idx) in cell.events"
                :key="idx"
                class="flex items-center gap-2"
              >
                <span class="inline-block size-1.5 rounded-full" />
                <span class="truncate text-[11px] text-neutral-700">{{
                  e.title
                }}</span>
              </li>
            </ul>
            <p v-if="cell.more > 0" class="mt-1 text-[11px] text-neutral-400">
              +{{ cell.more }}개 더
            </p>
          </button>
        </div>
      </section>

      <!-- 우측: 선택 날짜 항목 -->
      <aside
        class="col-span-12 rounded-xl border border-neutral-100 bg-white p-3 lg:col-span-4"
      >
        <div class="mb-2 flex items-baseline justify-between">
          <h4 class="text-h4">{{ selectedDate || '날짜를 선택하세요' }}</h4>
        </div>
        <ul v-if="dailyItems.length" class="divide-y divide-neutral-100">
          <li
            v-for="item in dailyItems"
            :key="item.id"
            class="flex items-center justify-between py-3"
          >
            <div>
              <p class="text-sm font-bold">{{ item.title }}</p>
              <p class="text-xs text-neutral-600">
                {{ item.org }} · {{ fmtPeriod(item.period) }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <StarToggle
                :active="fav.has(item.id)"
                @toggle="fav.toggle(item.id)"
              />
              <button
                class="h-7 rounded-[10px] bg-primary-alt px-3 text-[12px] font-black text-neutral-900"
              >
                자세히
              </button>
            </div>
          </li>
        </ul>
        <div v-else class="py-10 text-center text-sm text-neutral-500">
          선택한 날짜의 항목이 없어요
        </div>
      </aside>
    </div>

    <SavedFiltersModal :open="showFilters" @close="showFilters = false" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import dayjs from 'dayjs';
import ScheduleToolbar from '@/components/schedule/ScheduleToolbar.vue';
import StarToggle from '@/components/schedule/StarToggle.vue';
import SavedFiltersModal from '@/components/schedule/SavedFiltersModal.vue';
import { useScheduleFilters } from '@/stores/scheduleFilters';
import { useFavorites } from '@/stores/favorites';
import { fetchSchedule, fetchScheduleByDay } from '@/stores/scheduleData';
import { fmtPeriod } from '@/utils/schedule';

const filters = useScheduleFilters();
const fav = useFavorites();

const daysKo = ['일', '월', '화', '수', '목', '금', '토'];
const today = dayjs().format('YYYY-MM-DD');

const status = ref('all');
const year = ref(Number(dayjs().format('YYYY')));
const month = ref(Number(dayjs().format('MM')));
const query = ref('');
const showFilters = ref(false);

// 월 전체 데이터
const monthItems = ref([]);

const firstDay = computed(() =>
  dayjs(`${year.value}-${String(month.value).padStart(2, '0')}-01`).day()
);
const daysInMonth = computed(() =>
  dayjs(
    `${year.value}-${String(month.value).padStart(2, '0')}-01`
  ).daysInMonth()
);

const cells = computed(() => {
  const total = 42; // 6주
  const res = [];
  for (let i = 0; i < total; i++) {
    const inMonth =
      i >= firstDay.value && i < firstDay.value + daysInMonth.value;
    if (!inMonth) {
      res.push({
        key: `empty-${i}`,
        day: null,
        date: null,
        events: [],
        more: 0,
      });
      continue;
    }
    const dayNum = i - firstDay.value + 1;
    const date = `${year.value}-${String(month.value).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const matches = monthItems.value.filter(it => {
      const s = dayjs(it.period?.start);
      const e = dayjs(it.period?.end).endOf('day');
      const cur = dayjs(date);
      return (
        cur.isValid() &&
        s.isValid() &&
        e.isValid() &&
        (cur.isAfter(s) || cur.isSame(s, 'day')) &&
        (cur.isBefore(e) || cur.isSame(e, 'day'))
      );
    });
    const shown = matches.slice(0, 3).map(it => ({ title: it.title }));
    const more = Math.max(0, matches.length - shown.length);
    res.push({ key: `${date}-${i}`, day: dayNum, date, events: shown, more });
  }
  return res;
});

const selectedDate = ref(null);
const dailyItems = ref([]);

function selectDate(date) {
  selectedDate.value = date;
}

async function loadMonth() {
  monthItems.value = await fetchSchedule({
    q: query.value,
    status: status.value,
    year: year.value,
    month: month.value,
    ...filters.activeCriteria,
  });
}

async function loadDaily() {
  if (!selectedDate.value) {
    dailyItems.value = [];
    return;
  }
  dailyItems.value = await fetchScheduleByDay(selectedDate.value, {
    q: query.value,
    status: status.value,
    year: year.value,
    month: month.value,
    ...filters.activeCriteria,
  });
}

onMounted(() => {
  filters.load?.();
  fav.load?.();
  // 현재 달이면 오늘 날짜 기본 선택
  const t = dayjs();
  const sameMonth = t.year() === year.value && t.month() + 1 === month.value;
  if (sameMonth) selectedDate.value = t.format('YYYY-MM-DD');
});

watch(
  [() => filters.activeCriteria, query, status, year, month],
  async () => {
    await loadMonth();
    if (selectedDate.value) await loadDaily();
  },
  { immediate: true }
);

watch(selectedDate, loadDaily);
</script>
