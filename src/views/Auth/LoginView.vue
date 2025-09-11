<template>
  <div class="min-h-[calc(100vh-64px-240px)] bg-neutral-50">
    <div class="container mx-auto py-16 lg:py-24">
      <div class="grid grid-cols-12 items-start gap-8 lg:gap-12">
        <section class="col-span-12 lg:col-span-7">
          <UiButton variant="ghost" size="md" @click="goHome" class="mb-6">
            <template #leading>
              <i class="fas fa-home text-neutral-900"></i>
            </template>
            <span class="text-base">홈으로</span>
          </UiButton>
          <p class="mb-4 text-3xl font-bold text-neutral-900 md:text-4xl">
            다시 오신 것을 환영합니다
          </p>
          <p class="text-neutral-700">
            로그인하여 맞춤형 금융 상품을 확인하고<br class="hidden md:block" />
            간편하게 대출 신청을 진행하세요.
          </p>
        </section>

        <section class="col-span-12 lg:col-span-5">
          <div
            class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <h2 class="text-xl font-bold text-neutral-900">로그인</h2>

            <form novalidate class="mt-6 space-y-4" @submit.prevent="onSubmit">
              <div>
                <label class="mb-1 block text-xs font-bold text-neutral-700"
                  >이메일</label
                >
                <div
                  :class="[
                    'flex items-center gap-2 rounded-lg border px-3 py-2',
                    emailError
                      ? 'border-red-500/70 bg-red-50'
                      : 'border-neutral-200 bg-white',
                  ]"
                >
                  <input
                    v-model="email"
                    type="email"
                    inputmode="email"
                    autocomplete="email"
                    placeholder="이메일을 입력해주세요"
                    class="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
                    :aria-invalid="!!emailError"
                  />
                </div>
                <p v-if="emailError" class="mt-1 text-xs text-red-600">
                  {{ emailError }}
                </p>
              </div>

              <div>
                <label class="mb-1 block text-xs font-bold text-neutral-700"
                  >비밀번호</label
                >
                <div
                  :class="[
                    'flex items-center gap-2 rounded-lg border px-3 py-2',
                    passwordError
                      ? 'border-red-500/70 bg-red-50'
                      : 'border-neutral-200 bg-white',
                  ]"
                >
                  <input
                    v-model="password"
                    type="password"
                    autocomplete="current-password"
                    placeholder="비밀번호를 입력해주세요"
                    class="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
                    :aria-invalid="!!passwordError"
                  />
                </div>
                <p v-if="passwordError" class="mt-1 text-xs text-red-600">
                  {{ passwordError }}
                </p>
              </div>

              <button
                type="submit"
                :disabled="submitting"
                class="h-11 w-full rounded-lg bg-neutral-900 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                {{ submitting ? '로그인 중…' : '로그인' }}
              </button>

              <p v-if="serverError" class="text-xs text-red-600">
                {{ serverError }}
              </p>
            </form>

            <div class="my-5 flex items-center gap-3">
              <div class="h-px flex-1 bg-neutral-200"></div>
              <span class="text-xs text-neutral-500">또는</span>
              <div class="h-px flex-1 bg-neutral-200"></div>
            </div>

            <!-- 네이버 소셜 로그인 (컴포넌트로 분리) -->
            <NaverLoginButton />

            <p class="mt-5 text-center text-sm text-neutral-700">
              계정이 없으신가요?
              <RouterLink to="/signup" class="font-bold underline"
                >회원가입</RouterLink
              >
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { login } from '@/lib/api/auth';
import NaverLoginButton from '@/components/auth/NaverLoginButton.vue';
import UiButton from '@/components/common/UiButton.vue';

const route = useRoute();
const router = useRouter();

const email = ref('');
const password = ref('');
const emailError = ref('');
const passwordError = ref('');
const serverError = ref('');
const submitting = ref(false);

const validate = () => {
  emailError.value = '';
  passwordError.value = '';
  if (!email.value) emailError.value = '이메일을 입력해주세요';
  if (!password.value) passwordError.value = '비밀번호를 입력해주세요';
  return !(emailError.value || passwordError.value);
};

const goHome = () => {
  router.push('/');
};

const onSubmit = async () => {
  if (!validate()) return;
  submitting.value = true;
  serverError.value = '';
  try {
    await login(email.value, password.value); // 기존 로컬 로그인 로직 그대로

    // 로그인 성공 후 authStore 상태 강제 업데이트
    const { useAuthStore } = await import('@/stores/auth');
    const authStore = useAuthStore();
    await authStore.hydrateSession();

    const next = route.query.next || '/';
    router.replace(String(next));
  } catch (e) {
    serverError.value = e?.message || '이메일 또는 비밀번호를 확인해주세요.';
  } finally {
    submitting.value = false;
  }
};
</script>
