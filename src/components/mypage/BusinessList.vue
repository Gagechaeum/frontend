<script setup>
const props = defineProps({
  items: { type: Array, required: true },
});
const emit = defineEmits(['update', 'request-remove']);

// ###-##-##### 포맷
const formatRegNo = raw => {
  const d = String(raw ?? '')
    .replace(/\D/g, '')
    .slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 5);
  const c = d.slice(5, 10);
  return [a, b, c].filter(Boolean).join('-');
};

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

        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
          title="이 사업자 정보 삭제"
          @click="$emit('request-remove', i)"
        >
          <i class="fas fa-trash"></i> 삭제
        </button>
      </div>

      <!-- 본문: 3열 그리드 -->
      <div class="grid grid-cols-1 gap-4 px-4 pb-4 md:grid-cols-3">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700"
            >사업자 등록번호</label
          >
          <input
            :value="b.registrationNumber"
            placeholder="123-45-67890"
            class="w-full rounded-lg border border-gray-300 px-4 py-2"
            @input="updateItem(i, 'registrationNumber', $event.target.value)"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700"
            >지역</label
          >
          <select
            :value="b.region"
            class="w-full rounded-lg border border-gray-300 px-4 py-2"
            @change="updateItem(i, 'region', $event.target.value)"
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
          <label class="mb-1 block text-sm font-medium text-gray-700"
            >업종</label
          >
          <select
            :value="b.type"
            class="w-full rounded-lg border border-gray-300 px-4 py-2"
            @change="updateItem(i, 'type', $event.target.value)"
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
    </section>
  </div>
</template>
