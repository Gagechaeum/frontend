<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click="$emit('close')"
  >
    <div class="relative w-full max-w-md rounded-2xl bg-white" @click.stop>
      <!-- ✕ 닫기 -->
      <button
        class="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label="닫기"
        @click="$emit('close')"
      >
        <i class="fas fa-times text-lg"></i>
      </button>

      <div class="p-8">
        <h2 class="mb-6 text-xl font-bold text-gray-900">대출 정보 연동</h2>

        <div class="mb-6 space-y-4">
          <p class="text-sm text-gray-600">
            마이데이터를 연동하여 대출 정보를 가져옵니다. 아래 내용에 동의하시면
            체크박스를 선택하고 확인 버튼을 눌러주세요.
          </p>
          <div
            class="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700"
          >
            <strong>개인(신용)정보 수집 및 이용 동의</strong>
            <ul class="mt-2 list-inside list-disc space-y-1 text-xs">
              <li>수집 목적: 대출 정보 조회 및 등록</li>
              <li>수집 항목: 대출 기관, 상품명, 대출 잔액, 이자율 등</li>
              <li>보유 및 이용 기간: 동의 철회 시까지</li>
            </ul>
          </div>
          <div class="flex items-center">
            <input
              id="consent-checkbox"
              v-model="isConsented"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              for="consent-checkbox"
              class="ml-2 block text-sm text-gray-900"
            >
              위 내용에 모두 동의합니다.
            </label>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            class="!rounded-button flex-1 cursor-pointer whitespace-nowrap bg-gray-100 py-3 font-medium text-gray-700 hover:bg-gray-200"
            @click="$emit('close')"
          >
            취소
          </button>
          <button
            :disabled="!isConsented"
            class="!rounded-button flex-1 cursor-pointer whitespace-nowrap bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            @click="$emit('confirm')"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
});

defineEmits(['close', 'confirm']);

const isConsented = ref(false);

watch(
  () => props.show,
  v => {
    if (v) {
      isConsented.value = false;
    }
  }
);
</script>
