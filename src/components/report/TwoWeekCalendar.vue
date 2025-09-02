<template>
  <div :class="gridClass">
    <div v-for="day in days" :key="day.date" class="text-center">
      <!-- 요일 -->
      <div class="mb-1 text-xs text-gray-500">{{ day.dayName }}</div>

      <!-- 날짜: 오늘 동그라미 -->
      <div class="mb-2 text-sm font-medium text-gray-900">
        <span
          v-if="today && day.date === today"
          class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600"
        >
          {{ day.day }}
        </span>
        <span v-else>{{ day.day }}</span>
      </div>

      <!-- 일정 라벨 + 툴팁 -->
      <div class="space-y-1">
        <BottomPopover
          v-for="event in day.events"
          :key="event.id || `${day.date}-${event.title}`"
          :label="`${anchorText(event)} — ${event.detail?.name || event.title}`"
        >
          <!-- 앵커(달력에 보이는 라벨) : '지급일 / 상환일' -->
          <template #anchor>
            <span
              :class="getEventClass(event.type)"
              class="inline-block cursor-pointer rounded px-1 py-0.5 text-xs hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {{ anchorText(event) }}
            </span>
          </template>

          <!-- 팝오버 콘텐츠 (헤더 + 표) -->
          <div class="space-y-2">
            <!-- ✅ 제목 + 오른쪽 배지 -->
            <div class="mb-1 flex items-center justify-between">
              <h4 class="truncate text-sm font-bold text-gray-900">
                {{ event.detail?.name || event.title }}
              </h4>
              <span
                class="ml-2 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
                :class="
                  event.type === 'repayment'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-800'
                "
              >
                {{ event.type === 'repayment' ? '대출' : '정책' }}
              </span>
            </div>

            <dl class="grid grid-cols-2 gap-2 text-[13px]">
              <div>
                <dt class="text-gray-500">기간</dt>
                <dd class="font-medium text-gray-900">
                  {{ safe(event.detail?.startDate) }} ~
                  {{ safe(event.detail?.endDate) }}
                </dd>
              </div>
              <div>
                <dt class="text-gray-500">금액</dt>
                <dd class="font-medium text-gray-900">
                  {{ formatCurrency(event.detail?.amount) }}
                </dd>
              </div>
              <div>
                <dt class="text-gray-500">상태</dt>
                <dd>
                  <span
                    v-if="event.detail?.status === 'active'"
                    class="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                  >
                    진행중
                  </span>
                  <span
                    v-else-if="event.detail?.status === 'expired'"
                    class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500"
                  >
                    만료
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700"
                  >
                    {{ event.detail?.status || '—' }}
                  </span>
                </dd>
              </div>

              <!-- 대출 전용 -->
              <template v-if="event.type === 'repayment'">
                <div>
                  <dt class="text-gray-500">상환율</dt>
                  <dd class="font-medium text-gray-900">
                    {{ toPercent(event.detail?.repaymentRate) }}
                  </dd>
                </div>
                <div>
                  <dt class="text-gray-500">상환방법</dt>
                  <dd class="font-medium text-gray-900">
                    {{ safe(event.detail?.repaymentMethod) }}
                  </dd>
                </div>
                <div>
                  <dt class="text-gray-500">이자율</dt>
                  <dd class="font-medium text-gray-900">
                    {{
                      event.detail?.interestRate
                        ? event.detail.interestRate + '%'
                        : '—'
                    }}
                  </dd>
                </div>
              </template>

              <!-- 정책 전용 -->
              <template v-else>
                <div>
                  <dt class="text-gray-500">지급일</dt>
                  <dd class="font-medium text-gray-900">
                    {{ event.detail?.paymentDate ?? day.date }}
                  </dd>
                </div>
              </template>
            </dl>
          </div>
        </BottomPopover>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BottomPopover from '@/components/report/BottomPopover.vue';

const props = defineProps({
  days: { type: Array, default: () => [] },
  columns: { type: Number, default: 14 }, // 14 or 7
  today: { type: String, default: '' }, // 'YYYY-MM-DD'
});

const gridClass = computed(() =>
  props.columns === 14
    ? 'grid grid-cols-14 gap-1 mb-4'
    : 'grid grid-cols-7 gap-2'
);

// 달력엔 '지급일/상환일'만 보이도록
const anchorText = event => (event.type === 'repayment' ? '상환일' : '지급일');

// 칩 색상
const getEventClass = type =>
  type === 'repayment'
    ? 'bg-blue-100 text-blue-700'
    : 'bg-yellow-100 text-yellow-800';

const safe = v => v ?? '—';
const toPercent = v =>
  typeof v === 'number' ? `${Math.round(v * 100)}%` : '—';
const formatCurrency = n =>
  typeof n === 'number'
    ? n.toLocaleString('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        maximumFractionDigits: 0,
      })
    : '—';
</script>

<style scoped>
@media (max-width: 1023px) {
  .grid-cols-14 {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .grid-cols-14 {
    grid-template-columns: repeat(14, minmax(0, 1fr));
  }
}
</style>
