<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="mx-auto max-w-6xl">
      <!-- 헤더 -->
      <div class="mb-8">
        <h1 class="mb-4 text-3xl font-bold text-gray-900">
          컴포넌트 테스트 페이지
        </h1>
        <p class="text-gray-600">
          프로젝트의 모든 컴포넌트들을 테스트하고 확인할 수 있습니다.
        </p>
      </div>

      <!-- 토스트 알림 테스트 섹션 -->
      <div class="mb-8 rounded-2xl border border-gray-200 bg-white p-8">
        <h2 class="mb-6 text-2xl font-bold text-gray-900">
          🍞 Toast 알림 테스트
        </h2>

        <!-- 기본 알림 타입 테스트 -->
        <div class="mb-8">
          <h3 class="mb-4 text-lg font-semibold text-gray-800">
            1. 기본 알림 타입
          </h3>
          <div class="flex flex-wrap gap-3">
            <button
              class="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
              @click="showSuccessToast"
            >
              ✅ 성공 알림
            </button>
            <button
              class="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
              @click="showErrorToast"
            >
              ❌ 에러 알림
            </button>
            <button
              class="rounded-lg bg-yellow-500 px-4 py-2 text-white transition-colors hover:bg-yellow-600"
              @click="showWarningToast"
            >
              ⚠️ 경고 알림
            </button>
            <button
              class="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
              @click="showInfoToast"
            >
              ℹ️ 정보 알림
            </button>
          </div>
        </div>

        <!-- 지속 시간 테스트 -->
        <div class="mb-8">
          <h3 class="mb-4 text-lg font-semibold text-gray-800">
            2. 지속 시간 설정
          </h3>
          <div class="flex flex-wrap gap-3">
            <button
              class="rounded-lg bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600"
              @click="showQuickToast"
            >
              ⚡ 빠른 알림 (1초)
            </button>
            <button
              class="rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
              @click="showSlowToast"
            >
              🐌 느린 알림 (5초)
            </button>
            <button
              class="rounded-lg bg-indigo-500 px-4 py-2 text-white transition-colors hover:bg-indigo-600"
              @click="showCustomToast"
            >
              ⏱️ 커스텀 알림 (3초)
            </button>
          </div>
        </div>

        <!-- 여러 알림 동시 표시 테스트 -->
        <div class="mb-8">
          <h3 class="mb-4 text-lg font-semibold text-gray-800">
            3. 여러 알림 동시 표시
          </h3>
          <div class="flex flex-wrap gap-3">
            <button
              class="rounded-lg bg-pink-500 px-4 py-2 text-white transition-colors hover:bg-pink-600"
              @click="showMultipleToasts"
            >
              🎭 여러 알림 동시 표시
            </button>
            <button
              class="rounded-lg bg-teal-500 px-4 py-2 text-white transition-colors hover:bg-teal-600"
              @click="showSequentialToasts"
            >
              📝 순차적 알림 표시
            </button>
            <button
              class="rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
              @click="clearAllToasts"
            >
              🗑️ 모든 알림 지우기
            </button>
          </div>
        </div>

        <!-- 실전 사용 예시 -->
        <div class="mb-8">
          <h3 class="mb-4 text-lg font-semibold text-gray-800">
            4. 실전 사용 예시
          </h3>
          <div class="flex flex-wrap gap-3">
            <button
              class="rounded-lg bg-emerald-500 px-4 py-2 text-white transition-colors hover:bg-emerald-600"
              @click="simulateLogin"
            >
              🔐 로그인 시뮬레이션
            </button>
            <button
              class="rounded-lg bg-cyan-500 px-4 py-2 text-white transition-colors hover:bg-cyan-600"
              @click="simulateFormSubmit"
            >
              📝 폼 제출 시뮬레이션
            </button>
            <button
              class="rounded-lg bg-amber-500 px-4 py-2 text-white transition-colors hover:bg-amber-600"
              @click="simulateApiCall"
            >
              🌐 API 호출 시뮬레이션
            </button>
          </div>
        </div>
      </div>

      <!-- 토스트 알림 사용 가이드 -->
      <div class="mb-8 rounded-2xl border border-gray-200 bg-white p-8">
        <h2 class="mb-6 text-2xl font-bold text-gray-900">
          📚 Toast 알림 사용 가이드
        </h2>

        <!-- 기본 사용법 -->
        <div class="mb-8">
          <h3 class="mb-4 text-lg font-semibold text-gray-800">
            1. 기본 사용법
          </h3>
          <div class="rounded-lg bg-gray-50 p-4">
            <h4 class="mb-2 font-medium text-gray-800">필요한 import:</h4>
            <pre
              class="overflow-x-auto rounded border bg-white p-3 text-sm"
            ><code>import { useNotificationStore } from '@/stores/notification';

