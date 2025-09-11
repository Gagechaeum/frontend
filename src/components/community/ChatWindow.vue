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
        <span class="text-sm text-gray-500">{{ room?.participantCount }}명</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="text-gray-500 hover:text-red-500"
          @click="$emit('leave')"
        >
          <i
            class="fas fa-sign-out-alt"
            @click="stompClient.leaveRoom"
          ></i>
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
      @send-text="handleSendText"
      @send-file="handleSendFile"
    />
  </div>
</template>

<script setup>
import { useChatStore } from '@/stores/stomp';
import { useAuthStore } from '@/stores/auth';

import ChatMessages from './ChatMessages.vue';
import ChatComposer from './ChatComposer.vue';

const stompClient = useChatStore();
const authStore = useAuthStore();

const props = defineProps({
  room: Object,
  messages: Array,
  currentUser: { type: String, default: '' },
  currentAvatar: { type: String, default: '' },
});

defineEmits([
  'back',
  'leave',
  'preview-image',
  'send-text',
  'send-file',
]);

const handleSendText = (content) => {
  if (!content.trim()) return;

  const message = {
    content: content,
    files: null
  };

  stompClient.sendMessage(message);
};

const handleSendFile = async (fileInfo) => {
//   // 파일 전송은 2단계로 진행됩니다.
//   // 1. 먼저 파일을 서버의 S3로 업로드합니다.
//   const formData = new FormData();
//   formData.append('file', fileInfo.file);

//   try {
//     // S3 업로드 API를 호출 (여기서는 예시 URL 사용)
//     const response = await fetch('/api/s3/upload', {
//       method: 'POST',
//       body: formData
//     });
    
//     if (!response.ok) {
//       throw new Error('파일 업로드 실패');
//     }

//     const { s3Key } = await response.json(); // S3 업로드 후 반환된 키

//     // 2. S3 키를 포함한 메시지 메타데이터를 웹소켓으로 전송합니다.
//     const message = {
//       userId: authStore.userId,
//       roomId: props.room.roomId,
//       content: fileInfo.name, // 파일명을 메시지 내용으로 사용
//       files: [{
//         key: s3Key,
//         name: fileInfo.name,
//         type: fileInfo.file.type,
//       }],
//     };

//     stompClient.send('/app/chat.sendMessage', JSON.stringify(message));

//   } catch (error) {
//     console.error("파일 전송 중 오류 발생:", error);
//     // 사용자에게 오류 메시지를 보여주는 로직 추가
//   }
};
</script>
