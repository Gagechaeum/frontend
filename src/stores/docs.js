import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  getUserDocuments,
  uploadUserDocument,
  downloadUserDocuments,
  deleteUserDocuments,
  getDocumentTypes,
} from '@/lib/api/documents.js';
import {
  getBookmarksProgress,
  updatePolicyStatus,
  updateLoanStatus,
} from '@/lib/api/bookmarks.js';

export const useDocsStore = defineStore('docs', () => {
  // 상태
  const viewMode = ref('kanban');
  const searchQuery = ref('');
  const filters = ref({
    type: 'all',
    status: 'all',
  });

  // 데이터
  const allItems = ref([]);
  const userDocuments = ref([]);
  const documentTypes = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // 게터
  const filteredItems = computed(() => {
    let items = allItems.value;

    // 타입 필터
    if (filters.value.type !== 'all') {
      const typeMap = {
        policy: '정책',
        loan: '대출',
      };
      items = items.filter(item => item.type === typeMap[filters.value.type]);
    }

    // 상태 필터
    if (filters.value.status !== 'all') {
      items = items.filter(item => item.status === filters.value.status);
    }

    // 검색어 필터
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      items = items.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.institution.toLowerCase().includes(query)
      );
    }

    return items;
  });

  // 액션
  const setViewMode = mode => {
    viewMode.value = mode;
  };

  const setSearchQuery = query => {
    searchQuery.value = query;
  };

  const setFilters = newFilters => {
    filters.value = { ...newFilters };
  };

  const addItem = item => {
    allItems.value.push({
      ...item,
      id: Date.now(),
    });
  };

  const updateItem = (id, updates) => {
    const index = allItems.value.findIndex(item => item.id === id);
    if (index !== -1) {
      allItems.value[index] = { ...allItems.value[index], ...updates };
    }
  };

  const removeItem = id => {
    const index = allItems.value.findIndex(item => item.id === id);
    if (index !== -1) {
      allItems.value.splice(index, 1);
    }
  };

  const updateItemStatus = (id, newStatus) => {
    const index = allItems.value.findIndex(item => item.id === id);
    if (index !== -1) {
      allItems.value[index].status = newStatus;
      allItems.value[index].processStage = mapStatusToProcessStage(newStatus);
    }
  };

  // 북마크 진행률 데이터 로드
  const fetchBookmarksProgress = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await getBookmarksProgress();

      let progressData = [];
      if (response && response.data) {
        progressData = response.data;
      } else if (Array.isArray(response)) {
        progressData = response;
      }

      console.log('API 응답:', response);
      console.log('진행률 데이터:', progressData);

      // API 응답을 칸반보드/리스트뷰 형식으로 변환
      const transformedItems = progressData.map(item => {
        const idParts = item.bookmarkId.split('_');
        const type = idParts[0];
        const num = idParts[1];

        return {
          id: item.bookmarkId,
          name: item.productName,
          institution: item.providerName,
          type: item.productType,
          status: mapProcessStageToStatus(item.processStage),
          processStage: item.processStage, // 원본 processStage 값 보존
          completedDocs: item.completedDocsCount || 0,
          totalDocs: item.totalDocsCount || 0,
          progress: item.progressPercentage || 0,
          originalType: type,
          originalId: num,
          policyId: item.policyId,
          loanId: item.loanId,
        };
      });

      allItems.value = transformedItems;
    } catch (err) {
      error.value = err.message || '북마크 진행률을 불러오는데 실패했습니다.';
      console.error('북마크 진행률 조회 실패:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const mapProcessStageToStatus = processStage => {
    const stageMap = {
      요건확인: 'requirements',
      '서류 수집/업로드': 'collecting',
      '제출 준비': 'preparing',
      '제출 완료/결과': 'completed',
    };
    return stageMap[processStage] || 'requirements';
  };

  const mapStatusToProcessStage = status => {
    const stageMap = {
      requirements: '요건확인',
      collecting: '서류 수집/업로드',
      preparing: '제출 준비',
      completed: '제출 완료/결과',
    };
    return stageMap[status] || '요건확인';
  };

  // 상태 업데이트 (API 호출 포함)
  const updateItemStatusWithAPI = async (id, newStatus) => {
    const item = allItems.value.find(item => item.id === id);
    if (!item) return false;

    try {
      const idParts = id.split('_');
      const type = idParts[0];
      const koreanStatus = mapStatusToProcessStage(newStatus);

      if (type === 'policy') {
        const bookmarkPolicyId = parseInt(idParts[1]);
        await updatePolicyStatus(bookmarkPolicyId, koreanStatus);
      } else if (type === 'loan') {
        const bookmarkLoanId = parseInt(idParts[1]);
        await updateLoanStatus(bookmarkLoanId, koreanStatus);
      } else {
        throw new Error(`알 수 없는 타입: ${type}`);
      }

      // 로컬 상태 업데이트
      updateItemStatus(id, newStatus);
      return true;
    } catch (err) {
      error.value = err.message || '상태 업데이트에 실패했습니다.';
      console.error('상태 업데이트 실패:', err);
      return false;
    }
  };

  // API 연동 액션들
  const fetchUserDocuments = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await getUserDocuments();
      userDocuments.value = response.data || [];
    } catch (err) {
      error.value = err.message || '서류 목록을 불러오는데 실패했습니다.';
      console.error('서류 목록 조회 실패:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const addDocument = async documentData => {
    try {
      isLoading.value = true;
      error.value = null;

      const formData = new FormData();
      // 백엔드 API 스펙에 맞게 필드명 수정
      formData.append('documentId', documentData.documentId || Date.now());
      formData.append(
        'documentName',
        documentData.documentName || documentData.name
      );
      formData.append(
        'issuedAt',
        documentData.issuedAt || documentData.issueDate
      );
      formData.append('file', documentData.file);

      await uploadUserDocument(formData);

      // 업로드 성공 후 목록 새로고침
      await fetchUserDocuments();

      return true;
    } catch (err) {
      error.value = err.message || '서류 업로드에 실패했습니다.';
      console.error('서류 업로드 실패:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const downloadDocuments = async ids => {
    try {
      isLoading.value = true;
      error.value = null;

      const blob = await downloadUserDocuments(ids);

      // 다운로드 처리
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `documents_${new Date().getTime()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      error.value = err.message || '서류 다운로드에 실패했습니다.';
      console.error('서류 다운로드 실패:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const removeDocuments = async ids => {
    try {
      isLoading.value = true;
      error.value = null;

      await deleteUserDocuments(ids);

      // 삭제 성공 후 목록 새로고침
      await fetchUserDocuments();

      return true;
    } catch (err) {
      error.value = err.message || '서류 삭제에 실패했습니다.';
      console.error('서류 삭제 실패:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Document Types 관련 함수들
  const loadDocumentTypes = async () => {
    try {
      isLoading.value = true;
      const response = await getDocumentTypes();
      documentTypes.value = response.data?.list || [];
    } catch (error) {
      console.error('서류 유형 로드 실패:', error);
      error.value = error.message;
    } finally {
      isLoading.value = false;
    }
  };

  // 서류명으로 documentId 찾기
  const getDocumentIdByName = documentName => {
    const document = documentTypes.value.find(doc => doc.name === documentName);
    return document ? document.id : null;
  };

  return {
    // 상태
    viewMode,
    searchQuery,
    filters,
    allItems,
    userDocuments,
    documentTypes,
    isLoading,
    error,

    // 게터
    filteredItems,

    // 액션
    setViewMode,
    setSearchQuery,
    setFilters,
    addItem,
    updateItem,
    removeItem,
    updateItemStatus,

    // API 액션
    fetchUserDocuments,
    addDocument,
    downloadDocuments,
    removeDocuments,
    fetchBookmarksProgress,
    updateItemStatusWithAPI,
    mapProcessStageToStatus,
    mapStatusToProcessStage,

    // Document Types 액션
    loadDocumentTypes,
    getDocumentIdByName,
  };
});
