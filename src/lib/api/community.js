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
