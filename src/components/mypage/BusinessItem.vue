<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Object, required: true },
});
const emit = defineEmits(['update:modelValue', 'remove']);

// 입력 버퍼
const regInput = ref(props.modelValue.registrationNumber || '');

watch(
  () => props.modelValue.registrationNumber,
  v => {
    regInput.value = v || '';
  }
);

// 000-00-00000 포맷
const formatBiz = raw => {
  const s = String(raw || '')
    .replace(/\D/g, '')
    .slice(0, 10);
  if (s.length <= 3) return s;
  if (s.length <= 5) return `${s.slice(0, 3)}-${s.slice(3)}`;
  return `${s.slice(0, 3)}-${s.slice(3, 5)}-${s.slice(5)}`;
};

function onInputReg(e) {
  const formatted = formatBiz(e.target.value);
  regInput.value = formatted;
  emit('update:modelValue', {
    ...props.modelValue,
    registrationNumber: formatted,
  });
}

function update(key, val) {
  emit('update:modelValue', { ...props.modelValue, [key]: val });
}
</script>

<template>
  <div class="rounded-xl bg-gray-50 p-4">
    <div class="mb-3 flex items-center justify-between">
      <h4 class="font-medium text-gray-700">사업자 정보</h4>
      <button class="text-red-600 hover:text-red-700" @click="$emit('remove')">
        <i class="fas fa-trash" />
      </button>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div>
        <label class="mb-1 block text-sm font-medium">사업자 등록번호</label>
        <input
          class="w-full rounded-lg border px-4 py-2"
          :value="regInput"
          placeholder="123-45-67890"
          inputmode="numeric"
          @input="onInputReg"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">지역</label>
        <select
          class="w-full rounded-lg border px-4 py-2"
          :value="props.modelValue.region"
          @change="update('region', $event.target.value)"
        >
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
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium">업종</label>
        <select
          class="w-full rounded-lg border px-4 py-2"
          :value="props.modelValue.type"
          @change="update('type', $event.target.value)"
        >
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
      </div>
    </div>
  </div>
</template>
