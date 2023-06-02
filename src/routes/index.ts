import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/upload',
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import('@/pages/upload/UploadPage.vue'),
    meta: {
      title: '图床上传',
    },
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('@/pages/gallery/GalleryPage.vue'),
    meta: {
      title: '画廊',
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/pages/settings/SettingsPage.vue'),
    meta: {
      title: '用户设置',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/about/AboutPage.vue'),
    meta: {
      title: '关于本项目',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
