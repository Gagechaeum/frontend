import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useDocsStore = defineStore('docs', () => {
  // 상태
  const viewMode = ref('kanban');
  const searchQuery = ref('');
  const filters = ref({
    type: 'all',
    status: 'all',
  });

  // 데이터
  const allItems = ref([
    {
      id: 1,
      type: '정책',
      name: '청년 전세자금 대출',
      institution: '한국주택금융공사',
      status: 'requirements',
      completedDocs: 0,
      totalDocs: 5,
      progress: 10,
      deadline: 'D-30',
      files: [
        { name: '신분증사본.jpg', size: '2.1MB', type: 'image' },
        { name: '소득증빙서류.pdf', size: '1.8MB', type: 'document' },
        { name: '주소증빙서류.pdf', size: '0.9MB', type: 'document' },
      ],
    },
    {
      id: 2,
      type: '대출',
      name: '신혼부부 주택구입자금',
      institution: '국민은행',
      status: 'collecting',
      completedDocs: 2,
      totalDocs: 6,
      progress: 35,
      deadline: 'D-15',
      files: [
        { name: '결혼증명서.pdf', size: '0.5MB', type: 'document' },
        { name: '소득증빙서류.pdf', size: '2.3MB', type: 'document' },
        { name: '주택계약서.pdf', size: '3.1MB', type: 'document' },
        { name: '은행거래내역.pdf', size: '1.2MB', type: 'document' },
      ],
    },
    {
      id: 3,
      type: '정책',
      name: '중소기업 창업지원금',
      institution: '중소벤처기업부',
      status: 'preparing',
      completedDocs: 4,
      totalDocs: 5,
      progress: 80,
      deadline: 'D-7',
      files: [
        { name: '사업계획서.pdf', size: '5.2MB', type: 'document' },
        { name: '사업자등록증.pdf', size: '0.8MB', type: 'document' },
        { name: '재무제표.pdf', size: '2.7MB', type: 'document' },
        { name: '창업교육수료증.pdf', size: '1.1MB', type: 'document' },
        { name: '사업장사진.jpg', size: '3.4MB', type: 'image' },
      ],
    },
    {
      id: 4,
      type: '대출',
      name: '개인사업자 운영자금',
      institution: '신한은행',
      status: 'completed',
      completedDocs: 4,
      totalDocs: 4,
      progress: 100,
      deadline: '완료',
      files: [
        { name: '사업자등록증.pdf', size: '0.8MB', type: 'document' },
        { name: '재무제표.pdf', size: '2.1MB', type: 'document' },
        { name: '소득증빙서류.pdf', size: '1.9MB', type: 'document' },
        { name: '사업계획서.pdf', size: '4.2MB', type: 'document' },
      ],
    },
  ]);

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

  return {
    // 상태
    viewMode,
    searchQuery,
    filters,
    allItems,

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
  };
});
