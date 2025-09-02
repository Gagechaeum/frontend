<template>
  <div class="flex min-h-screen flex-col bg-neutral-50 text-neutral-900">
    <AppHeader
      v-if="$route.meta.showHeader !== false"
      :overlay="$route.meta.overlayHeader === true"
    />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />

    <!-- Toast 알림 컴포넌트 -->
    <Toast />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import AppHeader from './components/common/AppHeader.vue';
import AppFooter from './components/common/AppFooter.vue';
import Toast from './components/common/Toast.vue';
</script>