const notificationStore = useNotificationStore();</code></pre>

            <h4 class="mb-2 mt-4 font-medium text-gray-800">기본 호출:</h4>
            <pre
              class="overflow-x-auto rounded border bg-white p-3 text-sm"
            ><code>// 성공 알림
notificationStore.show('success', '작업이 완료되었습니다!');

// 에러 알림
notificationStore.show('error', '오류가 발생했습니다.');

// 경고 알림
notificationStore.show('warning', '주의가 필요합니다.');

// 정보 알림
notificationStore.show('info', '알림입니다.');</code></pre>
          </div>
        </div>

        <!-- 알림 타입별 설명 -->
        <div class="mb-8">
          <h3 class="mb-4 text-lg font-semibold text-gray-800">
            2. 알림 타입별 설명
          </h3>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="rounded-lg border border-green-200 bg-green-50 p-4">
              <h4 class="mb-2 font-medium text-green-800">✅ success</h4>
              <p class="mb-2 text-sm text-green-700">
                성공적인 작업 완료 시 사용
              </p>
              <p class="text-xs text-green-600">
                예: 로그인 성공, 저장 완료, 업로드 성공
              </p>
            </div>
            <div class="rounded-lg border border-red-200 bg-red-50 p-4">
              <h4 class="mb-2 font-medium text-red-800">❌ error</h4>
              <p class="mb-2 text-sm text-red-700">오류 발생 시 사용</p>
              <p class="text-xs text-red-600">
                예: 로그인 실패, 저장 실패, 네트워크 오류
              </p>
            </div>
            <div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <h4 class="mb-2 font-medium text-yellow-800">⚠️ warning</h4>
              <p class="mb-2 text-sm text-yellow-700">
                주의가 필요한 상황 시 사용
              </p>
              <p class="text-xs text-yellow-600">
                예: 입력값 검증, 임시 저장, 만료 예정
              </p>
            </div>
            <div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 class="mb-2 font-medium text-blue-800">ℹ️ info</h4>
              <p class="mb-2 text-sm text-blue-700">
                일반적인 정보 제공 시 사용
              </p>
              <p class="text-xs text-blue-600">
                예: 처리 중, 업데이트 완료, 새 기능 안내
              </p>
            </div>
          </div>
        </div>

        <!-- 고급 사용법 -->
        <div class="mb-8">
          <h3 class="mb-4 text-lg font-semibold text-gray-800">
            3. 고급 사용법
          </h3>
          <div class="space-y-4">
            <div class="rounded-lg bg-gray-50 p-4">
              <h4 class="mb-2 font-medium text-gray-800">지속 시간 설정:</h4>
              <pre
                class="overflow-x-auto rounded border bg-white p-3 text-sm"
              ><code>// 기본: 2.5초 (2500ms)
notificationStore.show('success', '기본 지속시간');

// 커스텀: 1초
notificationStore.show('info', '1초 후 사라짐', 1000);

// 커스텀: 5초
notificationStore.show('warning', '5초 후 사라짐', 5000);</code></pre>
            </div>

            <div class="rounded-lg bg-gray-50 p-4">
              <h4 class="mb-2 font-medium text-gray-800">
                여러 알림 동시 표시:
              </h4>
              <pre
                class="overflow-x-auto rounded border bg-white p-3 text-sm"
              ><code>// 여러 알림을 빠르게 연속으로 호출
