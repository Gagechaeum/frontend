<template>
  <div v-if="show" class="fixed inset-0 z-50">
    <!-- 배경 오버레이 -->
    <div
      class="absolute inset-0 bg-black bg-opacity-50"
      @click="handleBackdropClick"
    ></div>

    <!-- 모달 컨테이너 -->
    <div
      class="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-100 bg-white p-6 shadow-soft"
    >
      <!-- 헤더 -->
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <button
          v-if="showCloseButton"
          class="text-gray-400 transition-colors hover:text-gray-600"
          @click="$emit('close')"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <!-- 서브타이틀 -->
      <p v-if="subtitle" class="mb-4 text-sm text-gray-600">{{ subtitle }}</p>

      <!-- 컨텐츠 영역 -->
      <div class="mb-6">
        <slot></slot>
      </div>

      <!-- footer 슬롯이 제공되면 그대로 사용, 아니면 기본 버튼 렌더링 -->
      <div class="flex justify-end gap-3">
        <slot name="footer">
          <UiButton variant="secondary" size="sm" @click="emit('cancel')">{{
            cancelText
          }}</UiButton>
          <UiButton
            variant="primary"
            size="sm"
            :disabled="confirmDisabled"
            @click="emit('confirm')"
            >{{ confirmText }}</UiButton
          >
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import UiButton from '@/components/common/UiButton.vue';

const props = defineProps({
  // 모달 표시 여부
  show: {
    type: Boolean,
    default: false,
  },

  // 제목
  title: {
    type: String,
    default: '모달',
  },

  // 서브타이틀
  subtitle: {
    type: String,
    default: '',
  },

  // 취소 버튼 표시 여부
  showCancelButton: {
    type: Boolean,
    default: true,
  },

  // 확인 버튼 표시 여부
  showConfirmButton: {
    type: Boolean,
    default: true,
  },

  // 닫기 버튼 표시 여부
  showCloseButton: {
    type: Boolean,
    default: true,
  },

  // 취소 버튼 텍스트
  cancelText: {
    type: String,
    default: '취소',
  },

  // 확인 버튼 텍스트
  confirmText: {
    type: String,
    default: '확인',
  },

  // 확인 버튼 비활성화 여부
  confirmDisabled: {
    type: Boolean,
    default: false,
  },

  // 배경 클릭 시 닫기 허용 여부
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['close', 'confirm', 'cancel']);

// 배경 클릭 처리
const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit('close');
  }
};
</script>
