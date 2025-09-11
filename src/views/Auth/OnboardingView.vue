<template>
  <div class="mx-auto max-w-3xl px-4 py-10">
    <header class="mb-8">
      <h1 class="text-2xl font-bold">온보딩</h1>
      <p class="mt-1 text-sm text-neutral-600">사업자 인증 → 설문 입력 → 확인 & 완료</p>
      <div class="mt-4 grid grid-cols-3 gap-2">
        <div :class="['h-2 rounded', step >= 1 ? 'bg-blue-600' : 'bg-neutral-200']"></div>
        <div :class="['h-2 rounded', step >= 2 ? 'bg-blue-600' : 'bg-neutral-200']"></div>
        <div :class="['h-2 rounded', step >= 3 ? 'bg-blue-600' : 'bg-neutral-200']"></div>
      </div>
    </header>

    <!-- Step 1: 사업자 인증 -->
    <section v-if="step === 1" class="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 class="mb-1 text-xl font-semibold">1) 사업자 인증</h2>
      <p class="mb-6 text-sm text-neutral-600">사업자등록번호와 개업일을 입력해 인증해 주세요.</p>

      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium">사업자등록번호</label>
          <input v-model="bizNumInput" @input="onBizNumInput" type="text" inputmode="numeric"
                 placeholder="000-00-00000"
                 class="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium">개업일</label>
          <input v-model="estbDate" type="date"
                 class="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div class="md:col-span-2">
          <button :disabled="verifying || !canVerify" @click="handleVerify"
                  class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50">
            <span v-if="verifying">확인 중...</span>
            <span v-else>인증하기</span>
          </button>
          <span v-if="verifyMsg" :class="['ml-3 text-sm', verified ? 'text-green-600' : 'text-red-600']">{{ verifyMsg }}</span>
        </div>
      </div>

      <transition name="fade">
        <div v-if="verified" class="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium">지역</label>
            <select v-model.number="regionId" class="w-full rounded-xl border px-3 py-2">
              <option :value="null" disabled>선택하세요</option>
              <option v-for="opt in REGION_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium">업종</label>
            <select v-model.number="industryId" class="w-full rounded-xl border px-3 py-2">
              <option :value="null" disabled>선택하세요</option>
              <option v-for="opt in INDUSTRY_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div class="md:col-span-2 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 text-sm">
            <div class="text-blue-900">인증된 사업자로 저장하면 맞춤 추천이 더 정확해져요.</div>
            <button :disabled="saving || !canSaveBusiness" @click="saveBusiness"
                    class="rounded-lg bg-blue-700 px-4 py-2 font-medium text-white disabled:opacity-50">
              저장하고 다음
            </button>
          </div>
        </div>
      </transition>
    </section>

    <!-- Step 2: 설문 -->
    <section v-else-if="step === 2" class="rounded-2xl border bg-white p-6 shadow-sm">
      <!-- ... 설문 UI (기존 코드 동일) -->
    </section>

    <!-- Step 3: 확인 & 완료 -->
    <section v-else class="rounded-2xl border bg-white p-6 shadow-sm">
      <!-- ... 확인 UI (기존 코드 동일) -->
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { verifyBusinessNumber, createBusiness } from '@/lib/api/onboarding'
import { REGION_OPTIONS, INDUSTRY_OPTIONS } from '@/constants/business'

const router = useRouter()

// Step
const step = ref(1)

// 사업자 인증 관련
const bizNumInput = ref('')
const estbDate = ref('')
const verifying = ref(false)
const verified = ref(false)
const verifyMsg = ref('')
const regionId = ref(null)
const industryId = ref(null)

function onBizNumInput(e) {
  const d = (e?.target?.value ?? bizNumInput.value ?? '').replace(/\D/g, '').slice(0, 10)
  bizNumInput.value = d.length >= 10 ? `${d.slice(0,3)}-${d.slice(3,5)}-${d.slice(5)}` : d
}

const canVerify = computed(() => {
  const digits = bizNumInput.value.replace(/\D/g, '')
  return digits.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(estbDate.value)
})
const canSaveBusiness = computed(() => verified.value && regionId.value && industryId.value)

async function handleVerify() {
  verifying.value = true
  verifyMsg.value = ''
  try {
    const digits = bizNumInput.value.replace(/\D/g, '')
    // 👇 startDate를 yyyyMMdd 형식으로 변환
    const date = estbDate.value.replaceAll('-', '')  
    const res = await verifyBusinessNumber(digits, date)
    const ok = res?.data === true || res?.valid === true
    verified.value = ok
    verifyMsg.value = ok ? '유효한 사업자입니다.' : '인증에 실패했습니다.'
  } catch (e) {
    verified.value = false
    verifyMsg.value = '인증 중 오류가 발생했습니다.'
    console.error('[onboarding] verify error', e)
  } finally {
    verifying.value = false
  }
}

const saving = ref(false)
async function saveBusiness() {
  if (!canSaveBusiness.value) return
  saving.value = true
  try {
    const digits = bizNumInput.value.replace(/\D/g, '')
    await createBusiness({
      regionId: Number(regionId.value),
      industryId: Number(industryId.value),
      businessNum: digits,
      estbDate: estbDate.value, // 저장은 YYYY-MM-DD 그대로
    })
    step.value = 2
  } catch (e) {
    console.error('[onboarding] save business error', e)
    alert('사업자 정보를 저장하는 중 오류가 발생했어요.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
