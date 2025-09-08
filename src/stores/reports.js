import { defineStore } from 'pinia';
import {
  getDashboard,
  getMonthlySummary,
  getIncomeExpenseTrend,
} from '@/lib/api/reports';

export const useReportStore = defineStore('report', {
  state: () => ({
    summary: null,
    policy: [],
    loan: [],
    trend: [],
    loading: false,
    error: null,
    page: 0,
    size: 20,
    hasNext: true,
  }),
  actions: {
    async fetchDashboard(token, { page = 0, size = 20 } = {}) {
      this.loading = true;
      this.error = null;
      try {
        const data = await getDashboard({ page, size }, token);
        this.summary = data.summary ?? this.summary;
        this.policy = Array.isArray(data.policy) ? data.policy : this.policy;
        this.loan = Array.isArray(data.loan) ? data.loan : this.loan;
        this.page = page;
        this.size = size;
        if (typeof data.hasNext === 'boolean') this.hasNext = data.hasNext;
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    async fetchMonthlySummary(token, { month, userId } = {}) {
      this.loading = true;
      this.error = null;
      try {
        this.summary = await getMonthlySummary({ month, userId }, token);
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    async fetchTrend(token, { from, to, userId } = {}) {
      this.loading = true;
      this.error = null;
      try {
        this.trend = await getIncomeExpenseTrend({ from, to, userId }, token);
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    async fetchNextPage(token) {
      if (!this.hasNext) return;
      return this.fetchDashboard(token, {
        page: this.page + 1,
        size: this.size,
      });
    },
  },
});
