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
        await this.fetchDashboard(); // Refresh dashboard after saving
        this.resetItems();
        await this.fetchItems();
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
        const { items, hasNext } = await getItems({
          page: this.page,
          size: this.size,
        });
        console.log('[Store] Fetched items from API:', items);
        this.items = this.page === 0 ? items : [...this.items, ...items];
        console.log('[Store] Current items state:', this.items);
        this.hasNext = hasNext;
        if (hasNext) {
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
