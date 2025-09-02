<script setup>
const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="mx-4 w-full max-w-md rounded-lg bg-white p-6">
      <h3 class="mb-3 text-lg font-medium">계정 탈퇴 확인</h3>
      <p class="mb-6 text-sm text-gray-600">
        정말로 계정을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
      </p>
      <div class="flex justify-end gap-3">
        <button
          class="rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200"
          @click="emit('cancel')"
        >
          취소
        </button>
        <button
          class="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          @click="emit('confirm')"
        >
          삭제
        </button>
      </div>
    </div>
  </div>
</template>
