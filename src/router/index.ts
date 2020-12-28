import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Transition from './transition.vue';


import { defineAsyncComponent, h } from 'vue';
import TimeoutComponent from './../views/timeout.vue';

const AsyncComponent = (loader) => defineAsyncComponent({
  loader,
  errorComponent: () => h('div', { id: 'timeout' }, '页面请求超时，请刷新页面重试！！！'),
  loadingComponent: () => h('div', { id: 'loading' }, h('i', { class: 'el-icon-loading' })),
  timeout: 3000,
})

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
        component: AsyncComponent(() => import('/@/views/index/index.vue'))
      },
      {
        path: 'teaching',
        name: 'teaching',
        component: Transition,
        meta: { title: '教研中台' },
        children: [
          {
            path: 'test-paper',
            name: 'test-paper',
            meta: { title: '试卷库' },
            component: () => import('/@/views/test-paper/index.vue')
          },
          {
            path: 'question',
            name: 'question',
            meta: { title: '题库' },
            component: AsyncComponent(() => import('/@/views/question/index.vue'))
          },
          {
            path: 'test-paper',
            name: 'test-paper',
            meta: { title: '试卷库' },
            component: () => import('/@/views/test-paper/index.vue')
          },
          {
            path: 'resource-base',
            name: 'resource-base',
            meta: { title: '资料库' },
            component: () => import('/@/views/resource-base/index.vue')
          },
          {
            path: 'recording',
            name: 'recording',
            meta: { title: '批量录题' },
            component: AsyncComponent(() => import('/@/views/recording/index.vue'))
          }
        ]
      },
      {
        path: 'daily',
        name: 'daily',
        component: Transition,
        meta: { title: '日常教学' },
        children: [
          {
            path: 'prepare-teach',
            name: 'prepare-teach',
            meta: { title: '班级备授课' },
            component: AsyncComponent(() => import('/@/views/prepare-teach/index.vue'))
          },
        ]
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: AsyncComponent(() => import('/@/views/login.vue'))
  },
  {
    path: '/error',
    name: 'error',
    component: AsyncComponent(() => import('/@/views/error.vue'))
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