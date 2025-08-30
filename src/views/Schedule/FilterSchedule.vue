<template>
  <div>
    <ScheduleToolbar
      v-model="status"
      :year="year"
      :month="month"
      @update:year="v => (year = v)"
      @update:month="v => (month = v)"
      @open:filters="onSaveFilter"
    />

    <div class="grid grid-cols-12 gap-4">
      <!-- 왼쪽: 필터 빌더 -->
      <section
        class="col-span-12 rounded-xl border border-neutral-100 bg-white p-4 lg:col-span-4"
      >
        <h4 class="mb-1 text-h4">필터 만들기</h4>
        <p class="mb-4 text-body-sm text-neutral-600">
          항목을 선택하고 저장하세요.
        </p>

        <FilterSection
          v-model="builder.type"
          title="유형"
          :options="['대출', '보조금']"
        />
        <FilterSection
          v-model="builder.region"
          title="지역"
          :options="[
            '전국',
            '서울',
            '부산',
            '대구',
            '인천',
            '광주',
            '대전',
            '울산',
            '세종',
          ]"
        />
        <FilterSection
          v-model="builder.industry"
          title="업종"
          :options="[
            '전체',
            '제조업',
            '서비스업',
            '도소매업',
            '음식업',
            '건설업',
            'IT업',
          ]"
        />
        <FilterSection
          v-model="builder.target"
          title="대상"
          :options="['전체', '청년', '중장년', '시니어', '여성', '소상공인']"
        />
        <FilterSection
          v-model="builder.org"
          title="기관"
          :options="[
            '전체',
            'KB국민은행',
            '신한은행',
            '우리은행',
            '하나은행',
            '농협은행',
          ]"
        />
        <FilterSection
          v-model="builder.state"
          title="상태"
          :options="['전체', '접수중', '마감임박', '예정', '마감']"
        />

        <div class="mt-4 flex items-center gap-2">
          <button
            class="h-8 rounded-[10px] bg-brand-blue-royal px-4 text-[12px] font-bold text-white"
          >
            적용
          </button>
          <button
            class="h-8 rounded-[10px] bg-primary-alt px-4 text-[12px] font-black text-neutral-900"
            @click="onSaveFilter"
          >
            필터 저장
          </button>
          <button
            class="h-8 rounded-[10px] border border-neutral-300 bg-white px-4 text-[12px] font-semibold text-neutral-700"
            @click="onReset"
          >
            초기화
          </button>
        </div>
      </section>

      <!-- 오른쪽: 저장된 필터 리스트 -->
      <section
        class="col-span-12 rounded-xl border border-neutral-100 bg-white p-4 lg:col-span-8"
      >
        <div class="mb-2 flex items-center justify-between">
          <h4 class="text-h4">저장된 필터 · {{ saved.length }}</h4>
          <button
            class="h-8 rounded-[10px] bg-primary-alt px-3 text-[12px] font-black text-neutral-900"
            @click="onSaveFilter"
          >
            새 필터
          </button>
        </div>

        <ul class="divide-y divide-neutral-100">
          <li
            v-for="(f, i) in saved"
            :key="i"
            class="flex items-center justify-between py-3"
          >
            <div>
              <p class="text-sm font-bold">{{ f.name }}</p>
              <div class="mt-1 flex flex-wrap gap-2">
                <span
                  v-for="t in f.tags"
                  :key="t"
                  class="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700"
                  >{{ t }}</span
                >
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="h-7 rounded-[10px] bg-brand-blue-royal px-3 text-[12px] font-bold text-white"
              >
                적용
              </button>
              <button
                class="h-7 rounded-[10px] border border-neutral-300 bg-white px-3 text-[12px] font-semibold text-neutral-700"
              >
                수정
              </button>
              <button
                class="h-7 rounded-[10px] border border-neutral-300 bg-white px-3 text-[12px] font-semibold text-neutral-700"
              >
                공유
              </button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ScheduleToolbar from '@/components/schedule/ScheduleToolbar.vue';
import FilterSection from '@/components/schedule/FilterSection.vue';

const status = ref('all');
const year = ref(2025);
const month = ref(8);

const builder = reactive({
  type: ['대출'],
  region: ['서울'],
  industry: ['음식업'],
  target: ['청년'],
  org: ['KB국민은행'],
  state: ['접수중'],
});

const saved = ref([
  {
    name: '서울 음식업 청년 대상',
    tags: ['서울', '음식업', '청년', 'KB국민은행'],
  },
  { name: '전국 제조업 지원', tags: ['전국', '제조업', '중장년', '신한은행'] },
  { name: '상시 접수 대출', tags: ['전국', '대출', '상시', '우리은행'] },
]);

function onReset() {
  builder.type = [];
  builder.region = [];
  builder.industry = [];
  builder.target = [];
  builder.org = [];
  builder.state = [];
}
function onSaveFilter() {
  saved.value.unshift({
    name: '새 필터',
    tags: [
      ...builder.type,
      ...builder.region,
      ...builder.industry,
      ...builder.target,
      ...builder.org,
      ...builder.state,
    ].slice(0, 4),
  });
}
</script>
