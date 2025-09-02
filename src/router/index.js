import { createRouter, createWebHistory } from 'vue-router';
import { h } from 'vue';
import MypageView from '@/views/mypage/MyPageView.vue';
import Community from '@/views/Community/CommunityView.vue';

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
    component: Placeholder('홈'),
    meta: { showHeader: true },
  },
  {
    path: '/report',
    name: 'report',
    component: Placeholder('리포트'),
    meta: { showHeader: true },
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: Placeholder('일정'),
    meta: { showHeader: true },
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
    component: Placeholder('서류'),
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