notificationStore.show('info', '첫 번째 알림');
notificationStore.show('success', '두 번째 알림');
notificationStore.show('warning', '세 번째 알림');

// 모든 알림 지우기
notificationStore.clear();</code></pre>
            </div>

            <div class="rounded-lg bg-gray-50 p-4">
              <h4 class="mb-2 font-medium text-gray-800">
                수동으로 알림 제거:
              </h4>
              <pre
                class="overflow-x-auto rounded border bg-white p-3 text-sm"
              ><code>// 특정 알림 제거 (ID 필요)
const id = notificationStore.show('info', '수동 제거 가능');
notificationStore.remove(id);</code></pre>
            </div>
          </div>
        </div>

        <!-- 실전 예시 -->
        <div class="mb-8">
          <h3 class="mb-4 text-lg font-semibold text-gray-800">
            4. 실전 사용 예시
          </h3>
          <div class="space-y-4">
            <div class="rounded-lg bg-gray-50 p-4">
              <h4 class="mb-2 font-medium text-gray-800">로그인 처리:</h4>
              <pre
                class="overflow-x-auto rounded border bg-white p-3 text-sm"
              ><code>async function handleLogin() {
  try {
    notificationStore.show('info', '로그인 중입니다...');

    const response = await loginAPI(credentials);

    if (response.success) {
      notificationStore.show('success', '로그인되었습니다!');
      // 로그인 후 처리...
    } else {
      notificationStore.show('error', '아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  } catch (error) {
    notificationStore.show('error', '로그인 중 오류가 발생했습니다.');
  }
}</code></pre>
            </div>

            <div class="rounded-lg bg-gray-50 p-4">
              <h4 class="mb-2 font-medium text-gray-800">폼 제출 처리:</h4>
              <pre
                class="overflow-x-auto rounded border bg-white p-3 text-sm"
              ><code>async function handleSubmit() {
  try {
    notificationStore.show('info', '저장 중입니다...');

    const result = await saveForm(formData);

    if (result.success) {
      notificationStore.show('success', '성공적으로 저장되었습니다!');
      // 성공 후 처리...
    } else {
      notificationStore.show('warning', '일부 데이터가 저장되지 않았습니다.');
    }
  } catch (error) {
    notificationStore.show('error', '저장 중 오류가 발생했습니다.');
  }
}</code></pre>
            </div>

            <div class="rounded-lg bg-gray-50 p-4">
              <h4 class="mb-2 font-medium text-gray-800">API 호출 처리:</h4>
              <pre
                class="overflow-x-auto rounded border bg-white p-3 text-sm"
              ><code>async function fetchData() {
  try {
    notificationStore.show('info', '데이터를 불러오는 중...');

    const data = await api.getData();

    notificationStore.show('success', `${data.length}개의 항목을 불러왔습니다.`);
    // 데이터 처리...

  } catch (error) {
    if (error.status === 404) {
      notificationStore.show('warning', '요청한 데이터를 찾을 수 없습니다.');
    } else if (error.status === 500) {
      notificationStore.show('error', '서버 오류가 발생했습니다.');
    } else {
      notificationStore.show('error', '데이터를 불러오는 중 오류가 발생했습니다.');
    }
  }
}</code></pre>
            </div>
          </div>
        </div>

        <!-- 주의사항 -->
        <div class="mb-8">
          <h3 class="mb-4 text-lg font-semibold text-gray-800">
            5. 주의사항 및 팁
          </h3>
          <div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <ul class="space-y-2 text-sm text-blue-800">
              <li>
                • <strong>사용자 경험:</strong> 너무 많은 알림을 동시에 표시하지
                마세요
              </li>
              <li>
                • <strong>메시지 길이:</strong> 간결하고 명확한 메시지를
                사용하세요
              </li>
              <li>
                • <strong>적절한 타입:</strong> 상황에 맞는 알림 타입을
                선택하세요
              </li>
              <li>
                • <strong>지속시간:</strong> 중요한 알림은 더 오래 표시하세요
              </li>
              <li>
                • <strong>자동 제거:</strong> 사용자가 읽을 시간을 충분히 주세요
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- AppHeader 사용법 가이드 -->
      <Section title="📚 AppHeader 컴포넌트 사용법" class="mb-6" card>
        <div class="space-y-4">
          <div class="rounded-lg bg-gray-50 p-4">
            <h4 class="mb-2 font-medium text-gray-800">사용 예시:</h4>
            <pre
              class="overflow-x-auto rounded border bg-white p-3 text-sm"
            ><code>&lt;AppHeader
  :chips="['사업자', '소상공인']"
  :show-bell="true"
/&gt;</code></pre>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">chips:</span>
              <span class="text-gray-600">Array - 사용자 정보 태그 목록</span>
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: []</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">showBell:</span>
              <span class="text-gray-600">Boolean - 알림 버튼 표시 여부</span>
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: true</span>
            </div>
          </div>
        </div>
      </Section>

      <!-- SearchBar 테스트 -->
      <Section title="SearchBar 컴포넌트" class="mb-8">
        <div class="max-w-md">
          <SearchBar
            v-model="searchText"
            placeholder="컴포넌트 검색..."
            @submit="handleSearch"
          />
          <p class="mt-2 text-sm text-gray-600">검색어: {{ searchText }}</p>
        </div>
      </Section>

      <!-- Tag 사용법 가이드 -->
      <Section title="📚 Tag 컴포넌트 사용법" class="mb-6" card>
        <div class="space-y-4">
          <div class="rounded-lg bg-gray-50 p-4">
            <h4 class="mb-2 font-medium text-gray-800">사용 예시:</h4>
            <pre
              class="overflow-x-auto rounded border bg-white p-3 text-sm"
            ><code>&lt;Tag
  label="사업자"
  tone="blue"
  size="sm"
  rounded="lg"
/&gt;</code></pre>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">label:</span>
              <span class="text-gray-600">String - 태그 텍스트</span>
              <span class="rounded bg-red-100 px-2 py-1 text-xs text-red-700"
                >필수</span
              >
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">tone:</span>
              <span class="text-gray-600"
                >String - 색상 테마 (gray|blue|yellow|red|green)</span
              >
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: "gray"</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">size:</span>
              <span class="text-gray-600">String - 크기 (xs|sm)</span>
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: "sm"</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">rounded:</span>
              <span class="text-gray-600"
                >String - 모서리 둥글기 (lg|full)</span
              >
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: "lg"</span>
            </div>
          </div>
        </div>
      </Section>

      <!-- Tag 테스트 -->
      <Section title="Tag 컴포넌트" class="mb-8">
        <div class="flex flex-wrap gap-2">
          <Tag label="사업자" tone="gray" size="sm" />
          <Tag label="소상공인" tone="blue" size="sm" />
          <Tag label="대출" tone="green" size="sm" />
          <Tag label="보조금" tone="yellow" size="sm" />
          <Tag label="중요" tone="red" size="sm" />
          <Tag label="작은 태그" tone="blue" size="xs" rounded="full" />
        </div>
      </Section>

      <!-- UiButton 사용법 가이드 -->
      <Section title="📚 UiButton 컴포넌트 사용법" class="mb-6" card>
        <div class="space-y-4">
          <div class="rounded-lg bg-gray-50 p-4">
            <h4 class="mb-2 font-medium text-gray-800">사용 예시:</h4>
            <pre
              class="overflow-x-auto rounded border bg-white p-3 text-sm"
            ><code>&lt;UiButton
  variant="primary"
  size="lg"
  block
  disabled
  @click="handleClick"
&gt;
  버튼 텍스트
&lt;/UiButton&gt;</code></pre>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">variant:</span>
              <span class="text-gray-600"
                >String - 스타일 (primary|secondary|ghost)</span
              >
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: "primary"</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">size:</span>
              <span class="text-gray-600">String - 크기 (sm|md|lg)</span>
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: "md"</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">block:</span>
              <span class="text-gray-600">Boolean - 전체 너비 사용</span>
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: false</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">disabled:</span>
              <span class="text-gray-600">Boolean - 버튼 비활성화</span>
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: false</span>
            </div>
          </div>
        </div>
      </Section>

      <!-- UiButton 테스트 -->
      <Section title="UiButton 컴포넌트" class="mb-8">
        <div class="flex flex-wrap gap-4">
          <UiButton variant="primary" size="lg">Primary Large</UiButton>
          <UiButton variant="secondary" size="md">Secondary Medium</UiButton>
          <UiButton variant="ghost" size="sm">Ghost Small</UiButton>
          <UiButton variant="secondary" block>Block Button</UiButton>
          <UiButton variant="primary" disabled>Disabled Button</UiButton>
        </div>
      </Section>

      <!-- Dropdown 사용법 가이드 -->
      <Section title="📚 Dropdown 컴포넌트 사용법" class="mb-6" card>
        <div class="space-y-4">
          <div class="rounded-lg bg-gray-50 p-4">
            <h4 class="mb-2 font-medium text-gray-800">사용 예시:</h4>
            <pre
              class="overflow-x-auto rounded border bg-white p-3 text-sm"
            ><code>&lt;Dropdown
  v-model="selectedValue"
  :options="[
    { value: 'option1', label: '옵션 1' },
    { value: 'option2', label: '옵션 2' }
  ]"
  @update:modelValue="handleSelect"
/&gt;</code></pre>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">modelValue:</span>
              <span class="text-gray-600"
                >String|Number - 선택된 값 (v-model)</span
              >
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: null</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">options:</span>
              <span class="text-gray-600"
                >Array - 옵션 목록 [{value, label}]</span
              >
              <span class="rounded bg-red-100 px-2 py-1 text-xs text-red-700"
                >필수</span
              >
            </div>
          </div>
        </div>
      </Section>

      <!-- Dropdown 테스트 -->
      <Section title="Dropdown 컴포넌트" class="mb-8">
        <div class="max-w-xs">
          <Dropdown
            v-model="selectedDropdownValue"
            :options="dropdownOptions"
            @update:model-value="handleDropdownSelect"
          />
          <p class="mt-2 text-sm text-gray-600">
            선택된 값: {{ selectedDropdownValue }}
          </p>
        </div>
      </Section>

      <!-- MoreButton 사용법 가이드 -->
      <Section title="📚 MoreButton 컴포넌트 사용법" class="mb-6" card>
        <div class="space-y-4">
          <div class="rounded-lg bg-gray-50 p-4">
            <h4 class="mb-2 font-medium text-gray-800">사용 예시:</h4>
            <pre
              class="overflow-x-auto rounded border bg-white p-3 text-sm"
            ><code>&lt;MoreButton @click="handleMoreClick"&gt;
  더 많은 내용 보기
&lt;/MoreButton&gt;</code></pre>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">@click:</span>
              <span class="text-gray-600">Event - 클릭 이벤트 핸들러</span>
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">slot:</span>
              <span class="text-gray-600">String - 버튼 텍스트</span>
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: "더 보기"</span>
            </div>
          </div>
        </div>
      </Section>

      <!-- MoreButton 테스트 -->
      <Section title="MoreButton 컴포넌트" class="mb-8">
        <MoreButton @click="handleMoreClick">더 많은 내용 보기</MoreButton>
      </Section>

      <!-- CardLg 사용법 가이드 -->
      <Section title="📚 CardLg 컴포넌트 사용법" class="mb-6" card>
        <div class="space-y-4">
          <div class="rounded-lg bg-gray-50 p-4">
            <h4 class="mb-2 font-medium text-gray-800">사용 예시:</h4>
            <pre
              class="overflow-x-auto rounded border bg-white p-3 text-sm"
            ><code>&lt;CardLg
  title="카드 제목"
  badge="신규"
  badge-tone="green"
  :details="[
    { label: '라벨', value: '값', tone: 'danger' }
  ]"
  action-label="액션"
  :favorited="false"
  @action="handleAction"
  @update:favorited="handleFavorite"
