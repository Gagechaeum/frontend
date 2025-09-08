<template>
  <div class="min-h-[calc(100vh-64px-240px)] bg-neutral-50">
    <div class="container mx-auto py-16 lg:py-24">
      <div
        class="mx-auto max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <h1 class="text-xl font-bold text-neutral-900">회원가입</h1>

        <form class="mt-6 space-y-5" @submit.prevent="onSubmit">
          <div class="grid grid-cols-3 items-end gap-3">
            <div class="col-span-2">
              <label class="mb-1 block text-xs font-bold text-neutral-700"
                >이메일</label
              >
              <input
                v-model.trim="form.email"
                type="email"
                required
                class="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="button"
              :disabled="!form.email || sending || verified"
              class="col-span-1 h-10 rounded-lg bg-neutral-900 text-sm font-semibold text-white disabled:opacity-50"
              @click="onSendCode"
            >
              {{ sending ? '발송 중…' : verified ? '인증완료' : '인증코드' }}
            </button>
          </div>

          <div
            v-if="codeSent && !verified"
            class="grid grid-cols-3 items-end gap-3"
          >
            <div class="col-span-2">
              <label class="mb-1 block text-xs font-bold text-neutral-700"
                >인증코드</label
              >
              <input
                v-model.trim="code"
                type="text"
                maxlength="6"
                class="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
                placeholder="6자리"
              />
            </div>
            <button
              type="button"
              :disabled="!code || confirming"
              class="col-span-1 h-10 rounded-lg border border-neutral-300 text-sm font-semibold disabled:opacity-50"
              @click="onConfirmCode"
            >
              {{ confirming ? '확인 중…' : '확인' }}
            </button>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="mb-1 block text-xs font-bold text-neutral-700"
                >이름</label
              >
              <input
                v-model.trim="form.name"
                required
                class="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-bold text-neutral-700"
                >닉네임</label
              >
              <input
                v-model.trim="form.nickname"
                required
                class="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-bold text-neutral-700"
              >휴대폰 번호</label
            >
            <input
              v-model.trim="form.phone"
              type="tel"
              placeholder="010-1234-5678"
              class="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="mb-1 block text-xs font-bold text-neutral-700"
                >비밀번호</label
              >
              <input
                v-model="form.password"
                type="password"
                minlength="6"
                required
                class="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-bold text-neutral-700"
                >비밀번호 확인</label
              >
              <input
                v-model="form.passwordConfirm"
                type="password"
                minlength="6"
                required
                class="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="submitting || !verified"
            class="h-11 w-full rounded-lg bg-neutral-900 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {{ submitting ? '가입 중…' : '회원가입' }}
          </button>

          <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
          <p v-if="success" class="text-xs text-emerald-600">
            가입이 완료되었어요. 이제 로그인해주세요.
          </p>

          <p class="mt-2 text-center text-sm text-neutral-700">
            이미 계정이 있나요?
            <RouterLink to="/login" class="font-bold underline"
              >로그인</RouterLink
            >
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { signup, requestEmailCode, confirmEmailCode } from '@/lib/api/auth';

const router = useRouter();
const form = reactive({
  email: '',
  name: '',
  nickname: '',
  phone: '',
  password: '',
  passwordConfirm: '',
});

const sending = ref(false);
const confirming = ref(false);
const codeSent = ref(false);
const verified = ref(false);
const code = ref('');

const submitting = ref(false);
const error = ref('');
const success = ref(false);

const onSendCode = async () => {
  error.value = '';
  sending.value = true;
  try {
    await requestEmailCode(form.email);
    codeSent.value = true;
  } catch (e) {
    error.value =
      e?.response?.data?.message || '인증 코드 발송에 실패했습니다.';
  } finally {
    sending.value = false;
  }
};

const onConfirmCode = async () => {
  error.value = '';
  confirming.value = true;
  try {
    await confirmEmailCode(form.email, code.value);
    verified.value = true;
  } catch (e) {
    error.value =
      e?.response?.data?.message || '인증 코드 확인에 실패했습니다.';
  } finally {
    confirming.value = false;
  }
};

const onSubmit = async () => {
  error.value = '';
  submitting.value = true;
  try {
    await signup({ ...form });
    success.value = true;
    setTimeout(() => router.push('/login'), 900);
  } catch (e) {
    error.value = e?.response?.data?.message || '회원가입에 실패했습니다.';
  } finally {
    submitting.value = false;
  }
};
</script>
