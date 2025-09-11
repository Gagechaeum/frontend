import { defineStore } from 'pinia';
import { getDashboard, getItems, saveUserPolicy } from '@/lib/api/reports';

export const useReportStore = defineStore('report', {
  state: () => ({
    summary: null,
    schedule: [],
    cashFlow: [],
    items: [],
    loading: false,
    error: null,
    page: 0,
    size: 5,
    hasNext: true,
  }),
  actions: {
    async fetchDashboard() {
      this.loading = true;
      this.error = null;
      try {
        const data = await getDashboard();
        this.summary = data.summary;
        this.schedule = data.schedule;
        this.cashFlow = data.cashFlow;
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },

    async savePolicy(policy) {
      this.loading = true;
      this.error = null;
      try {
        await saveUserPolicy(policy);
        this.resetItems();
        await this.fetchItems();
        await this.fetchDashboard();
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },

    async fetchItems() {
      if (!this.hasNext || this.loading) return;
      this.loading = true;
      this.error = null;
      try {
        const pageData = await getItems({
          page: this.page,
          size: this.size,
        });

        const newItems = pageData.content || [];
        this.items = this.page === 0 ? newItems : [...this.items, ...newItems];
        this.hasNext = pageData.page < pageData.totalPages - 1;

        if (this.hasNext) {
          this.page += 1;
        }
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    resetItems() {
      this.items = [];
      this.page = 0;
      this.hasNext = true;
    },
  },
});
