<script setup>
import { ref, computed, watch } from 'vue';
import { REGION_OPTIONS, INDUSTRY_OPTIONS } from '@/stores/mypage';

const props = defineProps({
  items: { type: Array, required: true },
});

const emit = defineEmits([
  'update', // 리스트 업데이트 (입력 변경)
  'request-remove', // 삭제 요청 (모달은 부모에서)
  'request-verify', // 인증 요청 (연결은 나중에)
]);

// const REGION_OPTIONS = [
//   { value: 11, label: '서울특별시' },
//   { value: 26, label: '부산광역시' },
//   { value: 27, label: '대구광역시' },
//   { value: 28, label: '인천광역시' },
//   { value: 29, label: '광주광역시' },
//   { value: 30, label: '대전광역시' },
//   { value: 31, label: '울산광역시' },
//   { value: 41, label: '경기도' },
//   { value: 42, label: '강원도' },
//   { value: 43, label: '충청북도' },
//   { value: 44, label: '충청남도' },
//   { value: 45, label: '전라북도' },
//   { value: 46, label: '전라남도' },
//   { value: 47, label: '경상북도' },
//   { value: 48, label: '경상남도' },
//   { value: 50, label: '제주특별자치도' },
// ];

// const INDUSTRY_OPTIONS = [
//   { value: 1, label: '농업, 임업 및 어업' },
//   { value: 2, label: '광업' },
//   { value: 3, label: '제조업' },
//   { value: 4, label: '전기, 가스, 증기 및 공기조절 공급업' },
//   { value: 5, label: '수도, 하수, 폐기물 처리, 원료 재생업' },
//   { value: 6, label: '건설업' },
//   { value: 7, label: '도소매업' },
//   { value: 8, label: '운수 및 창고업' },
//   { value: 9, label: '숙박 및 음식점업' },
//   { value: 10, label: '정보통신업' },
//   { value: 11, label: '금융 및 보험업' },
//   { value: 12, label: '부동산업' },
//   { value: 13, label: '전문, 과학 및 기술 서비스업' },
//   { value: 14, label: '사업시설관리, 사업지원 및 임대 서비스업' },
//   { value: 15, label: '공공행정, 국방 및 사회보장행정' },
//   { value: 16, label: '교육서비스업' },
//   { value: 17, label: '보건업 및 사회복지 서비스업' },
//   { value: 18, label: '예술, 스포츠 및 여가관련 서비스업' },
//   { value: 19, label: '협회 및 단체, 수리 및 기타 개인 서비스업' },
// ];

/* ─────────────────────────────
 * 유틸: 사업자등록번호 ###-##-##### 포맷
 * ───────────────────────────── */
const formatRegNo = raw => {
  const d = String(raw ?? '')
    .replace(/\D/g, '')
    .slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 5);
  const c = d.slice(5, 10);
  return [a, b, c].filter(Boolean).join('-');
};

/* 입력 변경 반영 */
function updateItem(idx, key, val) {
  const next = props.items.map(
    (x, i) =>
      i === idx
        ? {
            ...x, // 기존 객체 복사
            [key]:
              key === 'registrationNumber'
                ? formatRegNo(val)
                : key === 'regionId' || key === 'industryId'
                  ? val === ''
                    ? null
                    : Number(val) // ✅ 코드값은 숫자/nullable
                  : val,
          }
        : x // 해당 index 아니면 그대로 둠
  );
  emit('update', next); // 부모(EditProfileForm)로 수정된 리스트 전달
}

/* 버튼 이벤트: 부모로 올려 처리 */
function requestRemove(idx) {
  emit('request-remove', idx);
}
function requestVerify(idx) {
  emit('request-verify', idx);
}

/* ─────────────────────────────
 * 검증 로직 (저장 시 사용)
 * ───────────────────────────── */
const showErrors = ref(false);

function isValidRegNo(v) {
  // 숫자 10자리면 통과
  const digits = String(v ?? '').replace(/\D/g, '');
  return digits.length === 10;
}

function validateItem(b) {
  return {
    regNo: isValidRegNo(b?.registrationNumber),
    region: Number.isFinite(Number(b?.regionId)),
    type: Number.isFinite(Number(b?.industryId)),
    estbDate: isValidDateStr(b?.estbDate),
  };
}

// 각 아이템의 검증 결과
const validations = computed(() => props.items.map(validateItem));

// 하나라도 비어있거나 형식 불일치면 true
const hasAnyEmptyRequired = computed(() =>
  validations.value.some(v => !v.regNo || !v.region || !v.type || !v.estbDate)
);

/**
 * 부모에서 호출하는 공개 메서드:
 * - validateAll(): 모든 항목 검증. 기본적으로 에러 표시를 켬.
 *   사용 예) if (!listRef.value.validateAll()) { 토스트 '다 입력해주세요' }
 */
function validateAll(options = { reveal: true }) {
  if (options?.reveal) showErrors.value = true;
  return !hasAnyEmptyRequired.value;
}

