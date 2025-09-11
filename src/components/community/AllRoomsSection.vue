<template>
  <section class="rounded-2xl border border-[#e5e7eb] bg-white p-6">
    <!-- Exploring Destinations #1 -->
    <h2 class="mb-6 text-xl font-bold text-gray-900">지역별 채팅방</h2>
    <div class="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <slot name="featured">
        <div
          v-for="room in regions"
          :key="room.id"
          class="relative cursor-pointer overflow-hidden rounded-xl transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          @click="$emit('enter-room', room)"
        >
          <img class="h-32 w-full object-cover" />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          ></div>
          <div class="absolute inset-x-0 bottom-0 p-3">
            <h3 class="text-base font-bold text-white">{{ room.name }}</h3>
            <p class="text-xs text-white/80">{{ room.participantCount }}명 참여중</p>
          </div>
        </div>
      </slot>
    </div>

    <!-- Exploring Destinations #2 -->
    <h2 class="mb-6 text-xl font-bold text-gray-900">업종별 채팅방</h2>
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <slot name="featured-bottom">
        <div
          v-for="room in businessCategories"
          :key="room.id"
          class="relative cursor-pointer overflow-hidden rounded-xl transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          @click="$emit('enter-room', room)"
        >
          <img class="h-32 w-full object-cover" />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          ></div>
          <div class="absolute inset-x-0 bottom-0 p-3">
            <h3 class="text-base font-bold text-white">{{ room.name }}</h3>
            <p class="text-xs text-white/80">{{ room.participantCount }}명 참여중</p>
          </div>
        </div>
      </slot>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  regions: { type: Array, default: () => [] },
  businessCategories: { type: Array, default: () => [] }
});
defineEmits(['update:active-tab', 'enter-room']);

const fallbackImagesMap = {
  "서울특별시": "https://images.unsplash.com/photo-1549429188-66236b28399e?q=80&w=1200&auto=format&fit=crop",
  "부산광역시": "https://images.unsplash.com/photo-1616788812684-18c94622b821?q=80&w=1200&auto=format&fit=crop",
  "제주특별자치도": "https://images.unsplash.com/photo-1607593259838-8980b1e428d0?q=80&w=1200&auto=format&fit=crop",
  "강원도": "https://images.unsplash.com/photo-1629835848529-573522f74116?q=80&w=1200&auto=format&fit=crop",
  "경기도": "https://images.unsplash.com/photo-1522810842784-fe4566c7b049?q=80&w=1200&auto=format&fit=crop",
  "충청북도": "https://images.unsplash.com/photo-1563829023194-9b2f6f5b9d3b?q=80&w=1200&auto=format&fit=crop",
  "충청남도": "https://images.unsplash.com/photo-1594911466042-3e2b2020e985?q=80&w=1200&auto=format&fit=crop",
  "경상북도": "https://images.unsplash.com/photo-1582967150935-77a8b413c6a4?q=80&w=1200&auto=format&fit=crop",
  "경상남도": "https://images.unsplash.com/photo-1604925828751-03d15993e3e2?q=80&w=1200&auto=format&fit=crop",
  "전라북도": "https://images.unsplash.com/photo-1598275529433-2a6d7f0e352e?q=80&w=1200&auto=format&fit=crop",
  "전라남도": "https://images.unsplash.com/photo-1595085698372-5d4669f69796?q=80&w=1200&auto=format&fit=crop",
};

</script>
