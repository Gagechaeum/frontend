<template>
  <header class="border-b border-gray-200 bg-white px-6 py-4">
    <div class="mx-auto flex max-w-7xl items-center justify-between">
      <h1 class="text-xl font-bold text-gray-900">리포트</h1>

      <!-- 오른쪽 버튼들 -->
      <div class="flex items-center gap-2">
        <!-- 대출 등록 (블루 톤) -->
        <button
          class="!rounded-button cursor-pointer whitespace-nowrap border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
          @click="$emit('click-register-loan')"
        >
          대출 등록
        </button>

        <!-- 정책 등록 (옐로 톤, 오른쪽) -->
        <button
          class="!rounded-button cursor-pointer whitespace-nowrap bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
          @click="$emit('click-register-policy')"
        >
          정책 등록
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
// 단순 헤더 – 별도 로직 없음
</script>

<style scoped>
.\!rounded-button {
  border-radius: 8px;
}
</style>
