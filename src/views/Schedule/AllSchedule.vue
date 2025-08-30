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

    <div class="grid grid-cols-12 gap-4">
      <!-- 캘린더 -->
      <section
        class="col-span-12 rounded-xl border border-neutral-100 bg-white p-3 lg:col-span-8"
      >
        <div class="mb-2 flex items-center gap-2">
          <h3 class="text-h4 text-brand-blue-royal">
            {{ year }}년 {{ pad(month) }}월
          </h3>
        </div>

        <div
          class="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-neutral-600"
        >
          <div v-for="d in daysKo" :key="d" class="py-2">{{ d }}</div>
        </div>

        <div class="mt-1 grid grid-cols-7 gap-2">
          <div
            v-for="(cell, i) in cells"
            :key="i"
            class="min-h-[88px] rounded-lg border border-neutral-200 p-2"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-neutral-600">{{
                cell.day || ''
              }}</span>
              <span
                v-if="isToday(cell)"
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
          </div>
        </div>
      </section>

      <!-- 우측 리스트 -->
      <aside
        class="col-span-12 rounded-xl border border-neutral-100 bg-white p-3 lg:col-span-4"
      >
        <div class="mb-2 flex items-baseline justify-between">
          <h4 class="text-h4">{{ year }}.{{ pad(month) }}.15 (금) · 3건</h4>
        </div>
        <ul class="divide-y divide-neutral-100">
          <li
            v-for="item in sideItems"
            :key="item.id"
            class="flex items-center justify-between py-3"
          >
            <div>
              <p class="text-sm font-bold">{{ item.title }}</p>
              <p class="text-xs text-neutral-600">
                {{ item.org }} · {{ item.period }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="h-7 rounded-[10px] bg-brand-blue-royal px-3 text-[12px] font-bold text-white"
              >
                자세히
              </button>
              <button
                class="h-7 rounded-[10px] border border-neutral-300 bg-white px-3 text-[12px] font-semibold text-neutral-700"
              >
                공유
              </button>
            </div>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ScheduleToolbar from '@/components/schedule/ScheduleToolbar.vue';

const status = ref('all');
const year = ref(2025);
const month = ref(8);

const daysKo = ['일', '월', '화', '수', '목', '금', '토'];
const pad = n => String(n).padStart(2, '0');

const mockEvents = {
  1: [{ title: '청년 창업 자금 대출', color: '#0EA5E9' }],
  5: [{ title: '소상공인 경영안정 자금', color: '#FFBC00' }],
  12: [{ title: '중소기업 운영자금', color: '#004DA9' }],
  19: [{ title: '디지털 전환 바우처', color: '#0EA5E9' }],
  24: [{ title: '지역 재도약 패키지', color: '#4B5563' }],
};

const cells = computed(() => {
  const arr = Array.from({ length: 42 }, (_, i) => {
    const day = i + 1 <= 31 ? i + 1 : null;
    return { day, events: day && mockEvents[day] ? mockEvents[day] : [] };
  });
  return arr;
});

const today = { y: 2025, m: 8, d: 15 };
const isToday = cell => cell.day === today.d;

const sideItems = [
  {
    id: 1,
    title: '청년 창업 자금 대출',
    org: 'KB국민은행',
    period: '08.01 ~ 08.31',
  },
  {
    id: 2,
    title: '소상공인 경영안정 자금',
    org: '소상공인시장진흥공단',
    period: '07.15 ~ 08.25',
  },
  {
    id: 3,
    title: '디지털 전환 바우처',
    org: '중소벤처기업부',
    period: '08.05 ~ 09.10',
  },
];

function openFilters() {
  alert('모든 필터 모달(추후 연결)');
}
</script>
