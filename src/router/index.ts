import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Transition from './transition.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/index',
    component: () => import('/@/layout/base.vue'),
    beforeEnter: (to, from, next) => {
      localStorage.getItem('token') ? next() : next('/login');
    },
    children: [
      {
        path: 'index',
        name: 'index',
        meta: { title: '首页' },
        component: () => import('/@/views/index/index.vue')
      },
      {
        path: 'test',
        name: 'test',
        component: Transition,
        meta: { title: '测试' },
        children: [
          {
            path: 'test1',
            name: 'test1',
            meta: { title: '测试1' },
            component: () => import('/@/views/test.vue'),
          },
          {
            path: 'editor',
            name: 'editor',
            meta: { title: 'editor' },
            component: () => import('/@/views/editor.vue'),
          },
          {
            path: 'tree',
            name: 'tree',
            meta: { title: 'tree' },
            component: () => import('/@/views/tree.vue'),
          }
        ]
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('/@/views/login.vue')
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('/@/views/error.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/error'
  }
]
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router;