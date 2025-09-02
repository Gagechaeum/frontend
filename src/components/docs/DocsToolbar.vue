<template>
  <div class="border-b border-[#e5e7eb] bg-white px-6 py-4">
    <div class="flex items-center justify-end">
      <!-- 우측: 기능 버튼 -->
      <div class="flex items-center gap-3">
        <UiButton variant="primary" size="sm" @click="$emit('showUploadModal')">
          <i class="fas fa-plus mr-2"></i>서류 추가
        </UiButton>
        <UiButton variant="secondary" size="sm" @click="$emit('downloadZip')">
          <i class="fas fa-download mr-2"></i>내 서류 zip 내려받기
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import UiButton from '@/components/common/UiButton.vue';

defineEmits(['showUploadModal', 'downloadZip']);
</script>
