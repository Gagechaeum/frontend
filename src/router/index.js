import { createRouter, createWebHistory } from 'vue-router';
import { h } from 'vue';
import HomeView from '@/views/Home/HomeView.vue';
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

// 페이지 파일이 없어도 오류 안나게 하는 플레이스홀더
const Placeholder = title => ({
  name: `${title}Page`,
  render() {
    return h('div', { class: 'container py-8 text-neutral-700' }, [
      h('h1', { class: 'text-2xl font-bold mb-2' }, title),
    ]);
  },
});

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { showHeader: true },
  },
  {
    path: '/report',
    name: 'report',
    component: Report,
    meta: { showHeader: true },
  },
  {
    path: '/schedule',
    component: ScheduleLayout,
    meta: { showHeader: true },
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
    meta: { showHeader: true },
  },
  {
    path: '/docs',
    name: 'docs',
    component: DocsView,
    meta: { showHeader: true },
  },
  {
    path: '/login',
    name: 'login',
    component: Placeholder('로그인'),
    meta: { showHeader: false },
  },
  {
    path: '/signup',
    name: 'signup',
    component: Placeholder('회원가입'),
    meta: { showHeader: false },
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: Placeholder('온보딩'),
    meta: { showHeader: true },
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: MypageView,
    meta: { showHeader: true },
  },
  {
    path: '/test',
    name: 'test',
    component: TestView,
    meta: { showHeader: true },
  },
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

export default router;
