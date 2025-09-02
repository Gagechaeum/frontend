<template>
  <div class="flex w-80 flex-col rounded-2xl border border-[#e5e7eb] bg-white">
    <div class="border-b border-gray-200 p-4">
      <h3 class="font-semibold text-gray-900">내 채팅방</h3>
    </div>
    <div class="flex-1 space-y-2 overflow-y-auto p-4">
      <div
        v-for="room in myRooms"
        :key="room.id"
        :class="{
          'border-blue-200 bg-blue-50': selectedRoom?.id === room.id,
          'hover:bg-gray-50': selectedRoom?.id !== room.id,
        }"
        class="flex cursor-pointer items-start space-x-3 rounded-xl border border-gray-100 p-3 transition-colors"
        @click="$emit('enter-room', room)"
      >
        <!-- 아이콘 -->
        <div
          class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#2563EB]"
        >
          <i class="fas fa-comments text-sm text-white"></i>
        </div>

        <!-- 방 제목/인원 -->
        <div class="min-w-0 flex-1">
          <h4 class="truncate text-sm font-medium text-gray-900">
            {{ room.name }}
          </h4>
          <p class="text-xs text-gray-500">{{ room.memberCount }}명</p>
        </div>

        <!-- 시간(항상 위) + 배지(아래). 높이 유지 -->
        <div class="flex flex-col items-end justify-between self-stretch">
          <!-- 항상 오른쪽 위 고정 -->
          <span class="text-xs text-gray-400">{{ room.lastMessageTime }}</span>

          <!-- 아래쪽 배지: 없을 때도 자리 유지 -->
          <div
            class="mt-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold"
            :class="
              room.unreadCount > 0
                ? 'visible bg-red-500 text-white'
                : 'invisible'
            "
          >
            {{ room.unreadCount || 0 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  myRooms: { type: Array, default: () => [] },
  selectedRoom: { type: Object, default: null },
});
defineEmits(['enter-room']);
</script>
