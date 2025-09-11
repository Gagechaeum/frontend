// src/lib/api/http.js
import axios from 'axios';
import { getAccessToken, refresh } from './auth';

const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, ''); // 끝 슬래시 제거
class HttpClient {
  constructor() {
    this.api = axios.create({
      baseURL: `${base}/api`,       // 여기서만 /api 붙입니다
      withCredentials: true,        // refreshToken 쿠키 사용
      timeout: 15000,
    });

    this.isRefreshing = false;
    this.pendingQueue = [];         // 대기중 요청을 재시도하기 위한 큐

    this.setupInterceptors();
  }

  runQueue(error, token) {
    this.pendingQueue.forEach(({ resolve, reject, orig }) => {
      if (error) reject(error);
      else {
        orig.headers = { ...(orig.headers || {}), Authorization: `Bearer ${token}` };
        resolve(this.api(orig));
      }
    });
    this.pendingQueue = [];
  }

  setupInterceptors() {
    // 요청 인터셉터: AT 부착
    this.api.interceptors.request.use((config) => {
      const at = getAccessToken?.();
      if (at && !config.headers?.Authorization) {
        config.headers = { ...(config.headers || {}), Authorization: `Bearer ${at}` };
      }
      return config;
    });

    // 응답 인터셉터: 401 → refresh → 원요청 재시도
    this.api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const { config, response } = error || {};
        const original = config || {};
        const status = response?.status;

        const isAuthPath =
          original?.url?.includes('/auth/login') ||
          original?.url?.includes('/auth/refresh');

        if (status === 401 && !isAuthPath && !original._retry) {
          if (this.isRefreshing) {
            // refresh 중이면 큐잉
            return new Promise((resolve, reject) => {
              this.pendingQueue.push({ resolve, reject, orig: original });
            });
          }

          original._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await refresh();     // ⬅️ 아래 auth.js 구현 필수
            this.runQueue(null, newToken);
            original.headers = {
              ...(original.headers || {}),
              Authorization: `Bearer ${newToken}`,
            };
            return this.api(original);
          } catch (e) {
            this.runQueue(e, null);
            localStorage.removeItem('access_token'); // AT 제거
            throw e;
          } finally {
            this.isRefreshing = false;
          }
        }

        // 네트워크/CORS 등의 기타 에러는 그대로 던짐
        throw error;
      }
    );
  }
}

const httpClient = new HttpClient();
export default httpClient.api;
