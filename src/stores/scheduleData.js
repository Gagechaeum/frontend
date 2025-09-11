// src/stores/scheduleData.js
// 일정 페이지 전용: 정책/대출 목록을 합쳐 공통 포맷으로 제공 + 전역 검색 연동
import dayjs from 'dayjs';
import { listPolicies, listLoans } from '@/lib/api/schedule';
import { searchGlobal } from '@/lib/api/search';

let _cache = null;

const toArr = v => (Array.isArray(v) ? v : v ? [v] : []);
const toDateOnly = v => (v ? String(v).slice(0, 10) : null);

function calcStatus(period) {
  if (!period?.start || !period?.end) return 'closed';
  const today = dayjs().startOf('day');
  const s = dayjs(period.start);
  const e = dayjs(period.end).endOf('day');
  if (today.isBefore(s)) return 'upcoming';
  if (today.isAfter(e)) return 'closed';
  return e.diff(today, 'day') <= 7 ? 'due' : 'active';
}

// --- snake_case / camelCase 대응 + end 없으면 begin으로 채움 ---
function mapPolicy(p) {
  const policyId = p.policyId ?? p.id ?? p.policy_id;
  const title = p.policyName ?? p.title ?? p.policy_name;
  const org =
    p.supervisingOrganizationName ?? p.org ?? p.supervising_organization_name;
  const begin = p.beginDate ?? p.begin_date;
  const endRaw = p.endDate ?? p.end_date;
  const end = endRaw ?? begin;

  const period = { start: toDateOnly(begin), end: toDateOnly(end) };
  const item = {
    id: `policy_${policyId}`,
    kind: 'policy',
    title,
    org,
    orgArr: toArr(org),
    period,
    region: [],
    industry: [],
    target: [],
    type: [],
    tags: [],
  };
  item.status = calcStatus(item.period);
  return item;
}

function mapLoan(l) {
  const loanId = l.loanId ?? l.id ?? l.loan_id;
  const title = l.productName ?? l.title ?? l.product_name;
  const org = l.companyName ?? l.org ?? l.company_name;
  const begin = l.beginDate ?? l.begin_date;
  const endRaw = l.endDate ?? l.end_date;
  const end = endRaw ?? begin;

  const period = { start: toDateOnly(begin), end: toDateOnly(end) };
  const item = {
    id: `loan_${loanId}`,
    kind: 'loan',
    title,
    org,
    orgArr: toArr(org),
    period,
    region: [],
    industry: [],
    target: [],
    type: [],
    tags: [],
  };
  item.status = calcStatus(item.period);
  return item;
}

// 전체 로드(캐시). 검색어가 없을 때만 캐시 사용
async function loadAll() {
  if (_cache) return _cache;

  const [pols, loans] = await Promise.all([
    listPolicies({ page: 1, size: 500 }).catch(() => []),
    listLoans({ page: 1, size: 500 }).catch(() => []),
  ]);

  _cache = [
    ...(Array.isArray(pols) ? pols.map(mapPolicy) : []),
    ...(Array.isArray(loans) ? loans.map(mapLoan) : []),
  ];
  return _cache;
}

// 전역검색 → id Set('policy_1','loan_2',…) 생성
async function searchIdSet(keyword) {
  try {
    const { results } = await searchGlobal({ keyword, page: 0, size: 1000 });
    const ids = results
      .map(r =>
        r?.type === 'LOAN'
          ? `loan_${r.id}`
          : r?.type === 'POLICY'
            ? `policy_${r.id}`
            : null
      )
      .filter(Boolean);
    return new Set(ids);
  } catch {
    return new Set();
  }
}

// -------- 공개 함수들 --------
export async function fetchSchedule(params = {}) {
  const items = await loadAll();
  let base = items;

  // 🔎 서버 전역 검색 연동: keyword가 있으면 id Set으로 미리 1차 필터
  const keyword = (params.q || '').trim();
  if (keyword) {
    const idset = await searchIdSet(keyword);
    if (idset.size === 0) return []; // 검색 결과 없음 → 바로 빈 배열
    base = items.filter(it => idset.has(it.id));
    // 이후 클라 필터에서는 q를 비워 중복 필터링 방지
    params = { ...params, q: '' };
  }

  return applyFilters(base, params);
}

export async function fetchScheduleByDay(date, params = {}) {
  const items = await loadAll();
  let base = items;

  const keyword = (params.q || '').trim();
  if (keyword) {
    const idset = await searchIdSet(keyword);
    if (idset.size === 0) return [];
    base = items.filter(it => idset.has(it.id));
    params = { ...params, q: '' };
  }

  const filtered = applyFilters(base, params);
  if (!date) return [];
  const d = dayjs(date);
  return filtered.filter(it => {
    const s = dayjs(it.period?.start);
    const e = dayjs(it.period?.end).endOf('day');
    return (
      d.isValid() &&
      s.isValid() &&
      e.isValid() &&
      (d.isAfter(s) || d.isSame(s, 'day')) &&
      (d.isBefore(e) || d.isSame(e, 'day'))
    );
  });
}

export async function fetchScheduleByIds(ids = [], params = {}) {
  const items = await loadAll();
  let base = items.filter(it => ids.includes(it.id));

  const keyword = (params.q || '').trim();
  if (keyword) {
    const idset = await searchIdSet(keyword);
    if (idset.size === 0) return [];
    base = base.filter(it => idset.has(it.id));
    params = { ...params, q: '' };
  }

  return applyFilters(base, params);
}

// -------- 필터 로직 --------
function applyFilters(list, params) {
  const {
    q = '',
    status = 'all',
    region = [],
    industry = [],
    target = [],
    org = [],
    type = [],
    state = [],
    year,
    month,
  } = params || {};

  const qLower = q.trim().toLowerCase();

  return list.filter(it => {
    if (status && status !== 'all' && it.status !== status) return false;

    if (qLower) {
      const hay = `${it.title ?? ''} ${it.org ?? ''}`.toLowerCase();
      if (!hay.includes(qLower)) return false;
    }

    if (!includesAny(it.region, region)) return false;
    if (!includesAny(it.industry, industry)) return false;
    if (!includesAny(it.target, target)) return false;
    if (!includesAny(it.orgArr, org)) return false;
    if (!includesAny(it.type, type)) return false;
    if (!includesAny([it.status], state)) return false;

    // 월-기간 겹침 기준
    if (year || month) {
      const ym = dayjs(
        `${year ?? dayjs().year()}-${String(month ?? 1).padStart(2, '0')}-01`
      );
      const monthStart = ym.startOf('month');
      const monthEnd = ym.endOf('month');
      const start = dayjs(it.period?.start);
      const end = dayjs(it.period?.end).endOf('day');
      if (!start.isValid() || !end.isValid()) return false;
      if (end.isBefore(monthStart) || start.isAfter(monthEnd)) return false;
    }

    return true;
  });
}

function includesAny(itemVal, filt) {
  if (!filt || filt.length === 0) return true;
  const arr = Array.isArray(itemVal) ? itemVal : itemVal ? [itemVal] : [];
  return arr.some(v => filt.includes(v));
}
