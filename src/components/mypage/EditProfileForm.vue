<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { isNicknameExist, changePassword, withdraw } from '@/lib/api/mypage';
import BusinessList from '@/components/mypage/BusinessList.vue';
import DeleteConfirmModal from '@/components/mypage/DeleteConfirmModal.vue';
// import { useToast } from '@/stores/toast';
import { useMyPageViewStore } from '@/stores/mypageView';
const view = useMyPageViewStore();

const router = useRouter();

// const {
//   show: showToast,
//   error: toastError,
//   success: toastSuccess,
// } = useToast();

const bizList = ref(null);
const avatarFile = ref(null); // ✅ 파일 보관용

/* ───────────── 탈퇴 모달 ───────────── */
const showDeleteModal = ref(false);
function onClickDelete() {
  showDeleteModal.value = true;
}
function onCancelDelete() {
  showDeleteModal.value = false;
}
async function onConfirmDelete() {
  try {
    await withdraw(); // ✅ API 호출 (함수명 일치)
    showDeleteModal.value = false;
    router.push('/'); // ✅ 홈으로 이동
  } catch (err) {
    console.error('계정 탈퇴 실패:', err);
    alert('계정 탈퇴에 실패했습니다. 다시 시도해주세요.');
  }
}

/* ───────────── 상단 저장 버튼(미사용 시 삭제 가능) ───────────── */
async function onClickSave() {
  const ok = bizList.value?.validateAll?.();
  if (!ok) {
    // toastError('모든 사업자 정보를 입력해 주세요.'); // ✅ 토스트 통일
    return;
  }
}

/* ───────────── props / emits ───────────── */
const props = defineProps({ modelValue: { type: Object, required: true } });
const emit = defineEmits([
  'update:modelValue',
  'submit',
  'cancel',
  'requestDelete',
]);

/* ───────────── 폼 바인딩 ───────────── */
const form = reactive({
  avatar: props.modelValue?.avatar ?? '',
  name: props.modelValue?.name ?? '',
  nickname: props.modelValue?.nickname ?? '',
  email: props.modelValue?.email ?? '',
  phone: props.modelValue?.phone ?? '',
  businesses: Array.isArray(props.modelValue?.businesses)
    ? [...props.modelValue.businesses]
    : [],
});

/* 상위 모델 변경 시 동기화 */
watch(
  () => props.modelValue,
  v => {
    if (!v) return;
    form.avatar = v.avatar ?? '';
    form.name = v.name ?? '';
    form.nickname = v.nickname ?? '';
    form.email = v.email ?? '';
    form.phone = v.phone ?? '';
    form.businesses = Array.isArray(v.businesses) ? [...v.businesses] : [];
    if (v.phone && v.phone !== phoneInput.value) phoneInput.value = v.phone;
  },
  { deep: true }
);

/* ───────────── 연락처 ───────────── */
const phoneInput = ref(formatPhone(props.modelValue?.phone || ''));
const touched = ref({ phone: false });

function formatPhone(raw) {
  let digits = String(raw ?? '').replace(/\D/g, '');
  digits = digits.slice(0, 11);
  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 7);
  const p3 = digits.slice(7, 11);
  if (p3) return `${p1}-${p2}-${p3}`;
  if (p2) return `${p1}-${p2}`;
  return p1;
}
// const onPhoneInput = () => {
//   phoneInput.value = formatPhone(phoneInput.value);
// };
watch(phoneInput, val => {
  if (val == null) return;
  const formatted = formatPhone(val);
  if (val !== formatted) phoneInput.value = formatted; // 하이픈 자동 삽입
});
const phoneValid = computed(() => /^010-\d{4}-\d{4}$/.test(phoneInput.value));
const phoneError = computed(
  () => phoneInput.value.length > 0 && !phoneValid.value
);

/* 유효하면 상위/폼에 반영 */
watch(phoneValid, ok => {
  if (ok) {
    form.phone = phoneInput.value;
    emit('update:modelValue', { ...props.modelValue, phone: phoneInput.value });
  }
});

/* 템플릿 @focus 남아있을 수 있어 no-op */
const ensure010Prefix = () => {};

/* ───────────── 닉네임(디바운스 중복 확인) ───────────── */
const nicknameError = ref('');
const nicknameChecking = ref(false);
const debounceId = ref(null);
const originalNickname = ref(props.modelValue?.nickname ?? '');

watch(
  () => form.nickname,
  val => {
    const nick = (val ?? '').trim();

    if (!nick) {
      nicknameError.value = '닉네임은 비워둘 수 없습니다.';
      nicknameChecking.value = false;
      if (debounceId.value) clearTimeout(debounceId.value);
      return;
    }

    if (nick === (originalNickname.value ?? '').trim()) {
      nicknameError.value = '';
      nicknameChecking.value = false;
      if (debounceId.value) clearTimeout(debounceId.value);
      return;
    }

    if (debounceId.value) clearTimeout(debounceId.value);
    nicknameChecking.value = true;
    debounceId.value = setTimeout(async () => {
      try {
        const res = await isNicknameExist(nick);
        nicknameError.value =
          res?.name === 'CAN_USE_NICKNAME'
            ? ''
            : res?.message || '이미 사용 중인 닉네임입니다.';
      } catch {
        nicknameError.value = '닉네임 확인 중 오류가 발생했습니다.';
      } finally {
        nicknameChecking.value = false;
      }
    }, 300);
  }
);