function peekValid() {
  // 에러는 노출하지 않고 유효성만 반환
  return !hasAnyEmptyRequired.value;
}

function restErrors() {
  showErrors.value = false;
}

/* ✅ 사업자 항목이 "추가"될 때는 에러 표시는 자동으로 꺼줌
   - 이전에 저장 시도(showErrors=true) 후 추가해도 빨간 테두리가 바로 안 뜨게 */
// ✅ 사업자 항목이 "추가"되면 에러 표시 자동 OFF
watch(
  () => props.items.length,
  (n, o) => {
    if (n > (o ?? 0)) {
      showErrors.value = false; // 새 카드가 생길 때는 에러 숨김(프리스틴)
    }
  }
);

// YYYY-MM-DD 간단 검증 (input[type=date]면 이 정도로 충분)
function isValidDateStr(v) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(v ?? ''));
}

/* 부모에서 접근 가능하도록 노출 */
defineExpose({
  validateAll,
  peekValid,
  restErrors,
  showErrors,
  validations,
  hasAnyEmptyRequired,
  requestRemove,
  requestVerify,
  updateItem,
});
</script>

<template>
  <div class="space-y-4">
    <section
      v-for="(b, i) in props.items"
      :key="b.id ?? i"
      class="rounded-2xl border border-gray-200 bg-gray-50"
    >
      <!-- 카드 헤더: 타이틀 + 삭제 버튼 -->
      <div class="flex items-center justify-between px-4 py-3">
        <h4 class="text-sm font-semibold text-gray-800">
          사업자 정보 {{ i + 1 }}
        </h4>

        <div class="flex items-center gap-2">
          <!-- 인증 (왼쪽) -->
          <button
            type="button"
            :class="[
              'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium',
              b.verified
                ? 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100',
            ]"
            title="이 사업자 정보 인증"
            @click="$emit('request-verify', i)"
          >
            <i
              :class="[
                'fas',
                b.verified
                  ? 'fa-check-circle text-green-500'
                  : 'fa-check text-gray-400',
              ]"
            ></i>
            {{ b.verified ? '인증됨' : '인증' }}
          </button>

          <!-- 삭제 (오른쪽) -->
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
            title="이 사업자 정보 삭제"
            @click="$emit('request-remove', i)"
          >
            <i class="fas fa-trash"></i> 삭제
          </button>
        </div>
      </div>

      <!-- 본문: 3열 그리드 -->
      <div class="grid grid-cols-1 gap-4 px-4 pb-4 md:grid-cols-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700"
            >사업자 등록번호</label
          >
          <input
            :value="b.registrationNumber"
            :class="[
              'w-full rounded-lg border px-4 py-2',
              showErrors && !validations[i].regNo
                ? 'border-red-500'
                : 'border-gray-300',
            ]"
            placeholder="123-45-67890"
            @input="updateItem(i, 'registrationNumber', $event.target.value)"
          />
          <p
            v-if="showErrors && !validations[i].regNo"
            class="mt-1 text-xs text-red-600"
          >
            사업자 등록번호를 입력해 주세요.
          </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700"
            >지역</label
          >
          <select
            :value="b.regionId ?? ''"
            :class="[
              'w-full rounded-lg border px-4 py-2',
              showErrors && !validations[i].region
                ? 'border-red-500'
                : 'border-gray-300',
            ]"
            @change="updateItem(i, 'regionId', $event.target.value)"
          >
            <option value="" disabled>지역 선택</option>

            <option
              v-for="opt in REGION_OPTIONS"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
          <p
            v-if="showErrors && !validations[i].region"
            class="mt-1 text-xs text-red-600"
          >
            지역을 선택해 주세요.
          </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700"
            >업종</label
          >
          <select
            :value="b.industryId ?? ''"
            :class="[
              'w-full rounded-lg border px-4 py-2',
              showErrors && !validations[i].type
                ? 'border-red-500'
                : 'border-gray-300',
            ]"
            @change="updateItem(i, 'industryId', $event.target.value)"
          >
            <option value="" disabled>업종 선택</option>
            <option
              v-for="opt in INDUSTRY_OPTIONS"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
          <p
            v-if="showErrors && !validations[i].type"
            class="mt-1 text-xs text-red-600"
          >
            업종을 선택해 주세요.
          </p>
        </div>
        <!-- 개업일자 (달력) -->
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700"
            >개업일자</label
          >
          <input
            type="date"
            :value="b.estbDate || ''"
            :class="[
              'w-full rounded-lg border px-4 py-2',
              showErrors && !validations[i].estbDate
                ? 'border-red-500'
                : 'border-gray-300',
            ]"
            @input="updateItem(i, 'estbDate', $event.target.value)"
          />
          <p
            v-if="showErrors && !validations[i].estbDate"
            class="mt-1 text-xs text-red-600"
          >
            개업일자를 선택해 주세요.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
