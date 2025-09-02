<!-- src/components/report/ReportList.vue -->
<template>
  <!-- 컨트롤 바 -->
  <div
    class="flex flex-col border-b border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="mb-4 flex space-x-2 sm:mb-0">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="{
          'bg-blue-600 text-white': activeTab === tab.key,
          'text-gray-600 hover:text-gray-900': activeTab !== tab.key,
        }"
        class="!rounded-button cursor-pointer whitespace-nowrap px-5 py-2.5 text-sm font-medium transition-all duration-200"
        @click="
          () => {
            $emit('collapse-all');
            $emit('update:active-tab', tab.key);
          }
        "
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 정렬 드롭다운 (커스텀) -->
    <div class="relative">
      <button
        class="flex items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        @click="openDropdown = !openDropdown"
      >
        <span>
          {{
            sortBy === 'name'
              ? '정책명순'
              : sortBy === 'date'
                ? '날짜순'
                : '가나다순'
          }}
        </span>
        <i
          class="fas fa-chevron-down ml-2 text-gray-400 transition-transform"
          :class="{ 'rotate-180': openDropdown }"
        />
      </button>

      <div
        v-if="openDropdown"
        class="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
      >
        <ul class="text-sm text-gray-700">
          <li>
            <button
              class="w-full rounded-lg px-3 py-2 text-left hover:bg-blue-50"
              :class="{ 'bg-blue-100 font-medium': sortBy === 'name' }"
              @click="
                $emit('update:sort-by', 'name');
                openDropdown = false;
              "
            >
              정책명순
            </button>
          </li>
          <li>
            <button
              class="w-full rounded-lg px-3 py-2 text-left hover:bg-blue-50"
              :class="{ 'bg-blue-100 font-medium': sortBy === 'date' }"
              @click="
                $emit('update:sort-by', 'date');
                openDropdown = false;
              "
            >
              날짜순
            </button>
          </li>
          <li>
            <button
              class="w-full rounded-lg px-3 py-2 text-left hover:bg-blue-50"
              :class="{ 'bg-blue-100 font-medium': sortBy === 'alphabet' }"
              @click="
                $emit('update:sort-by', 'alphabet');
                openDropdown = false;
              "
            >
              가나다순
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- 리스트 -->
  <div class="p-6">
    <div v-if="filteredItems.length === 0" class="py-12 text-center">
      <i class="fas fa-inbox mb-4 text-3xl text-gray-300"></i>
      <p class="mb-1 text-sm text-gray-600">등록된 항목이 없습니다</p>
      <p class="text-xs text-gray-400">등록하기를 눌러 추가하세요</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 text-gray-600">
            <!-- ✅ 모든 탭에서 '구분' 표시 -->
            <th class="px-4 py-3 text-left font-medium">구분</th>
            <th class="px-4 py-3 text-left font-medium">{{ nameCol }}</th>
            <th class="px-4 py-3 text-left font-medium">기간</th>
            <th class="px-4 py-3 text-right font-medium">{{ amountCol }}</th>
            <th class="px-4 py-3 text-center font-medium">상태</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="item in filteredItems" :key="item.id">
            <!-- ▶︎ 행 전체 클릭으로 토글 -->
            <tr
              class="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
              @click="$emit('toggle-detail', item.id)"
            >
              <!-- 구분 배지 -->
              <td class="px-4 py-4">
                <span
                  :class="
                    item.type === 'policy'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  "
                  class="rounded-full px-2.5 py-0.5 text-xs"
                >
                  {{ item.type === 'policy' ? '정책' : '대출' }}
                </span>
              </td>

              <!-- 이름 -->
              <td class="px-4 py-4">
                <span class="font-medium text-gray-900">{{ item.name }}</span>
              </td>

              <!-- 기간 -->
              <td class="px-4 py-4">
                <div class="text-gray-600">
                  {{ formatDate(item.startDate) }} ~
                  {{ formatDate(item.endDate) }}
                </div>
              </td>

              <!-- 금액/잔액 -->
              <td class="px-4 py-4 text-right">
                <div
                  v-if="item.type === 'loan'"
                  class="font-medium text-blue-600"
                >
                  ₩{{ fmt(item.totalAmount - (item.paidAmount ?? 0)) }}
                </div>
                <div
                  v-else
                  class="font-medium"
                  :class="
                    item.type === 'policy' ? 'text-yellow-500' : 'text-blue-600'
                  "
                >
                  ₩{{ `${fmt(item.monthlyAmount)}/월` }}
                </div>
              </td>

              <!-- 상태 -->
              <td class="px-4 py-4 text-center">
                <span
                  :class="
                    item.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  "
                  class="rounded-full px-2.5 py-0.5 text-xs"
                >
                  {{ item.status === 'active' ? '진행중' : '만료' }}
                </span>
              </td>
            </tr>

            <!-- 상세 -->
            <tr v-if="expandedItems.includes(item.id)" class="bg-gray-50">
              <td :colspan="5" class="px-4 py-4">
                <div class="flex items-start justify-between gap-4">
                  <!-- 상세 키:값 -->
                  <div class="w-full">
                    <!-- 대출 3열 -->
                    <div
                      v-if="item.type === 'loan'"
                      class="grid grid-cols-1 gap-6 md:grid-cols-3"
                    >
                      <div class="kv-row">
                        <span class="kv-key">상환률</span>
                        <span class="kv-val">
                          {{
                            Math.round(
                              ((item.paidAmount ?? 0) / item.totalAmount) * 100
                            )
                          }}%
                        </span>
                      </div>
                      <div class="kv-row">
                        <span class="kv-key">상환방법</span>
                        <span class="kv-val">{{ item.repaymentMethod }}</span>
                      </div>
                      <div class="kv-row">
                        <span class="kv-key">이자율</span>
                        <span class="kv-val">{{ item.interestRate }}%</span>
                      </div>
                    </div>

                    <!-- 정책 2열 -->
                    <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div class="kv-row">
                        <span class="kv-key">지급일</span>
                        <span class="kv-val">매월 15일</span>
                      </div>
                      <div class="kv-row">
                        <span class="kv-key">총 지급액</span>
                        <span class="kv-val">₩{{ fmt(item.totalAmount) }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 상세보기 버튼 (작게) -->
                  <button
                    :class="
                      item.type === 'loan'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    "
                    class="shrink-0 self-start rounded-full px-2 py-0.5 text-[11px] leading-4"
                    @click.stop="
                      $emit(
                        item.type === 'loan' ? 'open-loan' : 'open-policy',
                        item
                      )
                    "
                  >
                    {{
                      item.type === 'loan' ? '대출 상세보기' : '정책 상세보기'
                    }}
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  tabs: { type: Array, default: () => [] },
  activeTab: { type: String, default: 'all' },
  sortBy: { type: String, default: 'name' },
  filteredItems: { type: Array, default: () => [] },
  expandedItems: { type: Array, default: () => [] },
});