/* ───────────── 비밀번호 검증 ───────────── */
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const oldPwError = ref('');
const newPwError = ref('');
const confirmPwError = ref('');

/* 8~20자, 영문/숫자/특수문자 각 1개 이상 */
const PW_RULE =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={[}\]|\\;:'",.<>/?]).{8,20}$/;
watch(newPassword, v => {
  const val = (v ?? '').trim();
  if (!val) newPwError.value = '새 비밀번호를 입력해 주세요.';
  else if (!PW_RULE.test(val))
    newPwError.value = '8~20자, 영문/숫자/특수문자 포함해야 합니다.';
  else newPwError.value = '';

  const c = (confirmPassword.value ?? '').trim();
  if (c)
    confirmPwError.value = val === c ? '' : '비밀번호가 일치하지 않습니다.';
});
watch(confirmPassword, c => {
  const val = (newPassword.value ?? '').trim();
  const conf = (c ?? '').trim();
  if (!conf) confirmPwError.value = '비밀번호 확인을 입력해 주세요.';
  else if (val !== conf) confirmPwError.value = '비밀번호가 일치하지 않습니다.';
  else confirmPwError.value = '';
});

/* ───────────── 아바타 업로드(미리보기 + 파일 전달) ───────────── */
function handleImageUpload(e) {
  const file = e?.target?.files?.[0];
  if (!file) return;

  // (1) 미리보기용 URL 생성해서 즉시 화면 반영
  avatarFile.value = file;
  const url = URL.createObjectURL(file);
  form.avatar = url;

  // (2) 부모로 "모델 업데이트" 이벤트 전파 (미리보기 URL + 실제 파일)
  emit('update:modelValue', {
    ...props.modelValue,
    avatar: url, // 화면 미리보기용
    avatarFile: file, // 실제 업로드할 File 객체
  }); // ✅ 파일도 전달
}

/* ───────────── 사업자 추가/삭제 ───────────── */
const removeModalOpen = ref(false);
const removeTargetIndex = ref(null);

function addBusiness() {
  form.businesses.push({
    id: crypto?.randomUUID?.() || Date.now(),
    name: '',
    regionId: null,
    industryId: null,
    businessNum: '',
    estbDate: '',
  });
  emit('update:modelValue', {
    ...props.modelValue,
    businesses: [...form.businesses],
  });
}
function askRemoveBusiness(index) {
  removeTargetIndex.value = index;
  removeModalOpen.value = true;
}
function cancelRemoveBusiness() {
  removeModalOpen.value = false;
  removeTargetIndex.value = null;
}
function confirmRemoveBusiness() {
  if (removeTargetIndex.value == null) return;
  form.businesses.splice(removeTargetIndex.value, 1);
  emit('update:modelValue', {
    ...props.modelValue,
    businesses: [...form.businesses],
  });
  cancelRemoveBusiness();
}

