<template>
  <div class="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
    <AppHeader v-if="$route.meta.showHeader !== false" />
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
</script>
