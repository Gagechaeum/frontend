import { createRouter, createWebHistory } from 'vue-router';
import { h } from 'vue';

import HomeView from '@/views/Home/HomeView.vue';
import LoanDetailView from '@/views/Detail/LoanDetailView.vue';
import PolicyDetailView from '@/views/Detail/PolicyDetailView.vue';
import MypageView from '@/views/Mypage/MyPageView.vue';
import TestView from '@/views/TestView.vue';
import Community from '@/views/Community/CommunityView.vue';
import Report from '@/views/Report/ReportView.vue';
import ScheduleLayout from '@/views/Schedule/ScheduleLayout.vue';
import AllSchedule from '@/views/Schedule/AllSchedule.vue';
import ListSchedule from '@/views/Schedule/ListSchedule.vue';
import FilterSchedule from '@/views/Schedule/FilterSchedule.vue';
import FavoritesSchedule from '@/views/Schedule/FavoritesSchedule.vue';
import DocsView from '@/views/Docs/DocsView.vue';

import LoginView from '@/views/Auth/LoginView.vue';
import SignupView from '@/views/Auth/SignupView.vue';

import { getAccessToken, refresh } from '@/lib/api/auth';

const Placeholder = title => ({
  name: `${title}Page`,
  render() {
    return h('div', { class: 'container py-8 text-neutral-700' }, [
      h('h1', { class: 'text-2xl font-bold mb-2' }, title),
    ]);
  },
});

const routes = [
  // 공개
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { showHeader: true, overlayHeader: true },
  },
  {
    path: '/product/loan/:id',
    name: 'loan-detail',
    component: LoanDetailView,
    meta: { showHeader: true },
  },
  {
    path: '/product/policy/:id',
    name: 'policy-detail',
    component: PolicyDetailView,
    meta: { showHeader: true },
  },

  // 보호
  {
    path: '/report',
    name: 'report',
    component: Report,
    meta: { showHeader: true, requiresAuth: true },
  },
  {
    path: '/schedule',
    component: ScheduleLayout,
    meta: { showHeader: true, requiresAuth: true },
    children: [
      { path: '', redirect: '/schedule/calendar' },
      { path: 'calendar', name: 'schedule-calendar', component: AllSchedule },
      { path: 'list', name: 'schedule-list', component: ListSchedule },
      { path: 'filter', name: 'schedule-filter', component: FilterSchedule },
      {
        path: 'favorites',
        name: 'schedule-favorites',
        component: FavoritesSchedule,
      },
    ],
  },
  {
    path: '/community',
    name: 'community',
    component: Community,
    meta: { showHeader: true, requiresAuth: true },
  },
  {
    path: '/docs',
    name: 'docs',
    component: DocsView,
    meta: { showHeader: true, requiresAuth: true },
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: Placeholder('온보딩'),
    meta: { showHeader: true, requiresAuth: true },
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: MypageView,
    meta: { showHeader: true, requiresAuth: true },
  },
  {
    path: '/test',
    name: 'test',
    component: TestView,
    meta: { showHeader: true, requiresAuth: true },
  },

  // 게스트 전용
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { showHeader: false, guestOnly: true },
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView,
    meta: { showHeader: false, guestOnly: true },
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: Placeholder('404 Not Found'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(r => r.meta?.requiresAuth);
  const guestOnly = to.matched.some(r => r.meta?.guestOnly);

  // 이미 로그인 페이지에 있다면 추가 검증하지 않음
  if (to.path === '/login') {
    return next();
  }

  let hasAT = !!getAccessToken();

  if (requiresAuth && !hasAT) {
    try {
      await refresh();
      hasAT = true;
    } catch (error) {
      console.log(
        '토큰 갱신 실패, 로그인 페이지로 이동:',
        error?.response?.status
      );
      return next({ path: '/login', query: { next: to.fullPath } });
    }
  }

  if (guestOnly && hasAT) {
    return next({ path: '/' });
  }

  return next();
});

export default router;
