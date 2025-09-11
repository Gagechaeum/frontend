/* eslint-env browser */

import api from './http.js';
import { getAccessToken } from './auth'; // 토큰은 여기서만 꺼냄

// --- Helper Functions ---

/**
 * API 호출 시 발생하는 에러를 처리합니다.
 * @param {string} where - 에러 발생 위치 (함수 이름 등)
 * @param {Error} err - 발생한 에러 객체
 * @param {*} fallback - 에러 발생 시 반환할 기본값
 * @returns {*} fallback 값
 */
function handleApiError(where, err, fallback) {
  const status = err?.response?.status;
  const msg = err?.response?.data?.message || err?.message || String(err);

  globalThis.console?.warn(`[API:${where}] status=${status} msg=${msg}`);
  return fallback;
}

/**
 * 인증이 필요한 API 호출을 위해 AccessToken을 포함한 헤더를 생성합니다.
 * @returns {Object} Authorization 헤더 객체
 */
function authHeaders() {
  const at = getAccessToken();
  return at ? { Authorization: `Bearer ${at}` } : {};
}

// --- API Functions ---

/**
 * ① 정책 검색
 * @param {Object} args
 * @param {string} args.query - 검색어
 */
export async function searchPolicies({ query }) {
  try {
    const { data } = await api.get('/reports/search', {
      headers: authHeaders(),
      params: { keyword: query },
    });

    const rows = Array.isArray(data.data) ? data.data : [];
    return rows.map(r => ({
      id: r.policyId,
      name: r.policyName ?? '',
      type: '정책',
      typeLabel: '정책',
      subtitle: r.provider ?? '',
    }));
  } catch (err) {
    return handleApiError('searchPolicies', err, []);
  }
}

/**
 * ② 대시보드 데이터 조회
 */
export async function getDashboard() {
  try {
    const { data } = await api.get('/reports/dashboard', {
      headers: authHeaders(),
    });
    const backendData = data.data;
    return {
      summary: {
        supportTotal: Number(backendData?.summary?.totalBenefitAmount ?? 0),
        repayTotal: Number(backendData?.summary?.totalRepaymentAmount ?? 0),
      },
      schedule: Array.isArray(backendData?.schedule)
        ? backendData.schedule
        : [],
      cashFlow: Array.isArray(backendData?.cashFlow)
        ? backendData.cashFlow
        : [],
    };
  } catch (err) {
    return handleApiError('dashboard', err, {
      summary: { supportTotal: 0, repayTotal: 0 },
      schedule: [],
      cashFlow: [],
    });
  }
}

/**
 * ③ 사용자의 정책을 리포트에 등록
 * @param {Object} payload - 정책 등록 요청 DTO
 * @param {number} payload.policyId - 등록할 정책 ID
 * @param {string} [payload.memo] - 메모(선택)
 */
export async function saveUserPolicy(payload) {
  try {
    const response = await api.post('/reports/policies', payload, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('리포트UI _ 사용자 정책 등록 실패:', error);
    throw error;
  }
}

/**
 * ④ 전체 항목 조회 (페이지네이션)
 * @param {Object} [args]
 * @param {number} [args.page=0]
 * @param {number} [args.size=5]
 */
export async function getItems({ page = 0, size = 5 } = {}) {
  try {
    const { data } = await api.get('/reports/items', {
      headers: authHeaders(),
      params: { page, size },
    });
    console.log('[API] Raw items data:', data);

    const pageData = data.data;

    console.log('[API] Returning pageData object directly:', pageData);
    return pageData;
  } catch (err) {
    return handleApiError('items', err, {
      content: [],
      totalPages: 0,
      page: 0,
      totalElements: 0,
    });
  }
}

/**
 * ⑤ 2주 일정 조회
 * ⚠️ 백엔드에 `/reports/schedules/two-weeks`가 실제로 있을 때만 사용
 * @param {Object} args
 * @param {string} args.start - 시작일 (YYYY-MM-DD)
 * @param {string} args.end - 종료일 (YYYY-MM-DD)
 */
export async function getTwoWeekSchedule({ start, end }) {
  try {
    const { data } = await api.get('/reports/schedules/two-weeks', {
      headers: authHeaders(),
      params: { start, end },
    });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return handleApiError('getTwoWeekSchedule', err, []);
  }
}

/**
 * ⑥ 이번달 요약 조회
 * ⚠️ 백엔드에 `/reports/summary`가 실제로 있을 때만 사용
 * @param {Object} args
 * @param {string} args.month - 조회할 월 (YYYY-MM)
 */
export async function getMonthlySummary({ month }) {
  try {
    const { data } = await api.get('/reports/summary', {
      headers: authHeaders(),
      params: { month },
    });
    return {
      supportTotal: Number(data?.supportTotal ?? 0),
      repayTotal: Number(data?.repayTotal ?? 0),
    };
  } catch (err) {
    return handleApiError('getMonthlySummary', err, {
      supportTotal: 0,
      repayTotal: 0,
    });
  }
}

/**
 * ⑦ 월별 현금 흐름 조회
 * ⚠️ 백엔드에 `/reports/income-expense`가 실제로 있을 때만 사용
 * @param {Object} args
 * @param {string} args.from - 시작 월 (YYYY-MM)
 * @param {string} args.to - 종료 월 (YYYY-MM)
 */
export async function getIncomeExpenseTrend({ from, to }) {
  try {
    const { data } = await api.get('/reports/income-expense', {
      headers: authHeaders(),
      params: { from, to, granularity: 'MONTHLY' },
    });
    return Array.isArray(data)
      ? data.map(r => ({
          month: r?.month || '',
          policyIncome: Number(r?.policyIncome ?? 0),
          loanRepay: Number(r?.loanRepay ?? 0),
        }))
      : [];
  } catch (err) {
    return handleApiError('getIncomeExpenseTrend', err, []);
  }
}

/**
 * ⑧ 마이데이터 연동으로 대출 정보 등록
 */
export async function linkLoanData() {
  try {
    const response = await api.post(
      '/loans/mydata',
      {},
      {
        headers: authHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('대출 정보 연동 실패:', error);
    throw error;
  }
}
