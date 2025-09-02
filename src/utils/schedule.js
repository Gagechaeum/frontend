// src/utils/schedule.js
export const STATUS = {
  active: { text: '접수중', color: '#0EA5E9' },
  due: { text: '마감임박', color: '#FFBC00' },
  upcoming: { text: '예정', color: '#004DA9' },
  closed: { text: '마감', color: '#4B5563' },
};

export const stateText = s => (STATUS[s] ?? STATUS.closed).text;
export const stateColor = s => (STATUS[s] ?? STATUS.closed).color;

export function fmtPeriod(period) {
  const s = period?.start?.slice(5)?.replace('-', '.');
  const e = period?.end?.slice(5)?.replace('-', '.');
  return s && e ? `${s} ~ ${e}` : '';
}
