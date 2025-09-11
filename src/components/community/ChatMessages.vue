<template>
  <div class="flex-1 space-y-4 overflow-y-auto p-4" data-messages-container>
    <div
      v-for="m in messages"
      :key="m.id"
      class="flex w-full"
      :class="isMine(m) ? 'justify-end' : 'justify-start'"
    >
      <!-- 한 행: 좌/우 전환 + top 정렬 -->
      <div
        class="flex w-full max-w-[92%] items-start gap-2"
        :class="isMine(m) ? 'flex-row-reverse' : 'flex-row'"
      >
        <!-- 사이드 컬럼: 아바타(위) -->
        <div class="flex flex-col items-center">
          <img
            :src="m.profileImageKey"
            alt="avatar"
            class="h-8 w-8 rounded-full border object-cover"
          />
        </div>

        <!-- 본문 컬럼: 닉네임 + 말풍선 + 시간 -->
        <div class="flex w-full max-w-[75%] flex-col">
          <div class="flex flex-col gap-1" :class="isMine(m) ? 'items-end' : 'items-start'">
            <div
              class="text-center text-[11px] font-medium"
              :class="isMine(m) ? 'text-gray-400' : 'text-gray-500'"
            >
              {{ m.nickname }}
            </div>

            <!-- 말풍선 본문 -->
            <div
              v-if="m.message"
              class="break-words rounded-2xl px-3 py-2 text-sm"
              :class="[
                isMine(m)
                  ? 'rounded-tr-md bg-blue-600 text-white'
                  : 'rounded-tl-md bg-gray-100 text-gray-800',
              ]"
            >
              {{ m.message }}
            </div>

            <!-- 파일/이미지/동영상 -->
            <div v-for="file in m.files" :key="file.name" class="w-fit">
              <!-- 파일 메시지 -->
              <div
                v-if="parseFileType(file.type) === 'application'"
                class="flex items-center gap-2 whitespace-nowrap rounded-2xl px-3 py-2 text-sm border"
              >
                <a
                  href="#"
                  target="_blank"
                  class="flex items-center gap-2"
                  @click.prevent="fetchRenewFileUrl(file.attachmentId)"
                >
                  <i class="fas fa-paperclip"></i>
                  <span class="truncate">{{ file.name }}.{{ parseFileSubType(file.type) }}</span>
                </a>
              </div>

              <!-- 이미지 메시지 -->
              <div
                v-else-if="parseFileType(file.type) === 'image'"
                class="cursor-zoom-in"
                @click="$emit('preview-image', { url: file.key, name: file.name })"
              >
                <img :src="file.key" class="max-w-64 rounded-xl border object-cover" />
              </div>

              <!-- 동영상 메시지 -->
              <div v-else-if="parseFileType(file.type) === 'video'">
                <video :src="file.key" controls class="max-w-72 rounded-xl border"></video>
              </div>
            </div>

            <span
              class="text-[11px] leading-none"
              :class="isMine(m) ? 'text-gray-300' : 'text-gray-400'"
            >
              {{ parseTime(m.sentAt) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { renewFileUrl } from '@/lib/api/community.js';

  const props = defineProps({
    messages: { type: Array, default: () => [] },
    currentUser: { type: String, default: '' },
  });
  defineEmits(['preview-image']);

  const isMine = m => m?.nickname === props.currentUser;

  const fetchRenewFileUrl = async fileId => {
    try {
      const response = await renewFileUrl(fileId);
      if (response.data) {
        window.open(response.data, '_blank');
      }
    } catch (error) {
      console.error('파일 URL 갱신 실패:', error);
    }
  };

  function parseFileType(type) {
    if (type)
      return type.split('/')[0];
  }

  function parseFileSubType(type) {
    if (type)
      return type.split('/')[1];
  }

  function parseTime(time) {
    if (time)
    return time.split('T')[1];
  }
</script>