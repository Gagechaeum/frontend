<template>
  <div>
    <ScheduleToolbar
      v-model="status"
      :year="year"
      :month="month"
      @update:year="v => (year = v)"
      @update:month="v => (month = v)"
      @open:filters="openFilters"
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
              {{ row.org }} · {{ row.period }}
            </p>
          </div>

          <div class="col-span-6 md:col-span-2">
            <span
              class="inline-flex items-center gap-2 text-xs font-bold text-neutral-700"
            >
              <span
                class="size-2.5 rounded-full"
                :style="{ background: row.ddayColor }"
              />
              {{ row.dday }}
            </span>
          </div>

          <div class="col-span-6 flex flex-wrap gap-2 md:col-span-3">
            <span
              v-for="t in row.tags"
              :key="t"
              class="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700"
            >
              {{ t }}
            </span>
          </div>

          <div class="col-span-12 flex justify-end gap-2 md:col-span-1">
            <button
              class="h-7 rounded-[10px] bg-primary-alt px-3 text-[12px] font-black text-neutral-900"
            >
              자세히
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ScheduleToolbar from '@/components/schedule/ScheduleToolbar.vue';

const status = ref('all');
const year = ref(2025);
const month = ref(8);

const rows = [
  {
    id: 1,
    title: '청년 창업 자금 대출',
    org: 'KB국민은행',
    period: '2025.08.01 ~ 08.31',
    dday: 'D-6',
    ddayColor: '#004DA9',
    tags: ['서울', '서비스업', '청년'],
  },
  {
    id: 2,
    title: '소상공인 경영안정 자금',
    org: '소상공인시장진흥공단',
    period: '2025.07.15 ~ 08.25',
    dday: 'D-2',
    ddayColor: '#FFBC00',
    tags: ['전국', '소매업', '전연령'],
  },
  {
    id: 3,
    title: '중소기업 운영자금 대출',
    org: '신한은행',
    period: '2025.09.01 ~ 09.30',
    dday: 'D-20',
    ddayColor: '#004DA9',
    tags: ['부산', '제조업', '전체'],
  },
];

function openFilters() {
  alert('모든 필터 모달(추후 연결)');
}
</script>
