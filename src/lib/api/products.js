import api from './http.js';

export const FALLBACK_LOANS_DATA = [
  {
    loanId: 1,
    industryId: 20,
    regionId: 1,
    companyName: '국민은행',
    productName: 'KB 동반성장협약 상생대출',
    beginDate: '2025-08-18',
    endDate: null,
    minLimit: 0,
    maxLimit: 0,
    minRate: null,
    maxRate: null,
    basicRate: 0.45,
    bookmarkCount: 0,
  },
  {
    loanId: 2,
    industryId: 20,
    regionId: 1,
    companyName: '농협은행주식회사',
    productName: '채움 상생론',
    beginDate: '2025-08-18',
    endDate: null,
    minLimit: 0,
    maxLimit: 0,
    minRate: 1.89,
    maxRate: 1.89,
    basicRate: 5.04,
    bookmarkCount: 0,
  },
  {
    loanId: 3,
    industryId: 12,
    regionId: 1,
    companyName: '주식회사 케이뱅크',
    productName: '사장님 부동산담보대출',
    beginDate: '2025-08-18',
    endDate: null,
    minLimit: 10000000,
    maxLimit: 1000000000,
    minRate: null,
    maxRate: null,
    basicRate: 2.69,
    bookmarkCount: 0,
  },
  {
    loanId: 4,
    industryId: 11,
    regionId: 1,
    companyName: '우리은행',
    productName: '우리CUBE론-X(우리자산신탁)',
    beginDate: '2025-08-18',
    endDate: null,
    minLimit: 1000000000,
    maxLimit: 0,
    minRate: null,
    maxRate: null,
    basicRate: 3.2,
    bookmarkCount: 0,
  },
];

export const FALLBACK_POLICIES_DATA = {
  data: {
    policies: [
      {
        policyId: '508000000690',
        industryId: 3,
        regionId: 47240,
        policyName: '구미시 근로취약계층 유급병가 지원',
        supervisingOrganizationName: '경상북도 구미시',
        noticeDate: '2024-02-06T13:22:26',
        modificationDate: '2025-07-25T14:05:37',
        beginDate: '2025-01-01',
        endDate: '2025-12-31',
        bookmarkCount: 0,
      },
      {
        policyId: '510000000132',
        industryId: 11,
        regionId: 47260,
        policyName: '소상공인 정책자금 이차보전',
        supervisingOrganizationName: '경상북도 영천시',
        noticeDate: '2022-02-08T18:42:21',
        modificationDate: '2025-07-23T11:37:32',
        beginDate: null,
        endDate: null,
        bookmarkCount: 0,
      },
      {
        policyId: '516000000124',
        industryId: 1,
        regionId: 47330,
        policyName: '축산물판매업소 육절기, 골절기 구입비용 지원',
        supervisingOrganizationName: '경상북도 청송군',
        noticeDate: '2021-09-23T12:34:56',
        modificationDate: '2025-07-24T11:51:11',
        beginDate: null,
        endDate: null,
        bookmarkCount: 0,
      },
      {
        policyId: '547000000152',
        industryId: 5,
        regionId: 48380,
        policyName: '상수도요금 감면(소상공인)',
        supervisingOrganizationName: '경상남도 거창군',
        noticeDate: '2022-12-01T22:14:12',
        modificationDate: '2025-07-11T10:03:37',
        beginDate: null,
        endDate: null,
        bookmarkCount: 0,
      },
    ],
  },
};

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