defineEmits([
  'update:active-tab',
  'update:sort-by',
  'toggle-detail',
  'collapse-all',
  'open-loan',
  'open-policy',
]);

const openDropdown = ref(false);

const handleDocClick = e => {
  // 드롭다운 컨테이너 바깥 클릭 시 닫기
  const host = e.target.closest('.relative');
  if (!host) openDropdown.value = false;
};

onMounted(() => {
  document.addEventListener('click', handleDocClick);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocClick);
});

const fmt = n => Number(n ?? 0).toLocaleString();
const formatDate = s => {
  const d = new Date(s);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate()
  ).padStart(2, '0')}`;
};

const nameCol = computed(() =>
  props.activeTab === 'loan'
    ? '대출명'
    : props.activeTab === 'policy'
      ? '정책명'
      : '항목명'
);
const amountCol = computed(() =>
  props.activeTab === 'loan' ? '잔액' : '금액'
);
</script>

<style scoped>
.\!rounded-button {
  border-radius: 8px;
}

/* 키:값 한 줄 – 앞에 작은 점과 간격 */
.kv-row {
  @apply relative flex items-baseline justify-between gap-4 pl-4 text-sm;
}
.kv-row::before {
  content: '';
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background-color: rgb(229 231 235); /* gray-200 */
}
.kv-key {
  @apply text-gray-600;
}
.kv-val {
  @apply font-medium text-gray-900;
}
</style>
