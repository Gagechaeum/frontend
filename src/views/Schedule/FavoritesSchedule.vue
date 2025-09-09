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

    <section class="rounded-xl border border-neutral-100 bg-white">
      <div class="flex items-center justify-between px-4 py-3">
        <p class="text-xs font-bold text-neutral-700">총 {{ rows.length }}건</p>
      </div>

      <ul class="divide-y divide-neutral-100">
        <li
          v-for="row in rows"
          :key="row.id"
          class="grid grid-cols-12 items-center gap-x-4 gap-y-2 px-4 py-3"
        >
          <!-- 제목/기관 -->
          <div class="col-span-12 min-w-0 md:col-span-6">
            <p class="truncate text-sm font-bold">{{ row.title }}</p>
            <p class="truncate text-xs text-neutral-600">
              {{ row.org }} · {{ fmtPeriod(row.period) }}
            </p>
          </div>

          <!-- 진행 상태 -->
          <div class="col-span-12 md:col-span-2">
            <span
              class="inline-flex items-center gap-2 text-xs font-bold text-neutral-700"
            >
              <span
                class="size-2.5 rounded-full"
                :style="{ background: stateColor(row.status) }"
              />
              {{ stateText(row.status) }}
            </span>
          </div>

          <!-- 태그 -->
          <div class="col-span-12 min-w-0 md:col-span-3">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="t in tagsOf(row)"
                :key="t"
                class="rounded-full border border-neutral-200 px-2 py-0.5 text-xs font-semibold text-neutral-700"
              >
                {{ t }}
              </span>
            </div>
          </div>

          <!-- 액션(⭐ + 자세히) : 우측 끝, 고정 폭/줄바꿈 방지 -->
          <div
            class="col-span-12 flex items-center justify-end gap-2 md:col-span-1"
          >
            <StarToggle
              class="shrink-0"
              :active="fav.has(row.id)"
              @toggle="onToggleFav(row)"
            />
            <button
              class="h-8 shrink-0 whitespace-nowrap rounded-[10px] bg-primary-alt px-3 text-xs font-black leading-none text-neutral-900"
              aria-label="자세히"
            >
              자세히
            </button>
          </div>
        </li>
      </ul>
    </section>

    <SavedFiltersModal :open="showFilters" @close="showFilters = false" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import dayjs from 'dayjs';
import ScheduleToolbar from '@/components/schedule/ScheduleToolbar.vue';
import StarToggle from '@/components/schedule/StarToggle.vue';
import SavedFiltersModal from '@/components/schedule/SavedFiltersModal.vue';
import { useFavorites } from '@/stores/favorites';
import { useScheduleFilters } from '@/stores/scheduleFilters';
import { fetchSchedule } from '@/stores/scheduleData';
import { fmtPeriod, stateText, stateColor } from '@/utils/schedule';

const status = ref('all');
const year = ref(Number(dayjs().format('YYYY')));
const month = ref(Number(dayjs().format('MM')));
const query = ref('');
const showFilters = ref(false);

const rows = ref([]);

const fav = useFavorites();
const filters = useScheduleFilters();

onMounted(() => {
  fav.load?.();
  filters.load?.();
});

watch(
  [
    () => filters.activeCriteria,
    query,
    status,
    year,
    month,
    () => fav.ids.value,
  ],
  loadFavs,
  { immediate: true }
);

function tagsOf(row) {
  return Array.isArray(row?.tags) ? row.tags : [];
}

function onToggleFav(row) {
  fav.toggle(row.id, { title: row.title, org: row.org });
}

async function loadFavs() {
  const all = await fetchSchedule({
    q: query.value,
    status: status.value,
    year: year.value,
    month: month.value,
    ...filters.activeCriteria,
  });
  rows.value = all.filter(it => fav.has(it.id));
}
</script>
