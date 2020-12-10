import { createRouter, createWebHashHistory, RouteRecordRaw, RouterView } from 'vue-router';

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
        path: '/test',
        name: 'test',
        component: RouterView,
        meta: { title: '测试' },
        children: [
          {
            path: 'test',
            name: 'test',
            meta: { title: '测试' },
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
  // {
  //   path: '/:pathMatch(.*)*',
  //   redirect: '/error'
  // }
]
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router;