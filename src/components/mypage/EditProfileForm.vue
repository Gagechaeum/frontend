<script setup>
import { ref, watch } from 'vue';
import BusinessList from './BusinessList.vue';

// 안전한 딥클론(Proxy/함수 제거)
const deepClone = v => JSON.parse(JSON.stringify(v ?? {}));

const props = defineProps({
  modelValue: { type: Object, required: true },
});
const emit = defineEmits([
  'update:modelValue',
  'cancel',
  'submit',
  'request-delete',
]);

const makeInitial = src => {
  const base = { name: '', phone: '', email: '', avatar: '', businesses: [] };
  const obj = Object.assign(base, deepClone(src));
  if (!Array.isArray(obj.businesses)) obj.businesses = [];
  return obj;
};

const form = ref(makeInitial(props.modelValue));

watch(
  () => props.modelValue,
  v => {
    form.value = makeInitial(v);
  },
  { deep: true }
);

/* ---------- 프로필 사진 업로드 & 미리보기 ---------- */
function handleImageUpload(e) {
  const file = e?.target?.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  form.value.avatar = url; // 미리보기만 반영 (실사용은 파일 업로드 API와 함께 처리)
}

/* ---------- 비밀번호 변경 ---------- */
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

function validateBeforeSave() {
  // 비밀번호 변경 섹션이 비어있으면 통과
  const anyPw =
    currentPassword.value || newPassword.value || confirmPassword.value;
  if (!anyPw) return null;

  if (!currentPassword.value) return '현재 비밀번호를 입력해 주세요.';
  if ((newPassword.value || '').length < 8)
    return '새 비밀번호는 8자 이상이어야 합니다.';
  if (newPassword.value !== confirmPassword.value)
    return '새 비밀번호와 확인이 일치하지 않습니다.';
  return null;
}

/* ---------- 사업자 추가/삭제 ---------- */
function addBusiness() {
  if (form.value.businesses.length >= 10) {
    alert('사업자 정보는 최대 10개까지 등록할 수 있어요.');
    return;
  }
  form.value.businesses = [
    ...form.value.businesses,
    {
      id: Date.now(),
      registrationNumber: '',
      region: '서울특별시',
      type: '음식·외식업',
    },
  ];
}

/* 삭제 확인 모달 */
const removeModalOpen = ref(false);
const removeIndex = ref(-1);

function askRemoveBusiness(i) {
  removeIndex.value = i;
  removeModalOpen.value = true;
}
function confirmRemoveBusiness() {
  const i = removeIndex.value;
  if (i >= 0 && i < form.value.businesses.length) {
    const copy = [...form.value.businesses];
    copy.splice(i, 1);
    form.value.businesses = copy;
  }
  removeModalOpen.value = false;
  removeIndex.value = -1;
}
function cancelRemoveBusiness() {
  removeModalOpen.value = false;
  removeIndex.value = -1;
}

/* 저장 */
function onSubmit() {
  const err = validateBeforeSave();
  if (err) {
    alert(err);
    return;
  }
  // 부모는 기존대로 profile 객체만 받아도 동작합니다.
  emit('submit', deepClone(form.value));

  // 필요 시 비밀번호 payload를 추가로 보내고 싶다면:
  // const pwPayload = currentPassword.value ? { current: currentPassword.value, next: newPassword.value } : null;
  // emit('submit', { profile: deepClone(form.value), password: pwPayload });
}
</script>

<template>
  <div class="rounded-2xl border bg-white p-8 shadow-sm">
    <div class="mb-2 flex items-center justify-between">
      <h2 class="text-2xl font-bold">정보 수정</h2>
    </div>

    <!-- 프로필 사진 + 닉네임 표시 -->
    <div class="mb-8 flex flex-col items-center">
      <div class="relative">
        <img
          :src="form.avatar || 'https://placehold.co/160x160?text=Avatar'"
          alt="프로필"
          class="h-32 w-32 rounded-full object-cover ring-4 ring-blue-50"
        />
        <label
          class="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-blue-600 p-2 text-white shadow"
          title="사진 변경"
        >
          <i class="fas fa-camera text-sm"></i>
          <input
            type="file"
            class="hidden"
            accept="image/*"
            @change="handleImageUpload"
          />
        </label>
      </div>
      <div class="mt-3 text-xl font-bold">{{ form.name || '닉네임' }}</div>
    </div>

    <!-- 기본 정보 -->
    <div class="space-y-6">
      <div>
        <label class="mb-1 block text-sm font-medium">닉네임</label>
        <input
          v-model="form.nickName"
          type="text"
          class="w-full rounded-lg border px-4 py-2"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">연락처</label>
        <input
          v-model="form.phone"
          type="tel"
          class="w-full rounded-lg border px-4 py-2"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">이메일</label>
        <input
          v-model="form.email"
          type="email"
          class="w-full rounded-lg border px-4 py-2"
        />
      </div>
    </div>

    <!-- 비밀번호 변경 -->
    <div class="mt-10 border-t pt-6">
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
          <label class="mb-1 block text-sm font-medium">새 비밀번호 확인</label>
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

    <!-- 사업자 정보 -->
    <div class="mt-10">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-lg font-semibold">사업자 정보</h3>
        <button class="text-blue-600 hover:underline" @click="addBusiness">
          + 사업자 추가
        </button>
      </div>

      <BusinessList
        :items="form.businesses"
        @update="v => (form.businesses = v)"
        @request-remove="askRemoveBusiness"
      />
    </div>

    <!-- 계정 탈퇴 -->
    <div class="mt-10 border-t pt-6">
      <h3 class="mb-2 text-lg font-medium text-red-600">계정 탈퇴</h3>
      <p class="mb-2 text-sm text-gray-600">
        계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
      </p>
      <button
        type="button"
        class="text-red-600 hover:underline"
        @click="$emit('request-delete')"
      >
        계정 탈퇴하기
      </button>
    </div>

    <div class="mt-8 flex justify-end gap-3">
      <button
        type="button"
        class="rounded-lg border px-6 py-2"
        @click="$emit('cancel')"
      >
        취소
      </button>
      <button
        type="button"
        class="rounded-lg bg-blue-600 px-6 py-2 text-white"
        @click="onSubmit"
      >
        저장
      </button>
    </div>
  </div>

  <!-- 사업자 삭제 확인 모달 -->
  <div
    v-if="removeModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click="cancelRemoveBusiness"
  >
    <div class="w-full max-w-md rounded-xl bg-white p-6" @click.stop>
      <h4 class="mb-2 text-lg font-semibold">사업자 정보 삭제</h4>
      <p class="mb-6 text-sm text-gray-600">
        선택한 사업자 정보를 정말 삭제하시겠어요? 이 작업은 취소할 수 없습니다.
      </p>
      <div class="flex justify-end gap-2">
        <button
          class="rounded-lg border px-4 py-2"
          @click="cancelRemoveBusiness"
        >
          취소
        </button>
        <button
          class="rounded-lg bg-red-600 px-4 py-2 text-white"
          @click="confirmRemoveBusiness"
        >
          삭제
        </button>
      </div>
    </div>
  </div>
</template>
