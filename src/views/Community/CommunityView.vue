<template>
  <div class="min-h-screen bg-[#F7F8FA] font-['Pretendard','Inter',sans-serif]">
    <div class="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <!-- 추천 캐러셀: 채팅방이 없을 때만 -->
      <section v-if="!selectedRoom" id="recommend" class="mb-6">
        <RecommendCarousel :rooms="recommendedRooms" @join="openJoinModal" />
      </section>

      <div class="flex flex-col gap-6">
        <!-- 리스트 화면 -->
        <div v-if="!selectedRoom" class="space-y-8">
          <LiveBanner />

          <section id="my-rooms">
            <MyRoomsSection
              :tabs="tabs"
              :active-tab="activeTab"
              :my-rooms="myRooms"
              @update:active-tab="val => (activeTab = val)"
              @enter-room="enterChatRoom"
            />
          </section>

          <AllRoomsSection
            ref="allRoomsSection"
            :regions="regions"
            :business-categories="businessCategories"
            @open-region="openRegion"
            @open-category="openBusinessCategory"
          />
        </div>

        <!-- 채팅 화면 -->
        <div v-else class="flex h-[72vh] gap-4">
          <ChatSidebar
            :my-rooms="myRooms"
            :selected-room="selectedRoom"
            @enter-room="enterChatRoom"
          />
          <ChatWindow
            :room="selectedRoom"
            :messages="currentRoomMessages"
            :current-user="currentUser"
            :current-avatar="currentAvatar"
            @back="selectedRoom = null"
            @leave="leaveRoom"
            @send-text="handleSendText"
            @send-image="handleSendImage"
            @send-video="handleSendVideo"
            @send-file="handleSendFile"
            @preview-image="openImagePreview"
          />
        </div>
      </div>
    </div>

    <!-- 모달들 -->
    <teleport to="body">
      <JoinModal
        :show="showJoinModal"
        :room="selectedRoomForJoin"
        @close="closeJoinModal"
        @confirm="joinRoom"
      />
    </teleport>

    <teleport to="body">
      <ImagePreviewModal
        :show="showImagePreview"
        :url="previewImageUrl"
        :name="previewImageName"
        @close="closeImagePreview"
      />
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { getUserChatRooms } from '@/lib/api/community.js';

import LiveBanner from '@/components/community/LiveBanner.vue';
import RecommendCarousel from '@/components/community/RecommendCarousel.vue';
import MyRoomsSection from '@/components/community/MyRoomsSection.vue';
import AllRoomsSection from '@/components/community/AllRoomsSection.vue';
import ChatSidebar from '@/components/community/ChatSidebar.vue';
import ChatWindow from '@/components/community/ChatWindow.vue';
import JoinModal from '@/components/community/JoinModal.vue';
import ImagePreviewModal from '@/components/community/ImagePreviewModal.vue';

/** 상태 */
const activeTab = ref('all');
const selectedRoom = ref(null);
const listScrollRoot = ref(null);
const allRoomsSection = ref(null);

/** 이미지 프리뷰 */
const showImagePreview = ref(false);
const previewImageUrl = ref('');
const previewImageName = ref('');

/** 모달 상태 */
const showJoinModal = ref(false);
const selectedRoomForJoin = ref(null);

/** 현재 사용자 */
const currentUser = ref('나');
const currentAvatar = 'https://i.pravatar.cc/100?img=5';

/** 추천 데이터(데모) */
const recommendedRooms = ref([
  {
    id: '1',
    name: '터키 일주 8일',
    description: '터키 여행 패키지',
    memberCount: 127,
    image: 'https://picsum.photos/id/1015/400/200',
  },
  {
    id: '2',
    name: '터키일주 9-10일',
    description: '터키 장기 패키지',
    memberCount: 89,
    image: 'https://picsum.photos/id/1016/400/200',
  },
  {
    id: '3',
    name: '파묵칼레 · 7일',
    description: '온천 & 자연경관',
    memberCount: 234,
    image: 'https://picsum.photos/id/1018/400/200',
  },
]);

/** 탭/목록 데이터 */
const tabs = ref([
  { id: 'all', name: '전체', icon: 'fas fa-th-large' },
  { id: 'industry', name: '업종', icon: 'fas fa-briefcase' },
  { id: 'region', name: '지역', icon: 'fas fa-map-marker-alt' },
  { id: 'loan', name: '대출', icon: 'fas fa-hand-holding-usd' },
  { id: 'policy', name: '정책', icon: 'fas fa-gavel' },
]);

const myRooms = ref();

/** (데모) 영역/업종 */
const regions = ref([]);
const businessCategories = ref([]);

