<script setup>
import { ref } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import ProfileDisplay from '@/components/mypage/ProfileDisplay.vue';
import EditProfileForm from '@/components/mypage/EditProfileForm.vue';
import DeleteConfirmModal from '@/components/mypage/DeleteConfirmModal.vue';
import ToastMessage from '@/components/mypage/ToastMessage.vue';
// import { getMyProfile, saveMyProfile, deleteAccount } from '@/lib/api/auth' 등

const isEditing = ref(false);
const showDeleteConfirm = ref(false);
const toast = ref({ show: false, type: 'success', message: '' });

const userProfile = ref({
  name: '김가게',
  phone: '010-1234-5678',
  email: 'gagechaeum@example.com',
  avatar: 'https://...',
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

async function submitEdit(payload) {
  // await saveMyProfile(payload)
  userProfile.value = payload;
  isEditing.value = false;
  showToast('success', '저장되었습니다.');
}

function requestDelete() {
  showDeleteConfirm.value = true;
}

async function confirmDelete() {
  showDeleteConfirm.value = false;
  // await deleteAccount()
  showToast('success', '계정이 삭제되었습니다.');
}

function showToast(type, message) {
  toast.value = { show: true, type, message };
  setTimeout(() => (toast.value.show = false), 2500);
}
</script>

<template>
  <div>
    <!-- <AppHeader /> -->

    <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <ProfileDisplay
        v-if="!isEditing"
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
    </div>

    <DeleteConfirmModal
      v-if="showDeleteConfirm"
      @cancel="showDeleteConfirm = false"
      @confirm="confirmDelete"
    />

    <ToastMessage
      v-if="toast.show"
      :type="toast.type"
      :message="toast.message"
    />
  </div>
</template>
