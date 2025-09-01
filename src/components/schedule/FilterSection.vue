<template>
  <div class="mb-3">
    <p class="mb-1 text-xs font-bold text-neutral-600">{{ title }}</p>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="o in options"
        :key="o"
        class="rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
        :class="
          isSelected(o)
            ? 'border-brand-blue-royal bg-brand-blue-royal text-white'
            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
        "
        @click="toggle(o)"
      >
        {{ o }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  title: String,
  options: { type: Array, default: () => [] },
  modelValue: { type: Array, default: () => [] },
});
const emit = defineEmits(['update:modelValue']);
const selected = computed({
  get: () => new Set(props.modelValue),
  set: v => emit('update:modelValue', Array.from(v)),
});
const isSelected = o => selected.value.has(o);
function toggle(o) {
  const n = new Set(selected.value);
  n.has(o) ? n.delete(o) : n.add(o);
  selected.value = n;
}
</script>