/** 방별 메시지 저장소 */
const messagesByRoom = ref({
  5: [
    {
      id: 'm-501',
      user: '운영자',
      nickname: '운영자',
      avatarUrl: 'https://i.pravatar.cc/100?img=12',
      content: '어서오세요! 서초구 사장님들 환영합니다 🙌',
      time: '10:20',
      type: 'text',
    },
    {
      id: 'm-502',
      user: '나',
      nickname: '나',
      avatarUrl: currentAvatar,
      content: '안녕하세요~ 반갑습니다!',
      time: '10:22',
      type: 'text',
    },
  ],
  6: [
    {
      id: 'm-601',
      user: '헬스장장',
      nickname: '근지렁',
      avatarUrl: 'https://i.pravatar.cc/100?img=14',
      content: '회원권 환불 규정 어떻게 하시나요?',
      time: '09:05',
      type: 'text',
    },
  ],
  7: [
    {
      id: 'm-701',
      user: '정책도우미',
      nickname: '도우미',
      avatarUrl: 'https://i.pravatar.cc/100?img=22',
      content: '정책 Q&A에 오신 걸 환영합니다. 무엇이든 물어보세요.',
      time: '08:55',
      type: 'text',
    },
    // 이미지 메시지 예시 (ChatMessage 템플릿이 imageUrl/fileName을 읽음)
    {
      id: 'm-702',
      user: '나',
      nickname: '나',
      avatarUrl: 'https://i.pravatar.cc/100?img=12',
      imageUrl: 'https://picsum.photos/id/237/400/300',
      fileName: 'welcome.jpg',
      time: '10:25',
      type: 'image',
    },
  ],
});

/** 현재 방 메시지 */
const currentRoomMessages = computed(() =>
  selectedRoom.value ? messagesByRoom.value[selectedRoom.value.id] || [] : []
);

onMounted(() => {
  // API 데이터 로드
  fetchUserChatRooms();
});

const fetchUserChatRooms = async () => {
  try {
    const response = await getUserChatRooms("all");
    myRooms.value = response.data.chatRooms;
  } catch (error) {
    console.error('사용자 채팅방 목록 조회 실패:', error);
  }
};

/** 채팅 입퇴장/전송 */
const enterChatRoom = room => {
  if (!messagesByRoom.value[room.id]) {
    messagesByRoom.value[room.id] = [
      {
        id: `hello-${room.id}`,
        user: '운영자',
        nickname: `${room.name} 운영자`,
        avatarUrl: 'https://i.pravatar.cc/100?img=1',
        content: `혼저옵서예! "${room.name}" 채팅방입니다. 😊`,
        time: now(),
        type: 'text',
      },
    ];
  }
  selectedRoom.value = room;
  nextTick(scrollToBottom);
};
const leaveRoom = () => {
  selectedRoom.value = null;
};

const pushMessageToCurrentRoom = msg => {
  if (!selectedRoom.value) return;
  const rid = selectedRoom.value.id;
  if (!messagesByRoom.value[rid]) messagesByRoom.value[rid] = [];
  messagesByRoom.value[rid].push(msg);
};
const handleSendText = text => {
  if (!text?.trim() || !selectedRoom.value) return;
  pushMessageToCurrentRoom({
    id: Date.now().toString(),
    user: currentUser.value,
    nickname: currentUser.value,
    avatarUrl: currentAvatar,
    content: text.trim(),
    time: now(),
    type: 'text',
  });
  nextTick(scrollToBottom);
};
const handleSendImage = fileInfo => {
  pushMessageToCurrentRoom({
    id: Date.now().toString(),
    user: currentUser.value,
    nickname: currentUser.value,
    avatarUrl: currentAvatar,
    content: fileInfo?.url || '',
    name: fileInfo?.name || '',
    time: now(),
    type: 'image',
  });
  nextTick(scrollToBottom);
};
const handleSendVideo = fileInfo => {
  pushMessageToCurrentRoom({
    id: Date.now().toString(),
    user: currentUser.value,
    nickname: currentUser.value,
    avatarUrl: currentAvatar,
    content: fileInfo?.url || '',
    name: fileInfo?.name || '',
    time: now(),
    type: 'video',
  });
  nextTick(scrollToBottom);
};
const handleSendFile = fileInfo => {
  pushMessageToCurrentRoom({
    id: Date.now().toString(),
    user: currentUser.value,
    nickname: currentUser.value,
    avatarUrl: currentAvatar,
    content: fileInfo?.url || '',
    name: fileInfo?.name || '',
    time: now(),
    type: 'file',
  });
  nextTick(scrollToBottom);
};

/** 추천 캐러셀 → 모달 */
const openJoinModal = room => {
  selectedRoomForJoin.value = room;
  showJoinModal.value = true;
};
const closeJoinModal = () => {
  showJoinModal.value = false;
  selectedRoomForJoin.value = null;
};
const joinRoom = () => {
  if (!selectedRoomForJoin.value) return;
  const room = selectedRoomForJoin.value;
  if (!myRooms.value.some(r => r.id === room.id)) {
    myRooms.value.unshift({
      id: room.id,
      name: room.name,
      memberCount: room.memberCount ?? 0,
      lastMessageTime: '방금 전',
      unreadCount: 0,
    });
  }
  enterChatRoom(room);
  closeJoinModal();
};

/** 이미지 미리보기 */
const openImagePreview = ({ url, name }) => {
  previewImageUrl.value = url;
  previewImageName.value = name;
  showImagePreview.value = true;
};
const closeImagePreview = () => {
  showImagePreview.value = false;
  previewImageUrl.value = '';
  previewImageName.value = '';
};

/** 유틸 */
const now = () =>
  new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
const scrollToBottom = () => {
  const sc = document.querySelector('[data-messages-container]');
  if (sc) sc.scrollTop = sc.scrollHeight;
};

/** 키보드 핸들러 (등록/해제 동일 참조 사용) */
const handleKeydown = e => {
  if (e.key === 'Escape' && showImagePreview.value) closeImagePreview();
  if (e.key === 'Escape' && showJoinModal.value) closeJoinModal();
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});

/** 데모 핸들러 */
const openRegion = () => {};
const openBusinessCategory = () => {};
</script>
