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
        <!-- 사이드 컬럼: 아바타(위) + 이름(아래, 중앙정렬) -->
        <div class="flex flex-col items-center">
          <img
            :src="m.avatarUrl"
            alt="avatar"
            class="h-8 w-8 rounded-full border object-cover"
          />
          <div
            class="mt-1 w-8 text-center text-[11px] font-medium"
            :class="isMine(m) ? 'text-gray-400' : 'text-gray-500'"
          >
            {{ m.nickname || m.user }}
          </div>
        </div>

        <!-- 본문 컬럼: 말풍선 + 시간 -->
        <div class="mt-1.5 flex w-full max-w-[75%] flex-col">
          <!-- ✅ mt-1 추가 -->
          <div
            class="flex items-end gap-2"
            :class="isMine(m) ? 'justify-end' : 'justify-start'"
          >
            <!-- 오른쪽(내 메시지): 시간(밖) -> 말풍선(안) / 왼쪽(상대): 말풍선 -> 시간 -->
            <!-- 텍스트 -->
            <div
              v-if="m.type === 'text'"
              :class="[
                'break-words rounded-2xl px-3 py-2 text-sm',
                isMine(m)
                  ? 'order-2 rounded-tr-md bg-blue-600 text-white'
                  : 'order-1 rounded-tl-md bg-gray-100 text-gray-800',
              ]"
            >
              {{ m.content }}
            </div>

            <!-- 이미지 -->
            <div
              v-else-if="m.type === 'image'"
              class="cursor-zoom-in"
              :class="isMine(m) ? 'order-2' : 'order-1'"
              @click="
                $emit('preview-image', { url: m.imageUrl, name: m.fileName })
              "
            >
              <img
                :src="m.imageUrl"
                class="w-64 rounded-xl border object-cover"
              />
              <div class="mt-1 truncate text-xs text-gray-400">
                {{ m.fileName }}
              </div>
            </div>

            <!-- 파일 -->
            <div
              v-else-if="m.type === 'file'"
              class="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"
              :class="[
                isMine(m)
                  ? 'order-2 border-blue-200 bg-blue-50'
                  : 'order-1 border-gray-200 bg-white',
              ]"
            >
              <i
                class="fas fa-paperclip"
                :class="isMine(m) ? 'text-blue-600' : 'text-gray-500'"
              ></i>
              <span class="truncate">{{ m.fileName }}</span>
              <span class="text-xs text-gray-500">· {{ m.fileSize }}</span>
            </div>

            <!-- 동영상 -->
            <div
              v-else-if="m.type === 'video'"
              :class="isMine(m) ? 'order-2' : 'order-1'"
            >
              <video
                :src="m.videoUrl"
                controls
                class="w-72 rounded-xl border"
              ></video>
              <div class="mt-1 truncate text-xs text-gray-400">
                {{ m.fileName }} · {{ m.fileSize }}
              </div>
            </div>

            <!-- 시간: 오른쪽(내 메시지)일 땐 order-1로 맨 바깥, 왼쪽(상대)은 order-2로 메시지 오른쪽 -->
            <span
              class="text-[11px] leading-none"
              :class="
                isMine(m) ? 'order-1 text-gray-300' : 'order-2 text-gray-400'
              "
            >
              {{ m.time }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  messages: { type: Array, default: () => [] },
  currentUser: { type: String, default: '나' },
});
defineEmits(['preview-image']);

const isMine = m => m?.isMine === true || m?.user === props.currentUser;
</script>