/&gt;</code></pre>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">title:</span>
              <span class="text-gray-600">String - 카드 제목</span>
              <span class="rounded bg-red-100 px-2 py-1 text-xs text-red-700"
                >필수</span
              >
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">badge:</span>
              <span class="text-gray-600">String - 뱃지 텍스트</span>
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: ""</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">badge-tone:</span>
              <span class="text-gray-600"
                >String - 뱃지 색상 (Tag 컴포넌트와 동일)</span
              >
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: "gray"</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">details:</span>
              <span class="text-gray-600"
                >Array - 상세 정보 [{label, value, tone?}]</span
              >
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: []</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">action-label:</span>
              <span class="text-gray-600">String - 액션 버튼 텍스트</span>
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: ""</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">favorited:</span>
              <span class="text-gray-600">Boolean - 즐겨찾기 상태</span>
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: false</span>
            </div>
          </div>
        </div>
      </Section>

      <!-- CardLg 테스트 -->
      <Section title="CardLg 컴포넌트" class="mb-8">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CardLg
            title="대출 상품 A"
            badge="신규"
            badge-tone="green"
            :details="[
              { label: '대출 한도', value: '최대 5천만원' },
              { label: '이자율', value: '연 3.5%', tone: 'danger' },
              { label: '상환기간', value: '최대 10년' },
            ]"
            action-label="상세보기"
            :favorited="false"
            @action="handleCardAction"
            @update:favorited="handleFavoriteUpdate"
          />
          <CardLg
            title="보조금 지원 B"
            badge="마감임박"
            badge-tone="red"
            :details="[
              { label: '지원금액', value: '최대 3천만원' },
              { label: '신청기간', value: '2024.12.31까지' },
              { label: '지원대상', value: '소상공인' },
            ]"
            action-label="신청하기"
            :favorited="true"
            @action="handleCardAction"
            @update:favorited="handleFavoriteUpdate"
          />
        </div>
      </Section>

      <!-- CardSm 사용법 가이드 -->
      <Section title="📚 CardSm 컴포넌트 사용법" class="mb-6" card>
        <div class="space-y-4">
          <div class="rounded-lg bg-gray-50 p-4">
            <h4 class="mb-2 font-medium text-gray-800">사용 예시:</h4>
            <pre
              class="overflow-x-auto rounded border bg-white p-3 text-sm"
            ><code>&lt;CardSm
  title="카드 제목"
  label="라벨"
  label-tone="green"
  meta="메타 정보"
