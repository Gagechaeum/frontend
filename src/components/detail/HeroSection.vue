<template>
  <section :class="heroBackgroundClass">
    <div class="mx-auto max-w-7xl px-6">
      <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <h1 class="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
            {{ title }}
          </h1>
          <p class="mb-6 text-lg text-gray-600">
            {{ description }}
          </p>
          <div class="mb-6 flex items-center space-x-4">
            <button
              class="cursor-pointer p-2 text-gray-600 transition-colors hover:text-gray-900"
              title="공유"
              @click="shareContent"
            >
              <i class="fas fa-share-alt"></i>
            </button>
            <button
              class="cursor-pointer p-2 text-gray-600 transition-colors hover:text-gray-900"
              title="인쇄"
              @click="printContent"
            >
              <i class="fas fa-print"></i>
            </button>
            <button
              class="cursor-pointer p-2 text-gray-600 transition-colors hover:text-gray-900"
              :title="isFavorite ? '즐겨찾기 해제' : '즐겨찾기 등록'"
              @click="toggleFavorite"
            >
              <i
                class="fas fa-star"
                :class="{ 'text-yellow-400': isFavorite }"
              ></i>
            </button>
          </div>
          <button :class="ctaButtonClass">
            {{ ctaText }}
          </button>
          <div class="mt-6 text-sm text-gray-500">
            <p>주관기관: {{ agency }}</p>
          </div>
        </div>
        <div class="hidden lg:block">
          <img
            :src="image"
            :alt="imageAlt"
            class="h-full w-full rounded-2xl object-cover"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useNotificationStore } from '@/stores/notification';

const notification = useNotificationStore();

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ctaText: {
    type: String,
    default: '바로 신청하기',
  },
  agency: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    required: true,
  },
  productType: {
    type: String,
    default: 'loan', // 'loan' 또는 'policy'
  },
});

// 색상 분기처리
const heroBackgroundClass = computed(() => {
  return props.productType === 'policy'
    ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 py-12'
    : 'bg-gradient-to-r from-blue-50 to-blue-100 py-12';
});

const ctaButtonClass = computed(() => {
  return props.productType === 'policy'
    ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 !rounded-button font-semibold whitespace-nowrap cursor-pointer'
    : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 !rounded-button font-semibold whitespace-nowrap cursor-pointer';
});

// 즐겨찾기 상태 관리
const isFavorite = ref(false);

// 즐겨찾기 토글 함수
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;

  if (isFavorite.value) {
    // 즐겨찾기 등록
    notification.show(
      'success',
      `${props.title}이(가)\n즐겨찾기에 추가되었습니다.`
    );
  } else {
    // 즐겨찾기 해제
    notification.show(
      'info',
      `${props.title}이(가)\n즐겨찾기에서 제거되었습니다.`
    );
  }

  // localStorage에 상태 저장 (선택사항)
  localStorage.setItem(`favorite_${props.title}`, isFavorite.value);
};

// 공유 기능
const shareContent = async () => {
  const shareData = {
    title: props.title,
    text: props.description,
    url: window.location.href,
  };

  try {
    // 웹 공유 API 지원 시 (모바일/데스크톱)
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // 웹 공유 API 미지원 시 URL 복사
      await navigator.clipboard.writeText(window.location.href);
    }
  } catch (error) {
    // 공유 취소 또는 오류 시
    if (error.name !== 'AbortError') {
      // URL 복사로 대체
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch (copyError) {
        // 복사 실패 시 무시
      }
    }
  }
};

// 인쇄 기능
const printContent = () => {
  try {
    // 현재 페이지 인쇄
    window.print();
  } catch (error) {
    // 인쇄 실패 시 무시
  }
};

// 컴포넌트 마운트 시 저장된 즐겨찾기 상태 복원
onMounted(() => {
  const savedState = localStorage.getItem(`favorite_${props.title}`);
  if (savedState !== null) {
    isFavorite.value = savedState === 'true';
  }
});
</script>

<style scoped>
.\!rounded-button {
  border-radius: 24px !important;
}
</style>
