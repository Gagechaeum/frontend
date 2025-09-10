<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  items: { type: Array, required: true },
});

const emit = defineEmits([
  'update', // 리스트 업데이트 (입력 변경)
  'request-remove', // 삭제 요청 (모달은 부모에서)
  'request-verify', // 인증 요청 (연결은 나중에)
]);

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
  const next = props.items.map((x, i) =>
    i === idx
      ? {
          ...x,
          [key]: key === 'registrationNumber' ? formatRegNo(val) : val,
        }
      : x
  );
  emit('update', next);
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
    region: Boolean(String(b?.region ?? '').trim()),
    type: Boolean(String(b?.type ?? '').trim()),
  };
}

// 각 아이템의 검증 결과
const validations = computed(() => props.items.map(validateItem));

// 하나라도 비어있거나 형식 불일치면 true
const hasAnyEmptyRequired = computed(() =>
  validations.value.some(v => !v.regNo || !v.region || !v.type)
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

/* 부모에서 접근 가능하도록 노출 */
defineExpose({
  validateAll,
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
      <div class="grid grid-cols-1 gap-4 px-4 pb-4 md:grid-cols-3">
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
            :value="b.region"
            :class="[
              'w-full rounded-lg border px-4 py-2',
              showErrors && !validations[i].region
                ? 'border-red-500'
                : 'border-gray-300',
            ]"
            @change="updateItem(i, 'region', $event.target.value)"
          >
            <option value="" disabled selected hidden>지역 선택</option>
            <option>서울특별시</option>
            <option>경기도</option>
            <option>인천광역시</option>
            <option>부산광역시</option>
            <option>대구광역시</option>
            <option>광주광역시</option>
            <option>대전광역시</option>
            <option>울산광역시</option>
            <option>세종특별자치시</option>
            <option>강원도</option>
            <option>충청북도</option>
            <option>충청남도</option>
            <option>전라북도</option>
            <option>전라남도</option>
            <option>경상북도</option>
            <option>경상남도</option>
            <option>제주특별자치도</option>
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
            :value="b.type"
            :class="[
              'w-full rounded-lg border px-4 py-2',
              showErrors && !validations[i].type
                ? 'border-red-500'
                : 'border-gray-300',
            ]"
            @change="updateItem(i, 'type', $event.target.value)"
          >
            <option value="" disabled selected hidden>업종 선택</option>
            <option>음식·외식업</option>
            <option>도소매·유통</option>
            <option>서비스업</option>
            <option>제조업</option>
            <option>건설업</option>
            <option>운수·창고업</option>
            <option>숙박업</option>
            <option>교육서비스업</option>
            <option>부동산업</option>
            <option>기타</option>
          </select>
          <p
            v-if="showErrors && !validations[i].type"
            class="mt-1 text-xs text-red-600"
          >
            업종을 선택해 주세요.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
