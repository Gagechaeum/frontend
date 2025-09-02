<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click="emitClose"
  >
    <div
      class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white"
      @click.stop
    >
      <!-- ✕ 닫기 -->
      <button
        class="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label="닫기"
        @click="emitClose"
      >
        <i class="fas fa-times text-lg"></i>
      </button>

      <div class="p-8">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">새 항목 등록</h2>
          <!-- (보조 닫기) -->
          <div class="h-9 w-9"></div>
        </div>

        <!-- 단계 1: 정책 선택 -->
        <div v-if="step === 1">
          <h3 class="mb-4 text-lg font-medium text-gray-900">
            정책을 선택하세요
          </h3>

          <!-- 검색 (상단) -->
          <div class="mb-6 rounded-lg border border-gray-200 p-3">
            <h4 class="mb-2 font-medium text-gray-900">검색</h4>
            <div class="relative">
              <input
                v-model="q"
                type="text"
                placeholder="정책명을 검색하세요"
                class="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm"
              />
              <i
                class="fas fa-search absolute left-3 top-3 text-sm text-gray-400"
              ></i>
            </div>

            <div v-if="results.length" class="mt-2 space-y-2">
              <div
                v-for="it in results"
                :key="it.id"
                class="cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                @click="selectItem(it)"
              >
                <div class="font-medium">{{ it.name }}</div>
                <div class="text-sm text-gray-600">정책</div>
              </div>
            </div>
            <div v-else-if="q" class="mt-2 text-sm text-gray-500">
              검색 결과가 없습니다
            </div>
          </div>

          <!-- 즐겨찾기 (하단) -->
          <div class="rounded-lg border border-gray-200 p-3">
            <h4 class="mb-2 font-medium text-gray-900">즐겨찾기</h4>
            <div class="space-y-2">
              <div
                v-for="it in policyFavorites"
                :key="it.id"
                class="cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                @click="selectItem(it)"
              >
                <div class="font-medium">{{ it.name }}</div>
                <div class="text-sm text-gray-600">정책</div>
              </div>
              <div v-if="!policyFavorites.length" class="text-sm text-gray-500">
                즐겨찾기 정책이 없습니다
              </div>
            </div>
          </div>
        </div>

        <!-- 단계 2: 정책 상세 입력 -->
        <div v-else>
          <h3 class="mb-4 text-lg font-medium text-gray-900">
            {{ selected?.name }}
          </h3>

          <div class="mb-6 space-y-4">
            <!-- 기간 -->
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700"
                  >시작일</label
                >
                <input
                  v-model="form.startDate"
                  type="date"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700"
                  >종료일</label
                >
                <input
                  v-model="form.endDate"
                  type="date"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <!-- 지급일(첫 지급일) -->
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >첫 지급일</label
              >
              <input
                v-model="form.paymentDate"
                type="date"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <!-- 월/총 지급액 -->
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700"
                  >월 지급액</label
                >
                <input
                  v-model.number="form.monthlyAmount"
                  type="number"
                  placeholder="예: 800000"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700"
                  >총 지급액</label
                >
                <input
                  v-model.number="form.totalAmount"
                  type="number"
                  placeholder="예: 8000000"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              class="!rounded-button flex-1 cursor-pointer whitespace-nowrap bg-gray-100 py-3 font-medium text-gray-700 hover:bg-gray-200"
              @click="step = 1"
            >
              이전
            </button>
            <button
              class="!rounded-button flex-1 cursor-pointer whitespace-nowrap bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
              @click="emitRegister"
            >
              등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  favoriteItems: { type: Array, default: () => [] }, // 다양한 타입이 와도 모달 내에서 정책만 사용
});
const emit = defineEmits(['close', 'register']);

const step = ref(1);
const q = ref('');
const selected = ref(null);

// 정책 전용 폼
const form = ref({
  startDate: '',
  endDate: '',
  paymentDate: '',
  monthlyAmount: null,
  totalAmount: null,
});

// 정책만 필터링
const policyFavorites = computed(() =>
  props.favoriteItems.filter(it => it.type === 'policy')
);
const results = computed(() => {
  if (!q.value) return [];
  return policyFavorites.value.filter(it =>
    it.name.toLowerCase().includes(q.value.toLowerCase())
  );
});

watch(
  () => props.show,
  v => {
    if (v) {
      step.value = 1;
      q.value = '';
      selected.value = null;
      form.value = {
        startDate: '',
        endDate: '',
        paymentDate: '',
        monthlyAmount: null,
        totalAmount: null,
      };
    }
  }
);

const selectItem = it => {
  selected.value = it;
  step.value = 2;
};

const emitRegister = () => {
  // 유효성은 간단 체크만
  emit('register', {
    type: 'policy',
    name: selected.value?.name ?? '정책',
    startDate: form.value.startDate,
    endDate: form.value.endDate,
    paymentDate: form.value.paymentDate,
    monthlyAmount: Number(form.value.monthlyAmount || 0),
    totalAmount: Number(form.value.totalAmount || 0),
  });
};

const emitClose = () => emit('close');
</script>

<style scoped>
.\!rounded-button {
  border-radius: 8px;
}
</style>
