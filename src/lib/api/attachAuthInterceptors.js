// File: src/lib/api/attachAuthInterceptors.js
import api from '@/lib/api/http';
import { getAccessToken, refresh } from './auth';

let isRefreshing = false;
let pendingQueue = [];

const runQueue = (error, token) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

// 요청 인터셉터: AT 자동 첨부
api.interceptors.request.use(config => {
  const at = getAccessToken();
  if (at && !config.headers?.Authorization) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${at}`,
    };
  }
  return config;
});

// 응답 인터셉터: 401 → refresh → 원요청 재시도
api.interceptors.response.use(
  res => res,
  async error => {
    const { config, response } = error || {};
    const original = config || {};
    const status = response?.status;

    const isAuthPath =
      original?.url?.includes('/auth/login') ||
      original?.url?.includes('/auth/refresh');

    if (status === 401 && !isAuthPath && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: token => {
              original.headers = {
                ...(original.headers || {}),
                Authorization: `Bearer ${token}`,
              };
              original._retry = true;
              resolve(api(original));
            },
            reject,
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refresh();
        runQueue(null, newToken);
        original.headers = {
          ...(original.headers || {}),
          Authorization: `Bearer ${newToken}`,
        };
        return api(original);
      } catch (e) {
        runQueue(e, null);
        // 토큰 재발급 실패 → 로컬 토큰 제거
        localStorage.removeItem('access_token');
        throw e;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);
