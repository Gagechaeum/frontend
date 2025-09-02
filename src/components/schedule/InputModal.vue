<template>
  <div v-if="open" class="fixed inset-0 z-[70]">
    <div class="absolute inset-0 bg-black/30" @click="$emit('close')"></div>

    <div
      class="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-100 bg-white p-4 shadow-soft"
    >
      <h3 class="mb-2 text-h4">{{ title }}</h3>
      <p v-if="subtitle" class="mb-3 text-body-sm text-neutral-600">
        {{ subtitle }}
      </p>
      <input
        v-model="draft"
        :placeholder="placeholder"
        class="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none"
        autofocus
        @keydown.enter="submit"
      />
      <div class="mt-4 flex justify-end gap-2">
        <button
          class="h-9 rounded-[10px] border border-neutral-300 bg-white px-4 text-xs font-semibold text-neutral-700"
          @click="$emit('close')"
        >
          취소
        </button>
        <button
          class="h-9 rounded-[10px] bg-brand-blue-royal px-4 text-xs font-bold text-white"
          @click="submit"
        >
          {{ okText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  open: Boolean,
  title: { type: String, default: '이름 입력' },
  subtitle: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  defaultValue: { type: String, default: '' },
  okText: { type: String, default: '확인' },
});
const emit = defineEmits(['close', 'submit']);

const draft = ref(props.defaultValue);
watch(
  () => props.defaultValue,
  v => (draft.value = v)
);

function submit() {
  if (!draft.value?.trim()) return;
  emit('submit', draft.value.trim());
}
</script>