/&gt;</code></pre>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">title:</span>
              <span class="text-gray-600">String - 카드 제목</span>
              <span class="rounded bg-red-100 px-2 py-1 text-xs text-red-700"
                >필수</span
              >
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">label:</span>
              <span class="text-gray-600">String - 라벨 텍스트</span>
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: ""</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">label-tone:</span>
              <span class="text-gray-600"
                >String - 라벨 색상 (Tag 컴포넌트와 동일)</span
              >
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: "yellow"</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-700">meta:</span>
              <span class="text-gray-600">String - 메타 정보 텍스트</span>
              <span class="rounded bg-gray-100 px-2 py-1 text-xs">선택</span>
              <span class="text-gray-500">기본값: ""</span>
            </div>
          </div>
        </div>
      </Section>

      <!-- CardSm 테스트 -->
      <Section title="CardSm 컴포넌트" class="mb-8">
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <CardSm
            title="상품 1"
            label="신규"
            label-tone="green"
            meta="2024.12.01 등록"
          />
          <CardSm
            title="상품 2"
            label="인기"
            label-tone="red"
            meta="조회수 1,234"
          />
          <CardSm
            title="상품 3"
            label="추천"
            label-tone="blue"
            meta="평점 4.8"
          />
          <CardSm
            title="상품 4"
            label="특가"
            label-tone="yellow"
            meta="할인 20%"
          />
        </div>
      </Section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppFooter from '@/components/common/AppFooter.vue';
