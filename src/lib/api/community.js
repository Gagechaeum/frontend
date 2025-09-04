import api from './http.js';

// api 작성 예시

/**
 * 사용자 정보 조회
 * @param {string} token - 인증 토큰
 * @returns {Promise<Object>} 사용자 프로필 정보
 */
// export const getUserInfo = async (token) => {
//     try {
//         const response = await api.get('/user/profile', {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         })
//         return response.data
//     } catch (error) {
//         console.error('사용자 정보 조회 실패:', error)
//         throw error
//     }
// }
