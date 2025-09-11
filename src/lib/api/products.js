import api from './http.js';

/**
 * 대출 상세 정보 조회
 * @param {number} loanId - 대출 ID
 * @returns {Promise<Object>} 대출 상세 정보
 */
export const getLoanDetail = async loanId => {
  try {
    const response = await api.get(`/loans/${loanId}`);
    return response.data;
  } catch (error) {
    console.error('대출 상세 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 정책 상세 정보 조회
 * @param {string} policyId - 정책 ID
 * @returns {Promise<Object>} 정책 상세 정보
 */
export const getPolicyDetail = async policyId => {
  try {
    const response = await api.get(`/policies/${policyId}`);
    return response.data;
  } catch (error) {
    console.error('정책 상세 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 대출 목록 조회
 * @param {Object} params - 검색 파라미터
 * @returns {Promise<Object>} 대출 목록
 */
export const getLoanList = async (params = {}) => {
  try {
    const response = await api.get('/loans', { params });
    return response.data;
  } catch (error) {
    console.error('대출 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 정책 목록 조회
 * @param {Object} params - 검색 파라미터
 * @returns {Promise<Object>} 정책 목록
 */
export const getPolicyList = async (params = {}) => {
  try {
    const response = await api.get('/policies', { params });
    return response.data;
  } catch (error) {
    console.error('정책 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 추천 대출 조회
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} 추천 대출 목록
 */
export const getRecommendedLoans = async userId => {
  try {
    const response = await api.get('/loans/recommendation', {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error('추천 대출 조회 실패:', error);
    throw error;
  }
};

/**
 * 추천 정책 조회
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} 추천 정책 목록
 */
export const getRecommendedPolicies = async userId => {
  try {
    const response = await api.get('/policies/recommendation', {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error('추천 정책 조회 실패:', error);
    throw error;
  }
};

/**
 * 통합 검색 (대출/정책)
 * @param {string} keyword - 검색 키워드
 * @param {number} page - 페이지 번호 (기본값: 0)
 * @param {number} size - 페이지 크기 (기본값: 20)
 * @returns {Promise<Object>} 검색 결과
 */
export const searchProducts = async (keyword, page = 0, size = 20) => {
  try {
    const response = await api.get('/search', {
      params: { keyword, page, size },
    });
    return response.data;
  } catch (error) {
    console.error('통합 검색 실패:', error);
    throw error;
  }
};
