<script setup>
import { ref } from 'vue';
// import ToastMessage from '@/components/mypage/ToastMessage.vue'   // 그대로 주석

const props = defineProps({
  profile: { type: Object, required: true },
});

const emit = defineEmits(['edit']);
</script>

<template>
  <div class="rounded-2xl border bg-white p-8 shadow-sm">
    <!-- 상단: 아바타 + 이름 -->
    <div class="flex flex-col items-center">
      <img
        :src="props.profile.avatar"
        alt="프로필 사진"
        class="mb-6 h-28 w-28 rounded-full object-cover ring-4 ring-blue-50"
      />
      <h1 class="mb-6 text-2xl font-bold text-gray-900">
        {{ props.profile.nickName }}
      </h1>

      <!-- 본문 컨테이너: 폭 좁게 -->
      <div class="w-full max-w-xl">
        <!-- ✅ 기본 정보: 라벨 위, 값 아래, 세로 스택 -->
        <div class="divide-y divide-gray-100 rounded-2xl bg-white">
          <!-- 이름 -->
          <div class="py-4">
            <p class="text-sm text-gray-500">이름</p>
            <p class="mt-1 text-base text-gray-900">
              {{ props.profile.realName || props.profile.name }}
            </p>
          </div>
          <!-- 연락처 -->
          <div class="py-4">
            <p class="text-sm text-gray-500">연락처</p>
            <p class="mt-1 text-base text-gray-900">
              {{ props.profile.phone }}
            </p>
          </div>
          <!-- 이메일 -->
          <div class="py-4">
            <p class="text-sm text-gray-500">이메일</p>
            <p class="mt-1 text-base text-gray-900">
              {{ props.profile.email }}
            </p>
          </div>
        </div>

        <!-- 사업자 정보 -->
        <div class="mt-8">
          <h3 class="mb-3 text-sm font-medium text-gray-700">사업자 정보</h3>

          <ul class="space-y-3">
            <li
              v-for="b in props.profile.businesses"
              :key="b.id"
              class="rounded-xl bg-gray-50 px-4 py-3"
            >
              <div class="grid gap-4 sm:grid-cols-3">
                <div>
                  <p class="text-xs text-gray-500">사업자 등록번호</p>
                  <p class="mt-1 text-sm font-medium text-gray-900">
                    {{ b.registrationNumber || '—' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">지역</p>
                  <p class="mt-1 text-sm font-medium text-gray-900">
                    {{ b.region || '—' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">업종</p>
                  <p class="mt-1 text-sm font-medium text-gray-900">
                    {{ b.type || '—' }}
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
