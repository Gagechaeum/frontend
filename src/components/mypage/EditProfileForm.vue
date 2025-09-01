<script setup>
import { computed, ref } from 'vue';
import BusinessList from './BusinessList.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  'update:modelValue',
  'cancel',
  'submit',
  'request-delete',
]);

const model = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
});

// 비밀번호 입력값
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// 사진 업로드 → 미리보기 반영
function handleImageUpload(e) {
  const file = e?.target?.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  model.value = { ...model.value, avatar: url };
}

function addBusiness() {
  model.value = {
    ...model.value,
    businesses: [
      ...model.value.businesses,
      {
        id: Date.now(),
        registrationNumber: '',
        region: '서울특별자치시',
        type: '음식·외식업',
      },
    ],
  };
}

function removeBusiness(idx) {
  const copy = [...model.value.businesses];
  copy.splice(idx, 1);
  model.value = { ...model.value, businesses: copy };
}

// 간단 검증(예시)
function validate() {
  if (!model.value.name?.trim()) return '이름을 입력해 주세요.';
  if (!model.value.email?.trim()) return '이메일을 입력해 주세요.';
  if (newPassword.value || confirmPassword.value || currentPassword.value) {
    if (!currentPassword.value) return '현재 비밀번호를 입력해 주세요.';
    if (newPassword.value.length < 8)
      return '새 비밀번호는 8자 이상이어야 합니다.';
    if (newPassword.value !== confirmPassword.value)
      return '새 비밀번호와 확인이 일치하지 않습니다.';
  }
  return null;
}

// 저장(부모로 submit emit)
function onSubmit() {
  const err = validate();
  if (err) {
    alert(err);
    return;
  }
  const payload = { profile: model.value };
  if (newPassword.value) {
    payload.password = {
      current: currentPassword.value,
      next: newPassword.value,
    };
  }
  emit('submit', payload);
}
</script>

<template>
  <div class="rounded-2xl border bg-white p-8 shadow-sm">
    <div class="mb-8 flex items-center justify-between">
      <h2 class="text-2xl font-bold">정보 수정</h2>
      <button class="text-gray-500 hover:text-gray-700" @click="emit('cancel')">
        닫기
      </button>
    </div>

    <form class="space-y-8" @submit.prevent="onSubmit">
      <!-- 프로필 사진 -->
      <div class="flex flex-col items-center">
        <div class="relative">
          <img
            :src="model.avatar"
            alt="프로필"
            class="h-32 w-32 rounded-full object-cover ring-4 ring-blue-50"
          />
          <label
            class="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-600 p-2 text-white shadow"
          >
            <i class="fas fa-camera"></i>
            <input
              type="file"
              class="hidden"
              accept="image/*"
              @change="handleImageUpload"
            />
          </label>
        </div>
      </div>
    </form>

    <form class="space-y-6" @submit.prevent="onSubmit">
      <div>
        <label class="mb-1 block text-sm font-medium">이름</label>
        <input
          v-model="model.name"
          type="text"
          class="w-full rounded-lg border px-4 py-2"
        />
      </div>

      <div class="border-t pt-6">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-medium">사업자 정보</h3>
          <button type="button" class="text-blue-600" @click="addBusiness">
            + 사업자 추가
          </button>
        </div>
        <BusinessList
          :items="model.businesses"
          @remove="removeBusiness"
          @update="v => (model.value = { ...model.value, businesses: v })"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">연락처</label>
        <input
          v-model="model.phone"
          type="tel"
          class="w-full rounded-lg border px-4 py-2"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">이메일</label>
        <input
          v-model="model.email"
          type="email"
          class="w-full rounded-lg border px-4 py-2"
        />
      </div>

      <!-- 비밀번호 변경 -->
      <div class="border-t pt-6">
        <h3 class="mb-4 text-lg font-medium">비밀번호 변경</h3>
        <div class="grid gap-4 md:grid-cols-3">
          <div class="md:col-span-3">
            <label class="mb-1 block text-sm font-medium">현재 비밀번호</label>
            <input
              v-model="currentPassword"
              type="password"
              class="w-full rounded-lg border px-4 py-2"
              autocomplete="current-password"
            />
          </div>
        </div>
        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium">새 비밀번호</label>
            <input
              v-model="newPassword"
              type="password"
              class="w-full rounded-lg border px-4 py-2"
              autocomplete="new-password"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium"
              >새 비밀번호 확인</label
            >
            <input
              v-model="confirmPassword"
              type="password"
              class="w-full rounded-lg border px-4 py-2"
              autocomplete="new-password"
            />
          </div>
        </div>
        <p class="mt-2 text-sm text-gray-500">
          ※ 비밀번호 변경이 필요 없으면 비워 두세요.
        </p>
      </div>

      <div class="border-t pt-6">
        <h3 class="mb-2 text-lg font-medium">계정 탈퇴</h3>
        <button
          type="button"
          class="text-red-600"
          @click="emit('request-delete')"
        >
          계정 탈퇴하기
        </button>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button
          type="button"
          class="rounded-lg border px-6 py-2"
          @click="emit('cancel')"
        >
          취소
        </button>
        <button
          type="submit"
          class="rounded-lg bg-blue-600 px-6 py-2 text-white"
        >
          저장
        </button>
      </div>
    </form>
  </div>
</template>
