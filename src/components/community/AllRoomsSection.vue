<template>
  <section class="rounded-2xl border border-[#e5e7eb] bg-white p-6">
    <!-- Exploring Destinations #1 -->
    <h2 class="mb-6 text-xl font-bold text-gray-900">지역별 채팅방</h2>
    <div class="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <slot name="featured">
        <div
          v-for="n in 8"
          :key="'top-' + n"
          class="relative cursor-pointer overflow-hidden rounded-xl transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <img :src="fallbackImages[n - 1]" class="h-32 w-full object-cover" />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          ></div>
          <div class="absolute inset-x-0 bottom-0 p-3">
            <h3 class="text-base font-bold text-white">CITY {{ n }}</h3>
            <p class="text-xs text-white/80">Highlights</p>
          </div>
        </div>
      </slot>
    </div>

    <!-- Exploring Destinations #2 -->
    <h2 class="mb-6 text-xl font-bold text-gray-900">업종별 채팅방</h2>
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <slot name="featured-bottom">
        <div
          v-for="n in 8"
          :key="'bottom-' + n"
          class="relative cursor-pointer overflow-hidden rounded-xl transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <img :src="fallbackImages[n + 7]" class="h-32 w-full object-cover" />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          ></div>
          <div class="absolute inset-x-0 bottom-0 p-3">
            <h3 class="text-base font-bold text-white">CITY {{ n + 8 }}</h3>
            <p class="text-xs text-white/80">Highlights</p>
          </div>
        </div>
      </slot>
    </div>
  </section>
</template>

<script setup>
const fallbackImages = [
  // 상단 8개
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop', // 1 바다
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop', // 2 산
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop', // 3 도시
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop', // 4 숲
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop', // 5 사막
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop', // ✅ 6 호수 (교체)
  'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=1200&auto=format&fit=crop', // 7 강
  'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200&auto=format&fit=crop', // 8 정글

  // 하단 8개
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop', // 9 산맥
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop', // 10 사막 (다른 각도)
  'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?q=80&w=1200&auto=format&fit=crop', // ✅ 11 호수 (교체)
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop', // ✅ 12 해변 (교체: 안정된 버전)
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop', // 13 폭포
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop', // 14 오로라
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop', // 15 사바나
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop', // ✅ 16 절벽 (교체: 산악 절벽)
];
</script>
