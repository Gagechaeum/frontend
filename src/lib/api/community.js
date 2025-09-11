import api from './http.js';

/**
 * 채팅방 목록 조회
 * @param {string} type - 채팅방 타입 (기본값: 'all')
 * @returns {Promise<Object>} 채팅방 목록
 */
export const getChatRooms = async (type) => {
  try {
    const response = await api.get('/chatrooms', {
      params: { type },
    });
    return response.data;
  } catch (error) {
    console.error('채팅방 목록 조회 실패:', error);
    throw error;
  }
};

// 사용자 채팅방 목록 조회
export const getUserChatRooms = async (type) => {
  try {
    const response = await api.get('me/chatrooms', {
      params: { type },
    });
    return response.data;
  } catch (error) {
    console.error('사용자 채팅방 목록 조회 실패:', error);
    throw error;
  }
};

// 채팅방 히스토리 조회
export const getChatRoomHistory = async (roomId, since) => {
  try {
    const response = await api.get(`chatrooms/${roomId}/history`, {
      params: { since },
    });
    return response.data;
  } catch (error) {
    console.error('채팅방 히스토리 조회 실패:', error);
    throw error;
  }
};

// 파일 url 갱신
export const renewFileUrl = async (fileId) => {
  try {
    const response = await api.get(`chatrooms/attachment/${fileId}`);
    return response.data;
  } catch (error) {
    console.error('파일 URL 갱신 실패:', error);
    throw error;
  }
};
