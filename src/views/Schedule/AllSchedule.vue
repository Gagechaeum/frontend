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
          class="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-neutral-600"
        >
          <div v-for="d in daysKo" :key="d" class="py-2">{{ d }}</div>
        </div>
        <div class="mt-1 grid grid-cols-7 gap-2">
          <button
            v-for="cell in cells"
            :key="cell.key"
            class="min-h-[88px] rounded-lg border border-neutral-200 p-2 text-left"
            :class="
              selectedDate === cell.date ? 'ring-2 ring-brand-blue-royal' : ''
            "
            @click="selectDate(cell.date)"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-neutral-600">{{
                cell.day || ''
              }}</span>
              <span
                v-if="today === cell.date"
                class="h-1 w-6 rounded-full bg-brand-blue-royal"
              />
            </div>
            <ul class="mt-1 space-y-1">
              <li
                v-for="(e, idx) in cell.events"
                :key="idx"
                class="flex items-center gap-2"
              >
                <span
                  class="inline-block size-1.5 rounded-full"
                  :style="{ background: e.color }"
                />
                <span class="truncate text-xs font-semibold text-neutral-900">{{
                  e.title
                }}</span>
              </li>
            </ul>
          </button>
        </div>
      </section>

      <!-- 우측: 선택한 날짜 항목 -->
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
                {{ item.org }} · {{ fmtPeriod(item) }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <StarToggle
                :active="fav.has(item.id)"
                @toggle="fav.toggle(item.id)"
              />
              <button
                class="h-7 rounded-[10px] bg-brand-blue-royal px-3 text-[12px] font-bold text-white"
              >
                자세히
              </button>
            </div>
          </li>
        </ul>
        <p v-else class="text-sm text-neutral-500">
          선택한 날짜의 항목이 없습니다.
        </p>
      </aside>
    </div>

    <SavedFiltersModal :open="showFilters" @close="showFilters = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import ScheduleToolbar from '@/components/schedule/ScheduleToolbar.vue';
import StarToggle from '@/components/schedule/StarToggle.vue';
import SavedFiltersModal from '@/components/schedule/SavedFiltersModal.vue';
import { useScheduleFilters } from '@/stores/scheduleFilters';
import { useFavorites } from '@/stores/favorites';
import { fetchPoliciesByDay } from '@/stores/policies';

const filters = useScheduleFilters();
const fav = useFavorites();

const daysKo = ['일', '월', '화', '수', '목', '금', '토'];
const status = ref('all');
const year = ref(2025);
const month = ref(8);
const query = ref('');
const selectedDate = ref('');
const showFilters = ref(false);

onMounted(() => {
  filters.load();
  fav.load();
});

const today = '2025-08-15'; // 데모
const cells = computed(() => {
  const length = 42; // 6주 그리드
  return Array.from({ length }, (_, i) => {
    const d = i + 1 <= 31 ? i + 1 : null;
    const date = d ? `2025-08-${String(d).padStart(2, '0')}` : null;
    const events =
      d && [1, 5, 12, 19, 24].includes(d)
        ? [{ title: '항목', color: '#0EA5E9' }]
        : [];
    return { key: i, day: d, date, events };
  });
});

function selectDate(date) {
  selectedDate.value = date;
}
const dailyItems = ref([]);
watch([selectedDate, () => filters.activeCriteria, query, status], loadDaily);
async function loadDaily() {
  if (!selectedDate.value) {
    dailyItems.value = [];
    return;
  }
  dailyItems.value = await fetchPoliciesByDay(selectedDate.value, {
    q: query.value,
    status: status.value,
    year: year.value,
    month: month.value,
    ...filters.activeCriteria,
  });
}
function fmtPeriod(it) {
  const s = it.period?.start?.slice(5).replace('-', '.');
  const e = it.period?.end?.slice(5).replace('-', '.');
  return s && e ? `${s} ~ ${e}` : '';
}
</script>
