<script setup>
/* ───────── imports ───────── */
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMyPageStore } from '@/stores/mypage';
import { useMyPageViewStore } from '@/stores/mypageView';
import { changePassword } from '@/lib/api/mypage';

/* 이 파일의 템플릿에서 쓰는 자식 컴포넌트가 있다면 import (SFC 자동 등록 안 쓰는 경우) */
// import ProfileDisplay from '@/components/mypage/ProfileDisplay.vue';
// import EditProfileForm from '@/components/mypage/EditProfileForm.vue';
// import DeleteConfirmModal from '@/components/mypage/DeleteConfirmModal.vue';

/* ───────── 기본 셋업 ───────── */
const router = useRouter();
const my = useMyPageStore();

/* 보기/수정 토글 */
const isEditing = ref(false);

/* 화면용 모델 (초기값 안전) */
const userProfile = ref({
  avatar: '',
  name: '',
  nickname: '',
  phone: '',
  email: '',
  businesses: [],
});
const businesses = ref([]);

/* 탈퇴 확인 모달 */
const showDeleteConfirm = ref(false);

/* ───────── 초기 로드 ───────── */
onMounted(async () => {
  console.log('[MyPage] onMounted: start hydrate');
  try {
    await my.hydrate?.();
    console.log(
      '[MyPage] hydrate done. rawUser=',
      my.rawUser,
      'rawBiz=',
      my.rawBusinesses
    );

    const view = my.profileForView;
    console.log('[MyPage] profileForView=', view);

    if (view) {
      // avatar는 스토어 게터로 확실히 채움
      Object.assign(userProfile.value, view, { avatar: my.avatarUrl });
    }
    businesses.value = my.businesses ?? [];

    console.log('[MyPage] after merge: userProfile=', userProfile.value);
  } catch (e) {
    console.error('[MyPage] hydrate 실패:', e);
  }
});

/* ───────── 편집 제어 ───────── */
function openEdit() {
  isEditing.value = true;
}
function cancelEdit() {
  isEditing.value = false;
}

/* ───────── 저장(닉네임/연락처/이미지/사업자) ─────────
   자식(EditProfileForm)에서 emit('submit', payload)로 호출됨.
   payload 예시:
   {
     nickname, phone,
     avatarFile?,               // 파일 객체 (변경 시)
     businesses?: [...],        // 사업자 배열 최종본
     confirmPassword?, newPassword? // 비번 변경 입력시 선택
   }
*/
async function submitEdit(payload = {}) {
  // 1) 비밀번호 값 추출 (current/old 호환)
  const cur = (payload.currentPassword ?? payload.oldPassword ?? '').trim();
  const next = (payload.newPassword ?? '').trim();
  const conf = (payload.confirmPassword ?? payload.newPassword ?? '').trim();
  const hasPw = !!(cur || next || conf);

  try {
    console.log('[MyPage] submitEdit payload=', payload);

    // 2) ✅ 비밀번호 먼저 처리 (응답의 success로 판정)
    if (hasPw) {
      const r = await changePassword(cur, next, conf);
      console.log('[MyPage] password-change response =', r);
      if (r?.success !== true) {
        // 실패면 여기서 중단 (나머지 저장 진행하지 않음)
        alert(r?.message || '비밀번호 변경에 실패했습니다.');
        return;
      }
    }

    // 3) 이후 프로필/사업자 등 저장 (비번은 이미 처리했으니 넘기지 않음)
    await my.saveAll?.({
      basics: { nickname: payload.nickname, phone: payload.phone },
      avatarFile: payload.avatarFile ?? null,
      businesses: Array.isArray(payload.businesses)
        ? payload.businesses
        : undefined,
      password: undefined, // ← 비번 중복 호출 방지
    });

    // 저장 후 최신값 재적재
    await my.hydrate?.();

    const view = my.profileForView;
    if (view) {
      Object.assign(userProfile.value, view, { avatar: my.avatarUrl });
    }
    businesses.value = my.businesses ?? [];
    isEditing.value = false;

    console.log('[MyPage] 저장 완료');
    // TODO: showToast && showToast('저장되었습니다.');
  } catch (e) {
    console.error('[MyPage] 저장 실패:', e?.response?.data ?? e);
    alert(e?.response?.data?.message || '저장에 실패했습니다.');
  }
}

/* ───────── 탈퇴(모달 열기/확정) ───────── */
function requestDelete() {
  showDeleteConfirm.value = true;
}
function onCancelDelete() {
  showDeleteConfirm.value = false;
}
async function onConfirmDelete() {
  try {
    showDeleteConfirm.value = false;
    await my.doWithdraw?.(); // PUT /api/me/withdrawal
    // 필요 시 토큰/스토어 정리(my.reset?.()) 등 추가
    router.push('/'); // 홈으로 이동
  } catch (e) {
    console.error('[MyPage] 탈퇴 실패:', e?.response?.data ?? e);
    alert(e?.response?.data?.message || '계정 탈퇴에 실패했습니다.');
  }
}

/* 삭제 버튼에서 사용 (왼쪽 하단 작은 버튼) */
function onClickDelete() {
  requestDelete();
}

/* (선택) 템플릿 바깥에서 접근이 필요하면 노출 */
defineExpose({
  openEdit,
  cancelEdit,
  submitEdit,
  onClickDelete,
  requestDelete,
  onCancelDelete,
  onConfirmDelete,
  isEditing,
  showDeleteConfirm,
  userProfile,
  businesses,
});
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
    <!-- 보기 모드 -->

    <ProfileDisplay
      v-if="!isEditing && userProfile"
      :profile="userProfile"
      @edit="openEdit"
    />

    <!-- 수정 모드: EditProfileForm만 -->
    <EditProfileForm
      v-else
      :model-value="userProfile"
      @cancel="cancelEdit"
      @submit="submitEdit"
      @request-delete="requestDelete"
    />

    <!-- 탈퇴 모달 -->
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
