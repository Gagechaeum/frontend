<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-6">
    <h3 class="mb-4 text-lg font-bold text-gray-900">이번달 요약</h3>
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-gray-600">혜택금액</span>
        <span class="text-lg font-bold text-yellow-500"
          >₩{{ fmt(monthlyBenefit) }}</span
        >
      </div>
      <div class="flex items-center justify-between">
        <span class="text-gray-600">납부예정금액</span>
        <span class="text-lg font-bold text-blue-600"
          >₩{{ fmt(monthlyPayment) }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  monthlyBenefit: { type: Number, required: true },
  monthlyPayment: { type: Number, required: true },
});
const fmt = n => n.toLocaleString();
</script>