import SearchBar from '@/components/common/SearchBar.vue';
import Tag from '@/components/common/Tag.vue';
import UiButton from '@/components/common/UiButton.vue';
import Dropdown from '@/components/common/Dropdown.vue';
import MoreButton from '@/components/common/MoreButton.vue';
import CardLg from '@/components/common/cards/CardLg.vue';
import CardSm from '@/components/common/cards/CardSm.vue';
import Section from '@/components/common/Section.vue';
import { useNotificationStore } from '@/stores/notification';

const notificationStore = useNotificationStore();

// 반응형 데이터
const searchText = ref('');
const selectedDropdownValue = ref('');

// 드롭다운 옵션
const dropdownOptions = [
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3' },
  { value: 'option4', label: '옵션 4' },
];

// 이벤트 핸들러
const handleSearch = value => {
  console.log('검색:', value);
  alert(`검색어: ${value}`);
};

const handleDropdownSelect = option => {
  selectedDropdownValue.value = option.label;
  console.log('선택된 옵션:', option);
};

const handleMoreClick = () => {
  console.log('더보기 클릭');
  alert('더보기 버튼이 클릭되었습니다!');
};

const handleCardClick = cardData => {
  console.log('카드 클릭:', cardData);
  alert(`카드가 클릭되었습니다: ${cardData.title}`);
};

