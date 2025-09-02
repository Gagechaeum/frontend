// 목업 JSON 로딩 + 클라이언트 필터/검색 + 데이터 정규화
import dayjs from 'dayjs';

let _cache = null;

const toArr = v => (Array.isArray(v) ? v : v ? [v] : []);

function normalizePolicy(p) {
  return {
    ...p,
    // 모두 배열 형태로 맞춤 (Copilot 지적 반영)
    region: toArr(p.region),
    industry: toArr(p.industry),
    target: toArr(p.target),
    type: toArr(p.type),
    tags: toArr(p.tags),
    orgArr: toArr(p.org), // org도 배열로 보조 필드 추가
  };
}

async function loadAll() {
  if (_cache) return _cache;
  const res = await fetch('/mock/policies.json');
  const json = await res.json();
  _cache = (json.items || []).map(normalizePolicy);
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
    state = [],
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

    if (!includesAny(it.region, region)) return false;
    if (!includesAny(it.industry, industry)) return false;
    if (!includesAny(it.target, target)) return false;
    if (!includesAny(it.orgArr, org)) return false; // ✅ org을 배열로 비교
    if (!includesAny(it.type, type)) return false;
    if (!includesAny([it.status], state)) return false;

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
