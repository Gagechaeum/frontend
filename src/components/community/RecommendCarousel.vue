<template>
  <section class="rounded-2xl border border-[#e5e7eb] bg-white p-6">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900">추천 채팅방</h2>
    </div>

    <div
      v-if="rooms?.length"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
    >
      <div
        v-for="room in rooms"
        :key="room.id"
        class="group relative overflow-hidden rounded-2xl shadow"
        role="button"
        tabindex="0"
        @click="handleJoin(room)"
        @keydown.enter.prevent="handleJoin(room)"
        @keydown.space.prevent="handleJoin(room)"
      >
        <!-- 콘텐츠 -->
        <img
          :src="room.image"
          alt=""
          class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        ></div>
        <div class="absolute inset-x-0 bottom-0 p-4">
          <h3 class="text-sm font-semibold text-white">#{{ room.name }}</h3>
          <p class="mt-1 text-xs text-white/80">{{ room.description }}</p>
        </div>
      </div>
    </div>

    <p v-else class="py-8 text-center text-gray-500">
      표시할 채팅방이 없습니다.
    </p>
  </section>
</template>

<script setup>
const props = defineProps({
  rooms: { type: Array, default: () => [] },
  /** ✅ 부모에서 직접 콜백을 내려보내면 emit이 막혀도 동작 */
  onJoin: { type: Function, default: null },
});
const emit = defineEmits(['join']);

function handleJoin(room) {
  // 1) 콜백 props 우선 호출
  if (typeof props.onJoin === 'function') {
    props.onJoin(room);
  }
  // 2) 기존 emit도 그대로 유지(둘 다 연결)
  emit('join', room);
}
</script>
