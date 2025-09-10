import api from './http.js';

// 서류 관련 API 함수들

/**
 * 서류 유형 목록 조회
 * @returns {Promise<{success:boolean, data:Array<{id:number,name:string}>}>}
 */
export const getDocumentTypes = async () => {
  try {
    const response = await api.get('/documents/types');
    return response.data;
  } catch (error) {
    console.error('서류 유형 조회 실패:', error);
    throw error;
  }
};

/**
 * 사용자의 서류 목록 조회
 * @returns {Promise} 서류 목록
 */
export const getUserDocuments = async () => {
  try {
    const response = await api.get('/me/documents');
    return response.data;
  } catch (error) {
    console.error('서류 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 서류 업로드
 * @param {Object} formData - 업로드할 서류 데이터
 * @param {string} formData.documentId - 서류 ID
 * @param {string} formData.documentName - 서류명
 * @param {string} formData.issuedAt - 발급일 (YYYY-MM-DD)
 * @param {File} formData.file - 업로드할 파일
 * @returns {Promise} 업로드 결과
 */
export const uploadUserDocument = async formData => {
  try {
    const response = await api.post('/me/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('서류 업로드 실패:', error);
    throw error;
  }
};

/**
 * 서류 다운로드
 * @param {Array<number>} ids - 다운로드할 서류 ID 배열
 * @returns {Promise} 다운로드 데이터
 */
export const downloadUserDocuments = async ids => {
  try {
    const params = new URLSearchParams();
    ids.forEach(id => params.append('ids', id));

    const response = await api.get('/me/documents/download', {
      params,
      responseType: ids.length === 1 ? 'json' : 'blob', // 단일은 JSON, 다중은 blob
    });

    if (ids.length === 1) {
      return response.data.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error('서류 다운로드 실패:', error);
    throw error;
  }
};

/**
 * 서류 삭제
 * @param {Array<number>} ids - 삭제할 서류 ID 배열
 * @returns {Promise} 삭제 결과
 */
export const deleteUserDocuments = async ids => {
  try {
    const params = new URLSearchParams();
    ids.forEach(id => params.append('ids', id));

    const response = await api.delete('/me/documents', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('서류 삭제 실패:', error);
    throw error;
  }
};

/**
 * 정책별 필요 서류 조회
 * @param {string} policyId - 정책 ID
 * @returns {Promise} 정책별 필요 서류 목록
 */
export const getPolicyDocuments = async policyId => {
  try {
    const response = await api.get(`/policies/${policyId}/documents`);
    return response.data;
  } catch (error) {
    console.error('정책별 서류 조회 실패:', error);
    throw error;
  }
};

/**
 * 상품별 서류 체크리스트 조회
 * @param {string} productId - 상품 ID
 * @param {string} type - 상품 타입 ('policy' 또는 'loan')
 * @returns {Promise} 서류 체크리스트 데이터
 */
export const getDocumentChecklist = async (productId, type) => {
  try {
    // TODO: 추후 productId 대신 policyId 또는 loanId로 변경
    const response = await api.get(`/products/${productId}/documents`, {
      params: { type },
    });
    return response.data;
  } catch (error) {
    console.error('서류 체크리스트 조회 실패:', error);
    throw error;
  }
};
