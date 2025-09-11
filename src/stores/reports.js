import { defineStore } from 'pinia';
import { getDashboard, getItems, saveUserPolicy } from '@/lib/api/reports';
import { useNotificationStore } from '@/stores/notification';

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
    totalPages: 0,
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
      const notificationStore = useNotificationStore();
      this.loading = true;
      this.error = null;
      try {
        await saveUserPolicy(policy);

        // DB 업데이트를 기다리기 위한 1초 지연
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.resetItems();
        await this.fetchItems(0); // Fetch the first page
        await this.fetchDashboard();
        notificationStore.show('success', '성공적으로 등록되었습니다.');
      } catch (e) {
        this.error = e;
        notificationStore.show('error', '등록 중 오류가 발생했습니다.');
      } finally {
        this.loading = false;
      }
    },

    async fetchItems(page = 0) {
      this.loading = true;
      this.error = null;
      try {
        const pageData = await getItems({
          page: page,
          size: this.size,
        });

        this.items = pageData.content || [];
        this.page = pageData.page;
        this.totalPages = pageData.totalPages;
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    resetItems() {
      this.items = [];
      this.page = 0;
      this.totalPages = 0;
    },
  },
});
