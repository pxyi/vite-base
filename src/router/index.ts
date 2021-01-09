import { createRouter, createWebHashHistory, RouteRecordRaw, RouterView } from 'vue-router';
import Transition from './transition.vue';


import { defineAsyncComponent, h } from 'vue';

const AsyncComponent = (loader) => defineAsyncComponent({
  loader,
  errorComponent: () => h('div', { id: 'timeout' }, '网络环境异常，请刷新页面重试！！！'),
  loadingComponent: () => h('div', { id: 'loading' }, h('i', { class: 'el-icon-loading' })),
  timeout: 5000,
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
        component: RouterView,
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
            path: 'course',
            name: 'course',
            meta: { title: '课程管理' },
            component: AsyncComponent(() => import('/@/views/course/index.vue'))
          },
          {
            path: 'recording',
            name: 'recording',
            meta: { title: '批量录题' },
            component: AsyncComponent(() => import('/@/views/recording/index.vue'))
          },
          {
            path: 'database',
            name: 'database',
            meta: { title: '资料库' },
            component: AsyncComponent(() => import('/@/views/database/index.vue'))
          }
        ]
      },
      {
        path: 'daily',
        name: 'daily',
        component: RouterView,
        meta: { title: '日常教学' },
        children: [
          {
            path: 'prepare-teach',
            name: 'prepare-teach',
            meta: { title: '班级备授课' },
            component: AsyncComponent(() => import('/@/views/prepare-teach/index.vue'))
          },
          {
            path: 'prepare-check',
            name: 'prepare-check',
            meta: { title: '备授课审核' },
            component: AsyncComponent(() => import('/@/views/check/index.vue'))
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
