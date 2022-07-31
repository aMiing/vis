export const menuList = [
  {
    path: "list",
    name: "home.list",
    component: () => import(/* webpackChunkName: "manage" */ "@/views/panel/index.vue"),
    meta: {
      label: "看板管理",
      iconCls: "iconfont icon-kanbanguanli",
    },
  },
  {
    path: "examples",
    name: "home.examples",
    component: () => import(/* webpackChunkName: "examples" */ "@/views/charts/echarts.vue"),

    meta: {
      label: "案例展示",
      iconCls: "iconfont icon-examples",
    },
  },
];
