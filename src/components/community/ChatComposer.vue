<template>
  <div class="border-t border-gray-200 p-3">
    <div class="relative flex items-center gap-2">
      <!-- 첨부 버튼 -->
      <div class="relative flex items-center">
        <button
          type="button"
          class="rounded-xl border border-gray-200 p-3 text-lg hover:bg-gray-50"
          aria-haspopup="menu"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          title="첨부"
          @click="menuOpen = !menuOpen"
        >
          <i class="fas fa-plus"></i>
        </button>

        <!-- 팝업 -->
        <div
          v-if="menuOpen"
          class="absolute bottom-full left-0 z-50 mb-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
          role="menu"
          @keydown.esc="menuOpen = false"
        >
          <button
            type="button"
            class="flex w-full items-center gap-3 px-4 py-3 text-base hover:bg-gray-50"
            role="menuitem"
            @click="triggerPick('image')"
          >
            <i class="fas fa-image"></i> 이미지
          </button>
          <button
            type="button"
            class="flex w-full items-center gap-3 px-4 py-3 text-base hover:bg-gray-50"
            role="menuitem"
            @click="triggerPick('video')"
          >
            <i class="fas fa-video"></i> 동영상
          </button>
          <button
            type="button"
            class="flex w-full items-center gap-3 px-4 py-3 text-base hover:bg-gray-50"
            role="menuitem"
            @click="triggerPick('file')"
          >
            <i class="fas fa-paperclip"></i> 파일
          </button>
        </div>
      </div>

      <!-- 입력창 -->
      <textarea
        v-model="text"
        rows="1"
        placeholder="메시지를 입력하세요"
        class="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
        @focus="menuOpen = false"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false"
        @keydown.enter.exact.prevent="onEnter"
      ></textarea>

      <!-- 전송 버튼 (폼 submit 아님) -->
      <button
        type="button"
        class="rounded-xl bg-yellow-400 px-5 py-3 text-base font-semibold text-white transition hover:bg-yellow-500"
        @click="onSendText"
      >
        보내기
      </button>

      <!-- 숨겨진 파일 인풋 -->
      <input
        ref="imageInput"
        type="file"
        accept="image/*"
        class="hidden"
        :multiple="allowMultiple"
        @change="onPick('image', $event)"
      />
      <input
        ref="videoInput"
        type="file"
        accept="video/*"
        class="hidden"
        :multiple="allowMultiple"
        @change="onPick('video', $event)"
      />
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :multiple="allowMultiple"
        @change="onPick('file', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const text = ref('');
const menuOpen = ref(false);
const allowMultiple = true;

const imageInput = ref(null);
const videoInput = ref(null);
const fileInput = ref(null);

// 한글/중국어 등 IME 조합 여부
const isComposing = ref(false);

const emit = defineEmits([
  'send-text',
  'send-image',
  'send-video',
  'send-file',
]);

const onSendText = () => {
  const t = text.value || '';
  if (!t.trim()) return;
  emit('send-text', t);
  text.value = '';
};

const onEnter = e => {
  // IME 조합 중이면 전송하지 않음
  if (isComposing.value) return;
  onSendText();
};

const triggerPick = type => {
  menuOpen.value = false;
  if (type === 'image') imageInput.value?.click();
  else if (type === 'video') videoInput.value?.click();
  else fileInput.value?.click();
};

const onPick = (type, e) => {
  const files = Array.from(e.target.files || []);
  e.target.value = ''; // 같은 파일 재선택 대비 초기화
  if (!files.length) return;

  // File -> { url, name, file } 로 변환
  const infos = files.map(file => ({
    url: URL.createObjectURL(file),
    name: file.name,
    file, // 필요 시 원본 파일 유지
  }));

  // 부모는 fileInfo "하나"를 기대하므로, 파일 여러 개여도 하나씩 emit
  const send = info => {
    if (type === 'image') emit('send-image', info);
    else if (type === 'video') emit('send-video', info);
    else emit('send-file', info);
  };

  infos.forEach(send);
};
</script>
