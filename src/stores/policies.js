// 목업 JSON 로딩 + 클라이언트 필터/검색
import dayjs from 'dayjs';

let _cache = null; // 최초 한 번만 로딩

async function loadAll() {
  if (_cache) return _cache;
  const res = await fetch('/mock/policies.json');
  const json = await res.json();
  _cache = json.items || [];
  return _cache;
}

export async function fetchPolicies(params = {}) {
  const items = await loadAll();
  return applyFilters(items, params);
}

export async function fetchPoliciesByDay(date, params = {}) {
  const items = await loadAll();
  const base = applyFilters(items, params);
  if (!date) return [];
  return base.filter(it => {
    if (Array.isArray(it.datePoints) && it.datePoints.includes(date))
      return true;
    const s = it.period?.start,
      e = it.period?.end;
    if (s && e) {
      const d = dayjs(date);
      return (
        d.isAfter(dayjs(s).subtract(1, 'day')) &&
        d.isBefore(dayjs(e).add(1, 'day'))
      );
    }
    return false;
  });
}

export async function fetchPoliciesByIds(ids = [], params = {}) {
  const items = await loadAll();
  const base = items.filter(it => ids.includes(it.id));
  return applyFilters(base, params);
}

// ---------- helpers ----------
function applyFilters(list, params) {
  const {
    q = '',
    status = 'all',
    region = [],
    industry = [],
    target = [],
    org = [],
    type = [],
    state = [], // state는 status와 중복될 수 있음
    year,
    month,
  } = params || {};

  const qLower = q.trim().toLowerCase();

  return list.filter(it => {
    if (status && status !== 'all' && it.status !== status) return false;

    if (qLower) {
      const hay = `${it.title} ${it.org}`.toLowerCase();
      if (!hay.includes(qLower)) return false;
    }

    // 배열형 기준 일치(하나라도 포함되면 통과)
    if (!includesAny(it.region, region)) return false;
    if (!includesAny(it.industry, industry)) return false;
    if (!includesAny(it.target, target)) return false;
    if (!includesAny([it.org], org)) return false; // org는 문자열 → 배열로 비교
    if (!includesAny(it.type, type)) return false;
    if (!includesAny([it.status], state)) return false; // state가 status별칭이면 여기서도 허용

    // 연/월 필터(옵션)
    if (year || month) {
      const s = it.period?.start;
      if (!s) return false;
      const d = dayjs(s);
      if (year && d.year() !== Number(year)) return false;
      if (month && d.month() + 1 !== Number(month)) return false;
    }

    return true;
  });
}

function includesAny(itemVal, filt) {
  if (!filt || filt.length === 0) return true;
  const arr = Array.isArray(itemVal) ? itemVal : itemVal ? [itemVal] : [];
  return arr.some(v => filt.includes(v));
}
