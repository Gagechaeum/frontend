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

// /**
//  * 정책 검색 (관심 정책 추가 전 검색)
//  * @param {string} keyword - 검색어
//  * @param {string} token - 인증 토큰 (Bearer)
//  * @returns {Promise<Object>} 정책 검색 결과
//  */
// export const getPolicySearch = async (keyword, token) => {
//   try {
//     const response = await api.get('/reports/search', {
//       params: { keyword },
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('리포트UI _ 정책 검색 실패:', error);
//     throw error;
//   }
// };

// /**
//  * 사용자의 정책을 리포트에 등록
//  * @param {Object} payload - 정책 등록 요청 DTO
//  * @param {number} payload.policyId - 등록할 정책 ID
//  * @param {string} [payload.memo] - 메모(선택)
//  * @param {string} token - 인증 토큰 (Bearer)
//  * @returns {Promise<Object>} 등록 결과 (CustomResponse<Void>)
//  */
// export const savePersonalPolicy = async (payload, token) => {
//   try {
//     const response = await api.post('/reports/policies', payload, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('리포트UI _ 사용자 정책 등록 실패:', error);
//     throw error;
//   }
// };

// /**
//  * 사용자의 대출·정책 종합 데이터 조회 (대시보드)
//  * @param {string} token - 인증 토큰 (Bearer)
//  * @returns {Promise<Object>} 대시보드 데이터
//  */
// export const getLoanPolicy = async token => {
//   try {
//     const response = await api.get('/reports/dashboard', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('리포트UI _ 대시보드 조회 실패:', error);
//     throw error;
//   }
// };

// 공통 에러 핸들러: 콘솔에만 찍고 안전한 기본값 반환
function handleApiError(where, err, fallback) {
  const status = err?.response?.status;
  const msg = err?.response?.data?.message || err?.message || String(err);
  console.warn(`[API:${where}] status=${status} msg=${msg}`);
  return fallback;
}

/** ① 정책 전용 검색 */
export async function searchPolicies({ query, limit = 10, userId }, token) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await api.get('/reports/search/policies', {
      headers,
      params: { q: query, limit, userId },
    });
    // 프론트 표준 형태로 정규화
    return (Array.isArray(data) ? data : []).map(r => ({
      id: r.id,
      name: r.name ?? r.title ?? '',
      type: '정책',
      typeLabel: '정책',
      subtitle: r.provider ?? r.department ?? '',
    }));
  } catch (err) {
    return handleApiError('searchPolicies', err, []);
  }
}

/** ② 2주 일정 (지급/상환/만기 등) */
export async function getTwoWeekSchedule({ start, end, userId }, token) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await api.get('/reports/schedules/two-weeks', {
      headers,
      params: { start, end, userId },
    });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return handleApiError('two-weeks', err, []);
  }
}

/** ③ 이번달 요약 (혜택/납부 예정) */
export async function getMonthlySummary({ month, userId }, token) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await api.get('/reports/summary', {
      headers,
      params: { month, userId }, // 'YYYY-MM'
    });
    return {
      supportTotal: Number(data?.supportTotal ?? 0),
      repayTotal: Number(data?.repayTotal ?? 0),
    };
  } catch (err) {
    return handleApiError('summary', err, { supportTotal: 0, repayTotal: 0 });
  }
}

/** ④ 월별 현금 흐름 (정책 수입/대출 상환) */
export async function getIncomeExpenseTrend({ from, to, userId }, token) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await api.get('/reports/income-expense', {
      headers,
      params: { from, to, granularity: 'MONTHLY', userId }, // 'YYYY-MM' ~ 'YYYY-MM'
    });
    return Array.isArray(data)
      ? data.map(r => ({
          month: r?.month || '',
          policyIncome: Number(r?.policyIncome ?? 0),
          loanRepay: Number(r?.loanRepay ?? 0),
        }))
      : [];
  } catch (err) {
    return handleApiError('trend', err, []);
  }
}

/** ⑤ 대시보드 묶음 */
export async function getDashboard({ page = 0, size = 20 }, token) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await api.get('/reports/dashboard', {
      headers,
      params: { page, size },
    });
    return {
      summary: {
        supportTotal: Number(data?.summary?.supportTotal ?? 0),
        repayTotal: Number(data?.summary?.repayTotal ?? 0),
      },
      policy: Array.isArray(data?.policy) ? data.policy : [],
      loan: Array.isArray(data?.loan) ? data.loan : [],
      items: Array.isArray(data?.items) ? data.items : [],
      hasNext: Boolean(data?.hasNext),
    };
  } catch (err) {
    return handleApiError('dashboard', err, {
      summary: { supportTotal: 0, repayTotal: 0 },
      policy: [],
      loan: [],
      items: [],
      hasNext: false,
    });
  }
}
