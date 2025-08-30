<template>
  <div
    class="mb-4 grid grid-cols-12 items-center gap-3 rounded-xl border border-neutral-100 bg-white p-3"
  >
    <!-- 검색 -->
    <div class="col-span-12 md:col-span-4">
      <label class="sr-only">검색</label>
      <div
        class="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2"
      >
        <svg
          class="size-4 text-neutral-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="7" stroke-width="2"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-width="2"></line>
        </svg>
        <input
          v-model="q"
          type="text"
          placeholder="상품명 · 기관명 검색"
          class="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
        />
      </div>
    </div>

    <!-- 월 선택 -->
    <div class="col-span-6 md:col-span-2">
      <div
        class="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2"
      >
        <button class="p-1" aria-label="이전 달" @click="prevMonth">‹</button>
        <span class="text-sm font-bold">{{ ym }}</span>
        <button class="p-1" aria-label="다음 달" @click="nextMonth">›</button>
      </div>
    </div>

    <!-- 상태 퀵필터 -->
    <div class="col-span-6 flex flex-wrap items-center gap-2 md:col-span-4">
      <button
        v-for="s in statuses"
        :key="s.key"
        class="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs font-bold"
        :class="{
          'bg-white ring-2 ring-info/40 ring-offset-1': modelValue === s.key,
        }"
        @click="emit('update:status', s.key)"
      >
        <span class="size-2.5 rounded-full" :style="{ background: s.color }" />
        {{ s.label }}
      </button>
    </div>

    <!-- 액션 -->
    <div class="col-span-12 flex justify-end gap-2 md:col-span-2">
      <button
        class="h-9 rounded-[10px] bg-primary-alt px-4 text-xs font-black text-neutral-900"
        @click="emit('open:filters')"
      >
        모든 필터
      </button>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: 'all' }, // status
  year: { type: Number, default: dayjs().year() },
  month: { type: Number, default: dayjs().month() + 1 }, // 1~12
});
const emit = defineEmits([
  'update:status',
  'update:year',
  'update:month',
  'open:filters',
]);

const q = ref('');
const statuses = [
  { key: 'active', label: '접수중', color: '#0EA5E9' },
  { key: 'due', label: '마감임박', color: '#FFBC00' },
  { key: 'upcoming', label: '예정', color: '#004DA9' },
  { key: 'closed', label: '마감', color: '#4B5563' },
];

const ym = computed(
  () => `${props.year}.${String(props.month).padStart(2, '0')}`
);
function prevMonth() {
  let y = props.year,
    m = props.month - 1;
  if (m < 1) {
    y--;
    m = 12;
  }
  emit('update:year', y);
  emit('update:month', m);
}
function nextMonth() {
  let y = props.year,
    m = props.month + 1;
  if (m > 12) {
    y++;
    m = 1;
  }
  emit('update:year', y);
  emit('update:month', m);
}
</script>
