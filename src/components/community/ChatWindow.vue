<template>
  <div
    class="flex flex-1 flex-col rounded-2xl border border-[#e5e7eb] bg-white"
  >
    <!-- 헤더 -->
    <div class="flex items-center justify-between border-b border-gray-200 p-4">
      <div class="flex items-center gap-3">
        <button
          class="text-gray-500 hover:text-gray-700"
          @click="$emit('back')"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <h3 class="font-semibold text-gray-900">{{ room?.name }}</h3>
        <span class="text-sm text-gray-500">{{ room?.memberCount }}명</span>
      </div>
      <div class="flex items-center gap-2">
        <button class="text-gray-500 hover:text-yellow-500">
          <i class="fas fa-star"></i>
        </button>
        <button
          class="text-gray-500 hover:text-red-500"
          @click="$emit('leave')"
        >
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>

    <!-- 메시지 -->
    <ChatMessages
      :messages="messages"
      :current-user="currentUser"
      @preview-image="$emit('preview-image', $event)"
    />

    <!-- 입력창 -->
    <ChatComposer
      @send-text="$emit('send-text', $event)"
      @send-image="$emit('send-image', $event)"
      @send-video="$emit('send-video', $event)"
      @send-file="$emit('send-file', $event)"
    />
  </div>
</template>

<script setup>
import ChatMessages from './ChatMessages.vue';
import ChatComposer from './ChatComposer.vue';

defineProps({
  room: Object,
  messages: Array,
  currentUser: { type: String, default: '나' },
  currentAvatar: { type: String, default: '' },
});

defineEmits([
  'back',
  'leave',
  'preview-image',
  'send-text',
  'send-image',
  'send-video',
  'send-file',
]);
</script>
