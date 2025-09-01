<template>
  <nav
    class="mb-6 inline-flex rounded-xl border border-neutral-200 bg-neutral-100 p-1"
    role="tablist"
  >
    <RouterLink
      v-for="t in items"
      :key="t.to"
      :to="t.to"
      class="rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
      :class="
        $route.path.startsWith(t.to)
          ? 'border border-neutral-200 bg-white text-neutral-900'
          : 'text-neutral-600 hover:text-neutral-900'
      "
      role="tab"
      >{{ t.label }}</RouterLink
    >
  </nav>
</template>
<script setup>
import { RouterLink } from 'vue-router';
defineProps({ items: { type: Array, required: true } });
</script>
