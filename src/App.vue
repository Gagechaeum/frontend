<template>
  <div class="flex min-h-screen flex-col bg-neutral-50 text-neutral-900">
    <AppHeader v-if="$route.meta.showHeader !== false" />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import AppHeader from './components/common/AppHeader.vue';
import AppFooter from './components/common/AppFooter.vue';
</script>
