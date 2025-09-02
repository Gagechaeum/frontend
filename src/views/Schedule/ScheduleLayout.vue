<template>
  <section class="container mx-auto px-4 py-6 lg:px-8">
    <div class="mb-4">
      <h1 class="text-h2 text-neutral-900">일정</h1>
      <p class="mt-1 text-body-sm text-neutral-600">
        지원정책·대출을 한 화면에서 탐색하고 비교하세요.
      </p>
    </div>

    <SegmentedTabs :items="tabs" />
    <RouterView />
  </section>
</template>

<script setup>
import { RouterView } from 'vue-router';
import SegmentedTabs from '@/components/schedule/SegmentedTabs.vue';

const tabs = [
  { label: '달력', to: '/schedule/calendar' },
  { label: '리스트', to: '/schedule/list' },
  { label: '내 필터', to: '/schedule/filter' },
  { label: '즐겨찾기', to: '/schedule/favorites' },
];
</script>
