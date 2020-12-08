import { createRouter, createWebHistory, RouteRecordRaw, RouterView } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/index',
    component: () => import('/@/layout/base.vue'),
    children: [
      {
        path: 'index',
        name: 'index',
        meta: { title: '首页' },
        component: () => import('/@/views/index.vue')
      },
      {
        path: '/education',
        name: 'education',
        component: RouterView,
        meta: { title: '教学基础管理' },
        children: [
          {
            path: 'year',
            name: 'year',
            meta: { title: '年份管理' },
            component: () => import('/@/views/test.vue'),
          }
        ]
      },
    ]
  },
  // {
  //   path: '/:pathMatch(.*)*',
  //   redirect: '/error'
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router;