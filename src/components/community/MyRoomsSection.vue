<template>
  <section class="rounded-2xl border border-[#e5e7eb] bg-white p-6">
    <h2 class="mb-4 text-xl font-bold text-gray-900">내가 참여한 채팅방</h2>

    <!-- 탭 -->
    <div class="mb-5">
      <div class="flex gap-1 rounded-xl bg-[#F2F4F7] p-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'flex-1 rounded-lg px-2 py-2.5 text-sm font-medium transition',
            activeTab === tab.id
              ? 'bg-[#2563EB] text-white shadow'
              : 'text-gray-700 hover:bg-white',
          ]"
          @click="$emit('update:active-tab', tab.id)"
        >
          <i :class="tab.icon" class="mr-1.5"></i>{{ tab.name }}
        </button>
      </div>
    </div>

    <!-- 리스트 -->
    <div class="space-y-3">
      <template v-if="sortedRooms.length">
        <div
          v-for="room in sortedRooms"
          :key="room.id"
          class="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 p-4 transition hover:bg-gray-50"
          @click="$emit('enter-room', room)"
        >
          <!-- 왼쪽: 아이콘 + 제목/카테고리 + 인원 -->
          <div class="flex min-w-0 items-center gap-3">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB]"
            >
              <i class="fas fa-comments text-white"></i>
            </div>

            <div class="min-w-0">
              <!-- 제목 + 카테고리 배지(이름 옆) -->
              <div class="flex items-center gap-2">
                <h3 class="truncate font-medium text-gray-900">
                  {{ room.name }}
                </h3>
                <span
                  class="shrink-0 rounded-full border px-2 py-0.5 text-[11px] leading-none text-gray-600"
                >
                  {{ mapCategoryLabel(room.category) }}
                </span>
              </div>

              <p class="mt-0.5 text-sm text-gray-500">
                {{ room.memberCount }}명 참여중
              </p>
            </div>
          </div>

          <!-- 오른쪽: 시간(위 고정) + 안읽은 배지(아래 자리 고정) -->
          <!-- 핵심: 고정 폭과 항상 렌더링되는 배지 자리 -->
          <div class="flex w-16 flex-col items-end">
            <span class="text-xs text-gray-400">{{
              room.lastMessageTime
            }}</span>

            <!-- 항상 렌더링: 없을 때는 투명으로 공간만 차지 -->
            <div
              class="mt-2 h-5 w-5 min-w-5 rounded-full text-center text-[11px] font-semibold leading-[20px]"
              :class="
                room.unreadCount > 0 ? 'bg-red-500 text-white' : 'opacity-0'
              "
            >
              {{ displayUnread(room.unreadCount) }}
            </div>
          </div>
        </div>
      </template>

      <p v-else class="py-8 text-center text-gray-500">
        해당 탭에 속한 채팅방이 없습니다.
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed, watchEffect } from 'vue';

const props = defineProps({
  tabs: { type: Array, default: () => [] }, // [{ id:'all'|'business'|'region'|'loan'|'policy', name, icon }]
  activeTab: { type: String, default: 'all' },
  myRooms: { type: Array, default: () => [] }, // { id, name, memberCount, lastMessageTime, unreadCount, category }
});
defineEmits(['update:active-tab', 'enter-room']);

/** 탭별 필터링 */
const filteredRooms = computed(() => {
  if (props.activeTab === 'all') return props.myRooms;
  return props.myRooms.filter(r => r?.category === props.activeTab);
});

/** 정렬: 안읽은 메시지 있는 방을 위로, 그다음 이름 오름차순 */
const sortedRooms = computed(() => {
  return [...filteredRooms.value].sort((a, b) => {
    const aHas = (a.unreadCount || 0) > 0 ? 1 : 0;
    const bHas = (b.unreadCount || 0) > 0 ? 1 : 0;
    if (aHas !== bHas) return bHas - aHas;
    return (a.name || '').localeCompare(b.name || '');
  });
});

/** 배지 라벨 */
const mapCategoryLabel = key => {
  switch (key) {
    case 'business':
      return '업종';
    case 'region':
      return '지역';
    case 'loan':
      return '대출';
    case 'policy':
      return '정책';
    default:
      return '분류없음';
  }
};

/** 안읽은 배지 표시: 10 이상이면 '9+' */
const displayUnread = n => (n > 9 ? '9+' : String(n || 0));

/** 유효성 로그(선택) */
watchEffect(() => {
  const valid = new Set(['business', 'region', 'loan', 'policy']);
  props.myRooms.forEach(r => {
    if (!valid.has(r?.category)) {
      console.warn(
        '[MyRoomsSection] room.category가 유효하지 않습니다:',
        r?.name,
        '=>',
        r?.category,
        '(허용값: business|region|loan|policy)'
      );
    }
  });
});
</script>

<style scoped>
/* 선택: 카테고리 배지 경계색 살짝 연함 */
span[class*='rounded-full'][class*='border'] {
  border-color: #e5e7eb;
  color: #6b7280;
}
</style>
