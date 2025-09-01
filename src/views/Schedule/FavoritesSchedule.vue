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
        <p class="text-xs font-bold text-neutral-700">
          즐겨찾기 · {{ rows.length }}
        </p>
      </div>

      <ul class="divide-y divide-neutral-100">
        <li
          v-for="row in rows"
          :key="row.id"
          class="grid grid-cols-12 items-center gap-3 px-4 py-3"
        >
          <div class="col-span-12 md:col-span-6">
            <p class="text-sm font-bold">{{ row.title }}</p>
            <p class="text-xs text-neutral-600">
              {{ row.org }} · {{ fmtPeriod(row) }}
            </p>
          </div>
          <div class="col-span-6 md:col-span-3">
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
          <div class="col-span-6 flex items-center gap-2 md:col-span-2">
            <StarToggle :active="true" @toggle="fav.remove(row.id)" />
            <span
              v-for="t in row.tags"
              :key="t"
              class="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700"
              >{{ t }}</span
            >
          </div>
          <div class="col-span-12 flex justify-end md:col-span-1">
            <button
              class="h-7 rounded-[10px] bg-primary-alt px-3 text-[12px] font-black text-neutral-900"
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
import { ref, onMounted, watch } from 'vue';
import ScheduleToolbar from '@/components/schedule/ScheduleToolbar.vue';
import StarToggle from '@/components/schedule/StarToggle.vue';
import SavedFiltersModal from '@/components/schedule/SavedFiltersModal.vue';
import { useFavorites } from '@/stores/favorites';
import { useScheduleFilters } from '@/stores/scheduleFilters';
import { fetchPoliciesByIds } from '@/stores/policies';

const status = ref('all');
const year = ref(2025);
const month = ref(8);
const query = ref('');
const showFilters = ref(false);

const fav = useFavorites();
const filters = useScheduleFilters();

const rows = ref([]);

onMounted(() => {
  fav.load();
  filters.load();
});
watch(
  [() => fav.ids.slice(), () => filters.activeCriteria, query, status],
  loadFavs,
  { immediate: true }
);

async function loadFavs() {
  rows.value = await fetchPoliciesByIds(fav.ids, {
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
function stateText(s) {
  return s === 'active'
    ? '접수중'
    : s === 'due'
      ? '마감임박'
      : s === 'upcoming'
        ? '예정'
        : '마감';
}
function stateColor(s) {
  return s === 'active'
    ? '#0EA5E9'
    : s === 'due'
      ? '#FFBC00'
      : s === 'upcoming'
        ? '#004DA9'
        : '#4B5563';
}
</script>
