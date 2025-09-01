<template>
  <div v-if="open" class="fixed inset-0 z-[60]">
    <div class="absolute inset-0 bg-black/30" @click="$emit('close')"></div>
    <div
      class="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-4 shadow-soft"
    >
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-h4">저장된 필터</h3>
        <button class="text-neutral-600" @click="$emit('close')">닫기</button>
      </div>

      <ul class="space-y-3">
        <li
          v-for="f in saved"
          :key="f.id"
          class="rounded-xl border border-neutral-100 p-3"
        >
          <div class="mb-2 flex items-center justify-between">
            <p class="text-sm font-bold">{{ f.name }}</p>
            <div class="flex gap-2">
              <button
                class="h-7 rounded-[10px] bg-brand-blue-royal px-3 text-[12px] font-bold text-white"
                @click="apply(f.id)"
              >
                적용
              </button>
              <button
                class="h-7 rounded-[10px] border border-neutral-300 bg-white px-3 text-[12px] font-semibold text-neutral-700"
                @click="rename(f)"
              >
                이름변경
              </button>
              <button
                class="h-7 rounded-[10px] border border-neutral-300 bg-white px-3 text-[12px] font-semibold text-danger"
                @click="remove(f.id)"
              >
                삭제
              </button>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="t in f.tags"
              :key="t"
              class="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700"
              >{{ t }}</span
            >
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useScheduleFilters } from '@/stores/scheduleFilters';
defineProps({ open: Boolean });
const emit = defineEmits(['close']);
const store = useScheduleFilters();
const { saved } = storeToRefs(store);

function apply(id) {
  store.setActive(id);
  emit('close');
}
function remove(id) {
  store.remove(id);
}
function rename(f) {
  const name = prompt('새 이름', f.name);
  if (name && name !== f.name) store.update(f.id, { name });
}
</script>
