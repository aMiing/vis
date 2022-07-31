import Login from '@/views/login/index.vue';
import NotFound from '@/views/404.vue';
import Preview from '@/views/preview/index.vue';
import Home from '@/views/Home.vue';
import Index from '@/views/index.vue';
import { menuList } from './menu.js';
const indexRouter = [
  {
    path: '/',
    name: 'root',
    component: Index,
    redirect: { name: 'home.list' },
    children: [
      {
        path: 'home',
        name: 'home',
        component: Home,
        redirect: { name: 'home.list' },
        children: menuList,
      },
      {
        path: '/edit',
        name: 'edit',
        component: () => import(/* webpackChunkName: "edit"  */ '@/views/edit/index.vue'),
        meta: {
          title: '编辑',
        },
      },
    ],
  },
  {
    path: '/login',
    component: Login,
    name: 'login',
  },
];
const getRouteList = [
  ...indexRouter,
  {
    path: '/preview',
    name: 'preview',
    component: Preview,
    meta: {
      title: '预览',
    },
  },
  {
    path: '/page/:publishId',
    name: 'page',
    component: Preview,
  },
  {
    path: '/404',
    component: NotFound,
    name: '404',
  },
];
export default getRouteList;
