import Vue from 'vue';
import VueRouter from 'vue-router';
import routerList from '@/router/common.js';
import store from '@/store/index.js';
import { authService } from '@/service';
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: routerList,
});

// router.beforeEach(async (to, from, next) => {
//   if (~to.path.indexOf('login')) {
//     // 清空登录信息？
//     return next();
//   }
//   Vue.$auth.login(to, next);
// });



export default router;
