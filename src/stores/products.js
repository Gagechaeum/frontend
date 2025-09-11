import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getLoanList, getPolicyList } from '@/lib/api/products.js';

export const useProductsStore = defineStore('products', () => {
  // 상태
  const loans = ref([]);
  const policies = ref([]);
  const isLoading = ref(false);
  const lastFetchTime = ref(null);
  const cacheExpiry = 5 * 60 * 1000; // 5분 캐시

  // 캐시가 유효한지 확인
  const isCacheValid = computed(() => {
    if (!lastFetchTime.value) return false;
    return Date.now() - lastFetchTime.value < cacheExpiry;
  });

  // 대출 데이터가 있는지 확인
  const hasLoans = computed(() => loans.value.length > 0);

  // 정책 데이터가 있는지 확인
  const hasPolicies = computed(() => policies.value.length > 0);

  // 모든 데이터가 로드되었는지 확인
  const isDataLoaded = computed(() => hasLoans.value && hasPolicies.value);

  // API에서 데이터 가져오기
  const fetchAllProducts = async (forceRefresh = false) => {
    // 캐시가 유효하고 강제 새로고침이 아닌 경우 캐시된 데이터 반환
    if (isCacheValid.value && !forceRefresh && isDataLoaded.value) {
      return { loans: loans.value, policies: policies.value };
    }

    try {
      isLoading.value = true;

      // 병렬로 대출과 정책 데이터 가져오기
      const [loansResponse, policiesResponse] = await Promise.all([
        getLoanList({ size: 100 }), // 충분한 데이터 가져오기
        getPolicyList({ size: 100 }),
      ]);

      // 데이터 저장
      loans.value = loansResponse.data?.loans || [];
      policies.value = policiesResponse.data?.policies || [];
      lastFetchTime.value = Date.now();

      return { loans: loans.value, policies: policies.value };
    } catch (error) {
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // 마감 임박 상품 데이터
  const getUrgentProducts = computed(() => {
    const allProducts = [];

    // 대출 데이터 처리
    loans.value.forEach(loan => {
      if (loan.endDate) {
        const dday = calculateDDay(loan.endDate);
        if (dday) {
          allProducts.push({
            id: loan.loanId,
            title: loan.productName,
            dday: dday,
            meta: loan.maxLimit
              ? `최대 ${formatCurrency(loan.maxLimit)}`
              : '대출 상품',
            type: 'loan',
            endDate: loan.endDate,
          });
        }
      }
    });

    // 정책 데이터 처리
    policies.value.forEach(policy => {
      if (policy.endDate) {
        const dday = calculateDDay(policy.endDate);
        if (dday) {
          allProducts.push({
            id: policy.policyId,
            title: policy.policyName,
            dday: dday,
            meta: policy.supportAmount
              ? `최대 ${formatCurrency(policy.supportAmount)}`
              : '정책 상품',
            type: 'policy',
            endDate: policy.endDate,
          });
        }
      }
    });

    // endDate 기준으로 오름차순 정렬 (가장 임박한 순서)
    allProducts.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

    return allProducts.slice(0, 6);
  });

  // 인기 상품 데이터 (bookmarkCount 기준, 마감임박 섹션과 중복 제외)
  const getPopularProducts = computed(() => {
    const allProducts = [];
    const urgentIds = new Set(getUrgentProducts.value.map(item => item.id));

    // 대출 데이터 처리 (마감임박 섹션 제외)
    loans.value.forEach(loan => {
      if (!urgentIds.has(loan.loanId)) {
        allProducts.push({
          id: loan.loanId,
          title: loan.productName,
          industry: loan.industryName || '대출',
          meta: loan.maxLimit
            ? `최대 ${formatCurrency(loan.maxLimit)}`
            : '대출 상품',
          type: 'loan',
          bookmarkCount: loan.bookmarkCount || 0,
        });
      }
    });

    // 정책 데이터 처리 (마감임박 섹션 제외)
    policies.value.forEach(policy => {
      if (!urgentIds.has(policy.policyId)) {
        allProducts.push({
          id: policy.policyId,
          title: policy.policyName,
          industry: policy.industryName || '정책',
          meta: policy.supportAmount
            ? `최대 ${formatCurrency(policy.supportAmount)}`
            : '정책 상품',
          type: 'policy',
          bookmarkCount: policy.bookmarkCount || 0,
        });
      }
    });

    // bookmarkCount 기준으로 내림차순 정렬
    allProducts.sort((a, b) => (b.bookmarkCount || 0) - (a.bookmarkCount || 0));

    return allProducts.slice(0, 5);
  });

  // 업종별 인기 상품 데이터 (특정 업종들의 industryId에 해당하는 상품들만 필터링)
  const getIndustryPopularProducts = industryIds => {
    if (!industryIds || industryIds.length === 0) {
      return [];
    }

    const allProducts = [];
    const urgentIds = new Set(getUrgentProducts.value.map(item => item.id));

    // 대출 데이터 처리 (마감임박 섹션 제외, 업종 필터링)
    loans.value.forEach(loan => {
      if (
        !urgentIds.has(loan.loanId) &&
        industryIds.includes(loan.industryId)
      ) {
        allProducts.push({
          id: loan.loanId,
          title: loan.productName,
          industry: loan.industryName || '대출',
          meta: loan.maxLimit
            ? `최대 ${formatCurrency(loan.maxLimit)}`
            : '대출 상품',
          type: 'loan',
          bookmarkCount: loan.bookmarkCount || 0,
        });
      }
    });

    // 정책 데이터 처리 (마감임박 섹션 제외, 업종 필터링)
    policies.value.forEach(policy => {
      if (
        !urgentIds.has(policy.policyId) &&
        industryIds.includes(policy.industryId)
      ) {
        allProducts.push({
          id: policy.policyId,
          title: policy.policyName,
          industry: policy.industryName || '정책',
          meta: policy.supportAmount
            ? `최대 ${formatCurrency(policy.supportAmount)}`
            : '정책 상품',
          type: 'policy',
          bookmarkCount: policy.bookmarkCount || 0,
        });
      }
    });

    // bookmarkCount 기준으로 내림차순 정렬
    allProducts.sort((a, b) => (b.bookmarkCount || 0) - (a.bookmarkCount || 0));

    const result = allProducts.slice(0, 5);
    return result;
  };

  // 캐시 초기화
  const clearCache = () => {
    loans.value = [];
    policies.value = [];
    lastFetchTime.value = null;
  };

  // 통화 포맷 함수
  const formatCurrency = amount => {
    if (amount >= 100000000) {
      return `${Math.floor(amount / 100000000)}억원`;
    } else if (amount >= 10000) {
      return `${Math.floor(amount / 10000)}만원`;
    } else {
      return `${amount.toLocaleString()}원`;
    }
  };

  // D-day 계산 함수
  const calculateDDay = endDate => {
    if (!endDate) return null;

    const today = new Date();
    const deadline = new Date(endDate);

    // 시간을 00:00:00으로 설정하여 날짜만 비교
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'D-day';
    } else if (diffDays === 1) {
      return 'D-1';
    } else if (diffDays > 1) {
      return `D-${diffDays}`;
    } else {
      return null; // 이미 마감된 경우
    }
  };

  return {
    // 상태
    loans,
    policies,
    isLoading,
    isCacheValid,
    hasLoans,
    hasPolicies,
    isDataLoaded,

    // 액션
    fetchAllProducts,
    clearCache,

    // 계산된 속성
    getUrgentProducts,
    getPopularProducts,
    getIndustryPopularProducts,
  };
});