/* ───────────── 저장(Submit) ───────────── */
async function onSubmit() {
  // 0) 사업자 정보 필수값(등록번호/지역/업종) 검증
  const okBiz = bizList.value?.validateAll?.();
  if (!okBiz) {
    showToast('모든 사업자 정보를 입력해 주세요.', 'error'); // useToast()에서 가져온 showToast
    return;
  }

  // 1) 연락처
  touched.value.phone = true;
  if (!phoneValid.value) return;

  // 2) 닉네임
  if (!form.nickname || !form.nickname.trim()) {
    nicknameError.value = '닉네임은 비워둘 수 없습니다.';
    return;
  }
  if (nicknameError.value || nicknameChecking.value) return;

  // 3) 비밀번호 변경(선택)
  const anyPwFilled =
    !!newPassword.value || !!oldPassword.value || !!confirmPassword.value;

  if (anyPwFilled) {
    if (!oldPassword.value?.trim()) {
      oldPwError.value = '현재 비밀번호를 입력해 주세요.';
      return;
    }
    if (!newPassword.value?.trim()) {
      newPwError.value = '새 비밀번호를 입력해 주세요.';
      return;
    }
    if (!confirmPassword.value?.trim()) {
      confirmPwError.value = '비밀번호 확인을 입력해 주세요.';
      return;
    }
    if (newPwError.value || confirmPwError.value || oldPwError.value) return;

    try {
      const res = await changePassword(
        confirmPassword.value.trim(),
        newPassword.value.trim(),
        oldPassword.value.trim()
      );
      if (!(res?.success ?? false)) {
        oldPwError.value = res?.message || '현재 비밀번호가 올바르지 않습니다.';
        return;
      }
      // 성공 시 입력칸 정리
      oldPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
      oldPwError.value = '';
      newPwError.value = '';
      confirmPwError.value = '';
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 401 || err?.response?.status === 400
          ? '현재 비밀번호가 올바르지 않습니다.'
          : '비밀번호 변경에 실패했습니다.');
      oldPwError.value = msg;
      return;
    }
  }

  // 4) 나머지 프로필 업데이트는 부모로 전달
  console.log(
    '아바타 잘 들어오는지 [Child] avatarFile in submit =',
    avatarFile.value
  );
  const payload = {
    ...props.modelValue, // (여기에 1단계에서 들어간 avatarFile이 이미 포함될 수 있음)
    ...form, // 폼의 최신 값들(avatar 미리보기 URL 포함)
    phone: phoneInput.value, // 포맷된 전화번호
    avatarFile: avatarFile.value,
  };
  emit('update:modelValue', payload);
  emit('submit', payload);
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
          :src="form.avatar || '사진이 오지 않고 있음'"
          alt="프로필"
          class="h-32 w-32 rounded-full object-cover ring-4 ring-blue-50"
        />
        <label
          class="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow"
          title="사진 변경"
        >
          <i class="fas fa-camera text-sm"></i>
          <!-- 사용자가 파일을 고를때 @change 실행 -->
          <input
            type="file"
            class="hidden"
            accept="image/*"
            @change="handleImageUpload"
          />
        </label>
      </div>
      <div class="mt-3 text-xl font-bold">
        {{ form.name || '이름을 가져오지 못 함' }}
      </div>
    </div>

    <!-- 기본 정보 -->
    <div class="space-y-6">
      <div>
        <label class="mb-1 block text-sm font-medium">닉네임</label>
        <input
          v-model="form.nickname"
          type="text"
          class="w-full rounded-lg border px-4 py-2"
        />
        <p v-if="nicknameChecking" class="mt-1 text-xs text-gray-500">
          닉네임 중복 확인 중...
        </p>
        <p v-if="nicknameError" class="mt-1 text-xs text-red-600">
          {{ nicknameError }}
        </p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">연락처</label>
        <input
          v-model="phoneInput"
          type="tel"
          class="w-full rounded-lg border px-4 py-2"
          maxlength="13"
          inputmode="numeric"
          @input="e => (phoneInput.value = formatPhone(e.target.value))"
          @blur="touched.phone = true"
        />
        <p v-if="phoneError" class="mt-1 text-xs text-red-600">
          연락처는 <strong>010-1234-5678</strong> 형식이어야 합니다.
        </p>
      </div>

      <div class="space-y-1">
        <span class="block text-sm font-medium text-gray-700">이메일</span>
        <p class="select-text rounded-lg bg-gray-50 px-3 py-2 text-gray-700">
          {{ form.email || '-' }}
        </p>
      </div>
    </div>

    <!-- 비밀번호 변경 -->
    <div class="mt-10 border-t pt-6">
      <h3 class="mb-4 text-lg font-medium">비밀번호 변경</h3>

      <div class="mb-6">
        <label class="mb-1 block text-sm font-medium">현재 비밀번호</label>
        <input
          v-model="oldPassword"
          type="password"
          class="w-full rounded-lg border px-4 py-2"
          autocomplete="old-password"
        />
        <p v-if="oldPwError" class="mt-1 text-xs text-red-600">
          {{ oldPwError }}
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium">새 비밀번호</label>
          <input
            v-model="newPassword"
            type="password"
            class="w-full rounded-lg border px-4 py-2"
            autocomplete="new-password"
          />
          <p v-if="newPwError" class="mt-1 text-xs text-red-600">
            {{ newPwError }}
          </p>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium">새 비밀번호 확인</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="w-full rounded-lg border px-4 py-2"
            autocomplete="confirm-password"
          />
          <p v-if="confirmPwError" class="mt-1 text-xs text-red-600">
            {{ confirmPwError }}
          </p>
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

      <!-- 사업자 정보 섹션 안 -->
      <BusinessList
        ref="bizList"
        :items="form.businesses"
        @update="val => (form.businesses = val)"
        @request-remove="askRemoveBusiness"
        @request-verify="
          i => {
            if (form.businesses[i]) form.businesses[i].verified = true;
          }
        "
      />
    </div>

    <!-- 계정 탈퇴 -->
    <div class="mt-5 border-t pt-5"></div>

    <!-- 버튼 줄 -->
    <div class="mt-1 flex w-full items-center justify-between">
      <!-- 왼쪽: 계정 탈퇴하기 -->
      <button
        type="button"
        class="rounded-md border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        @click="onClickDelete"
      >
        계정 탈퇴하기
      </button>

      <!-- 모달 -->
      <DeleteConfirmModal
        v-if="showDeleteModal"
        @cancel="onCancelDelete"
        @confirm="onConfirmDelete"
      />

      <!-- 오른쪽: 취소 + 저장 -->
      <div class="flex space-x-2">
        <!-- 취소 -->
        <button
          type="button"
          class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          @click="$emit('cancel')"
        >
          취소
        </button>

        <!-- 저장 : disabled 빈칸인데 저장하지 못하게 함-->
        <button
          type="button"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          @click="onSubmit"
        >
          저장
        </button>
      </div>
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
        선택한 사업자 정보를 정말 삭제하시겠어요? <br />
        이 작업은 취소할 수 없습니다.
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
