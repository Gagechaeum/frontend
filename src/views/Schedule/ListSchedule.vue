<!-- src/views/Schedule/ListSchedule.vue -->
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
          class="grid grid-cols-12 items-center gap-3 px-4 py-3"
        >
          <div class="col-span-12 md:col-span-6">
            <p class="text-sm font-bold">{{ row.title }}</p>
            <p class="text-xs text-neutral-600">
              {{ row.org }} · 접수기간 {{ fmtPeriod(row.period) }}
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
            <StarToggle
              :active="fav.has(row.id)"
              @toggle="fav.toggle(row.id)"
            />
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
import { useScheduleFilters } from '@/stores/scheduleFilters';
import { useFavorites } from '@/stores/favorites';
import { fetchPolicies } from '@/stores/policies';
import { fmtPeriod, stateText, stateColor } from '@/utils/schedule';

const filters = useScheduleFilters();
const fav = useFavorites();

const status = ref('all');
const year = ref(2025);
const month = ref(8);
const query = ref('');
const showFilters = ref(false);
const rows = ref([]);

onMounted(() => {
  filters.load();
  fav.load();
});
watch([() => filters.activeCriteria, query, status, year, month], loadList, {
  immediate: true,
});

async function loadList() {
  rows.value = await fetchPolicies({
    q: query.value,
    status: status.value,
    year: year.value,
    month: month.value,
    ...filters.activeCriteria,
  });
}
</script>
