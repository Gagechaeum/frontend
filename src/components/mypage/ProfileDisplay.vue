<script setup>
import { ref, watch } from 'vue';
// import ToastMessage from '@/components/mypage/ToastMessage.vue'   // 그대로 주석

const props = defineProps({
  profile: { type: Object, required: true },
});

const emit = defineEmits(['edit']);

/* 이미지 로드 상태: 실패하면 문구 노출 */
const imgOk = ref(true);
function onImgError() {
  imgOk.value = false;
}
/* 아바타 URL이 바뀌면 다시 시도 */
watch(
  () => props.profile?.avatar,
  () => {
    imgOk.value = true;
  }
);

// 연락처 표시 전용
const displayPhone = computed(() => {
  const digits = (props.profile?.phone ?? '').replace(/[^\d]/g, '');
  if (!digits) return '—';

  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 7);
  const p3 = digits.slice(7, 11);

  if (p3) return `${p1}-${p2}-${p3}`;
  if (p2) return `${p1}-${p2}`;
  return p1;
});
</script>

<template>
  <div class="rounded-2xl border bg-white p-8 shadow-sm">
    <!-- 상단: 아바타 + 이름 -->
    <div class="flex flex-col items-center">
      <!-- 아바타 영역: 동그라미 프레임 -->
      <div
        class="mb-6 h-28 w-28 overflow-hidden rounded-full ring-4 ring-blue-50"
      >
        <!-- 아바타가 있고(imgOk) 로드 성공 -->
        <img
          v-if="props.profile?.avatar && imgOk"
          :key="props.profile?.avatar"
          :src="props.profile?.avatar"
          alt="프로필 사진"
          class="h-full w-full object-cover"
          @error="onImgError"
        />
        <!-- 없거나 로드 실패 시 안내 문구 -->
        <div
          v-else
          class="flex h-full w-full items-center justify-center p-2 text-center text-xs text-gray-500"
        >
          테스트 환경: 이미지가 준비되지 않았습니다.
        </div>
      </div>

      <!-- 이름 우선(없으면 닉네임), 그래도 없으면 '사용자' -->
      <h1 class="mb-6 text-2xl font-bold text-gray-900">
        {{ props.profile?.nickname || '사용자' }}
      </h1>

      <!-- 본문 컨테이너: 폭 좁게 -->
      <div class="w-full max-w-xl">
        <!-- ✅ 기본 정보: 라벨 위, 값 아래, 세로 스택 -->
        <div class="divide-y divide-gray-100 rounded-2xl bg-white">
          <!-- 이름 -->
          <div class="py-4">
            <p class="text-sm text-gray-500">이름</p>
            <p class="mt-1 text-base text-gray-900">
              {{ props.profile?.name || '—' }}
            </p>
          </div>
          <!-- 연락처 -->
          <div class="py-4">
            <p class="text-sm text-gray-500">연락처</p>
            <p class="mt-1 text-base text-gray-900">
              {{ displayPhone }}
            </p>
          </div>
          <!-- 이메일 -->
          <div class="py-4">
            <p class="text-sm text-gray-500">이메일</p>
            <p class="mt-1 text-base text-gray-900">
              {{ props.profile?.email || '—' }}
            </p>
          </div>
        </div>

        <!-- 사업자 정보 -->
        <div
          v-if="
            props.profile?.businesses && props.profile.businesses.length > 0
          "
          class="mt-8"
        >
          <h3 class="mb-3 text-sm font-medium text-gray-700">사업자 정보</h3>

          <ul class="space-y-3">
            <li
              v-for="b in props.profile.businesses"
              :key="b.id ?? b.businessInfoId ?? b.registrationNumber"
              class="rounded-xl bg-gray-50 px-4 py-3"
            >
              <div class="grid gap-4 sm:grid-cols-3">
                <div>
                  <p class="text-xs text-gray-500">사업자 등록번호</p>
                  <p class="mt-1 text-sm font-medium text-gray-900">
                    {{ b.registrationNumber || b.businessNum || '—' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">지역</p>
                  <p class="mt-1 text-sm font-medium text-gray-900">
                    {{ b.region || b.regionName || '—' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">업종</p>
                  <p class="mt-1 text-sm font-medium text-gray-900">
                    {{ b.type || b.industry || b.industryName || '—' }}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- 수정 버튼 -->
        <button
          class="mx-auto mt-8 block w-40 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          @click="$emit('edit')"
        >
          정보 수정
        </button>
      </div>
    </div>
  </div>

  <!-- ToastMessage는 그대로 주석 -->
  <!--
  <ToastMessage
    v-if="toast.show"
    :type="toast.type"
    :message="toast.message"
  />
  -->
</template>
