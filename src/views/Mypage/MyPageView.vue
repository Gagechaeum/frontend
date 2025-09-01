<script setup>
import { ref } from 'vue';
import ProfileDisplay from '@/components/mypage/ProfileDisplay.vue';
import EditProfileForm from '@/components/mypage/EditProfileForm.vue';
import DeleteConfirmModal from '@/components/mypage/DeleteConfirmModal.vue';
// import ToastMessage from '@/components/mypage/ToastMessage.vue'; // TODO: 나중에 활성화

const isEditing = ref(false);
const showDeleteConfirm = ref(false);

// ✅ 초기 프로필을 실제 객체로 세팅
const userProfile = ref({
  name: '유기현', // 닉네임
  nickName: '김가게',
  phone: '010-1234-5678',
  email: 'gagechaeum@example.com',
  avatar: '', // 유효한 URL이 없으면 빈 문자열 두세요 (컴포넌트가 플레이스홀더로 대체)
  businesses: [
    {
      id: 1,
      registrationNumber: '123-45-67890',
      region: '서울특별시',
      type: '음식·외식업',
    },
    {
      id: 2,
      registrationNumber: '234-56-78901',
      region: '경기도',
      type: '도소매·유통',
    },
  ],
});

function openEdit() {
  isEditing.value = true;
}
function cancelEdit() {
  isEditing.value = false;
}

// ✅ EditProfileForm에서 deepClone 된 최종 객체가 넘어옵니다
function submitEdit(payload) {
  userProfile.value = payload; // ✅ form 전체를 그대로 반영
  isEditing.value = false;
}

// 탈퇴 모달
function requestDelete() {
  showDeleteConfirm.value = true;
}
function confirmDelete() {
  showDeleteConfirm.value = false;
  // 실제 API 호출/라우팅은 여기에서
  // router.push('/mypage'); 등
}
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
    <!-- profile이 존재할 때만 렌더 -->
    <ProfileDisplay
      v-if="!isEditing && userProfile"
      :profile="userProfile"
      @edit="openEdit"
    />

    <EditProfileForm
      v-else
      :model-value="userProfile"
      @cancel="cancelEdit"
      @submit="submitEdit"
      @request-delete="requestDelete"
    />

    <DeleteConfirmModal
      v-if="showDeleteConfirm"
      @cancel="showDeleteConfirm = false"
      @confirm="confirmDelete"
    />

    <!-- ToastMessage 나중에 붙일 예정 -->
    <!--
    <ToastMessage
      v-if="toast.show"
      :type="toast.type"
      :message="toast.message"
    />
    -->
  </div>
</template>
