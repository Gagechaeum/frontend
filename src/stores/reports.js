import { defineStore } from 'pinia';
import { getDashboard, getItems, saveUserPolicy } from '@/lib/api/reports';
import { useNotificationStore } from '@/stores/notification';

export const useReportStore = defineStore('report', {
  state: () => ({
    summary: null,
    schedule: [],
    cashFlow: [],
    items: [], // Will hold ALL items
    loading: false,
    error: null,
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

        await this.fetchAllItems(); // Fetch all items again
        await this.fetchDashboard();
        notificationStore.show('success', '성공적으로 등록되었습니다.');
      } catch (e) {
        this.error = e;
        notificationStore.show('error', '등록 중 오류가 발생했습니다.');
      } finally {
        this.loading = false;
      }
    },

    async fetchAllItems() {
      this.loading = true;
      this.error = null;
      this.items = [];
      let page = 0;
      let totalPages = 1; // Start with 1 to enter the loop

      try {
        while (page < totalPages) {
          const pageData = await getItems({ page: page, size: 100 });
          if (pageData.content) {
            const processedItems = pageData.content.map(item => {
              const [start, end] = item.period.split(' ~ ');
              return {
                ...item,
                startDate: start ? start.replace(/\./g, '-') : null,
                endDate: end ? end.replace(/\./g, '-') : null,
              };
            });
            this.items.push(...processedItems);
          }
          totalPages = pageData.totalPages;
          page++;
        }
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },

    resetItems() {
      this.items = [];
    },
  },
});
