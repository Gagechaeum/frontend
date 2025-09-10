import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  getUserDocuments,
  uploadUserDocument,
  downloadUserDocuments,
  deleteUserDocuments,
} from '@/lib/api/documents.js';

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

  return {
    // 상태
    viewMode,
    searchQuery,
    filters,
    allItems,
    userDocuments,
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
  };
});