const handleCardAction = cardData => {
  console.log('카드 액션:', cardData);
  alert('카드 액션 버튼이 클릭되었습니다!');
};

const handleFavoriteUpdate = favorited => {
  console.log('즐겨찾기 상태 변경:', favorited);
  alert(`즐겨찾기 ${favorited ? '추가' : '제거'}되었습니다!`);
};

// 토스트 알림 테스트 함수들
const showSuccessToast = () => {
  notificationStore.show('success', '성공적으로 처리되었습니다!');
};

const showErrorToast = () => {
  notificationStore.show('error', '오류가 발생했습니다.');
};

const showWarningToast = () => {
  notificationStore.show('warning', '경고: 주의가 필요합니다.');
};

const showInfoToast = () => {
  notificationStore.show('info', '정보: 알림입니다.');
};

// 지속 시간 테스트
const showQuickToast = () => {
  notificationStore.show('info', '빠른 알림입니다! (1초 후 사라짐)', 1000);
};

const showSlowToast = () => {
  notificationStore.show('warning', '느린 알림입니다! (5초 후 사라짐)', 5000);
};

const showCustomToast = () => {
  notificationStore.show(
    'success',
    '커스텀 지속시간 알림입니다! (3초 후 사라짐)',
    3000
  );
};

// 여러 알림 동시 표시 테스트
const showMultipleToasts = () => {
  notificationStore.show('info', '첫 번째 알림');
  notificationStore.show('success', '두 번째 알림');
  notificationStore.show('warning', '세 번째 알림');
  notificationStore.show('error', '네 번째 알림');
};

const showSequentialToasts = () => {
  notificationStore.show('info', '작업을 시작합니다...');

  setTimeout(() => {
    notificationStore.show('warning', '처리 중입니다...');
  }, 500);

  setTimeout(() => {
    notificationStore.show('success', '작업이 완료되었습니다!');
  }, 1000);
};

const clearAllToasts = () => {
  notificationStore.clear();
};

// 실전 사용 예시
const simulateLogin = () => {
  notificationStore.show('info', '로그인 중입니다...');

  setTimeout(() => {
    notificationStore.show('success', '로그인되었습니다!');
  }, 1000);
};

const simulateFormSubmit = () => {
  notificationStore.show('info', '폼을 제출하고 있습니다...');

  setTimeout(() => {
    notificationStore.show('success', '폼이 성공적으로 제출되었습니다!');
  }, 1500);
};

const simulateApiCall = () => {
  notificationStore.show('info', 'API를 호출하고 있습니다...');

  setTimeout(() => {
    notificationStore.show('success', '데이터를 성공적으로 불러왔습니다!');
  }, 2000);
};
</script>
