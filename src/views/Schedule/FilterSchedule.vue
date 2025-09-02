<!-- src/views/Schedule/FilterSchedule.vue -->
<template>
  <div>
    <ScheduleToolbar
      v-model="status"
      :year="year"
      :month="month"
      @update:year="v => (year = v)"
      @update:month="v => (month = v)"
      @open:filters="showSaved = true"
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
            @click="applyNow"
          >
            적용
          </button>
          <button
            class="h-8 rounded-[10px] bg-primary-alt px-4 text-[12px] font-black text-neutral-900"
            @click="openCreateModal"
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
        </div>

        <ul class="divide-y divide-neutral-100">
          <li
            v-for="f in saved"
            :key="f.id"
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
                @click="setActive(f.id)"
              >
                적용
              </button>
              <button
                class="h-7 rounded-[10px] border border-neutral-300 bg-white px-3 text-[12px] font-semibold text-neutral-700"
                @click="openRenameModal(f)"
              >
                이름변경
              </button>
              <button
                class="h-7 rounded-[10px] border border-neutral-300 bg-white px-3 text-[12px] font-semibold text-danger"
                @click="remove(f.id)"
              >
                삭제
              </button>
            </div>
          </li>
        </ul>
      </section>
    </div>

    <SavedFiltersModal :open="showSaved" @close="showSaved = false" />

    <!-- 이름 입력 모달 -->
    <InputModal
      :open="showNameModal"
      :title="renameTarget ? '필터 이름 변경' : '새 필터 저장'"
      :placeholder="'필터 이름을 입력하세요'"
      :default-value="nameDefault"
      ok-text="확인"
      @close="showNameModal = false"
      @submit="onNameSubmit"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import ScheduleToolbar from '@/components/schedule/ScheduleToolbar.vue';
import FilterSection from '@/components/schedule/FilterSection.vue';
import SavedFiltersModal from '@/components/schedule/SavedFiltersModal.vue';
import InputModal from '@/components/schedule/InputModal.vue';
import { useScheduleFilters } from '@/stores/scheduleFilters';

const status = ref('all'); // 상단 검색은 유지(동작 변경 없음)
const year = ref(2025);
const month = ref(8);
const showSaved = ref(false);

const filters = useScheduleFilters();
const { saved } = storeToRefs(filters);
onMounted(() => filters.load());

const builder = reactive({
  type: [],
  region: [],
  industry: [],
  target: [],
  org: [],
  state: [],
});

function onReset() {
  builder.type = [];
  builder.region = [];
  builder.industry = [];
  builder.target = [];
  builder.org = [];
  builder.state = [];
}
function setActive(id) {
  filters.setActive(id);
}
function applyNow() {
  filters.setActiveCriteria({ ...builder });
}
function remove(id) {
  filters.remove(id);
}

// 모달 상태 (저장/이름변경 공용)
const showNameModal = ref(false);
const renameTarget = ref(null);
const nameDefault = ref('');

function openCreateModal() {
  renameTarget.value = null;
  nameDefault.value = '새 필터';
  showNameModal.value = true;
}
function openRenameModal(f) {
  renameTarget.value = f;
  nameDefault.value = f.name;
  showNameModal.value = true;
}
function onNameSubmit(name) {
  if (!name) return;
  if (renameTarget.value) {
    filters.update(renameTarget.value.id, { name });
  } else {
    filters.create(name, { ...builder });
  }
  showNameModal.value = false;
}
</script>
