import axios from 'axios';
import { getAccessToken, refresh } from './auth';

class HttpClient {
  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
      withCredentials: true, // refreshToken 쿠키 주고받기
      timeout: 15000,
    });

    this.isRefreshing = false;
    this.pendingQueue = [];

    this.setupInterceptors();
  }

  runQueue(error, token) {
    this.pendingQueue.forEach(({ resolve, reject }) => {
      if (error) reject(error);
      else resolve(token);
    });
    this.pendingQueue = [];
  }

  setupInterceptors() {
    // 요청 인터셉터: 토큰 자동 첨부
    this.api.interceptors.request.use(config => {
      const at = getAccessToken();
      if (at && !config.headers?.Authorization) {
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${at}`,
        };
      }
      return config;
    });

    // 응답 인터셉터: 401 에러 시 토큰 갱신 및 재시도
    this.api.interceptors.response.use(
      res => res,
      async error => {
        const { config, response } = error || {};
        const original = config || {};
        const status = response?.status;

        // 로그인 요청, 토큰 갱신 요청은 토큰 재발급 로직 제외
        const isAuthPath =
          original?.url?.includes('/auth/login') ||
          original?.url?.includes('/auth/refresh');

        if (status === 401 && !isAuthPath && !original._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.pendingQueue.push({
                resolve: token => {
                  original.headers = {
                    ...(original.headers || {}),
                    Authorization: `Bearer ${token}`,
                  };
                  original._retry = true;
                  resolve(this.api(original));
                },
                reject,
              });
            });
          }

          original._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await refresh();
            this.runQueue(null, newToken);
            original.headers = {
              ...(original.headers || {}),
              Authorization: `Bearer ${newToken}`,
            };
            return this.api(original);
          } catch (e) {
            this.runQueue(e, null);
            // 토큰 재발급 실패 → 로컬 토큰 제거 및 로그인 페이지로 리다이렉트
            localStorage.removeItem('access_token');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            throw e;
          } finally {
            this.isRefreshing = false;
          }
        }

        throw error;
      }
    );
  }
}

// 싱글톤 인스턴스 생성 및 export
const httpClient = new HttpClient();
export default httpClient.api;
