import Vue from "vue";
import { authService, userService } from '@/service';
import store from '@/store/index.js';
class Auth {
  constructor() {
    this.passwordEncryptType = false; // 控制用户登陆加密方式
    this.logged = false;
    this.userInfoPromise = null;
  }

  async login(to, next) {
    try {
      const res = await authService.login();
      if (res?.result !== 0) return logout(true);
      next();
    } catch (e) {
      logout();
      next('/login');
    }
  }

  async logout(rememberUrl) {
    !~location.href.indexOf('login') &&
      store.dispatch('common/setLastUrl', rememberUrl ? location.href : '');
    try {
      // const res = await authService.logout();
      // return res;
      location.pathname = '/login';
    } catch (e) {
      throw new Error(e);
    }
  }

  getMyInfo(body) {
    this.userInfoPromise =
      this.userInfoPromise ||
      new Promise(async (resolve, reject) => {
        try {
          const { result } = await userService.getMyInfo(body);
          if (result === 0) {
            this.logged = true;
            store.dispatch('user/setUserInfo', res.data);
            resolve(res.data);
          } else {
            this.logged = false;
            store.dispatch('user/clearUserInfo');
            resolve({});
          }
        } catch (error) {
          this.logged = false;
          reject(err);
        }
      });
    return this.userInfoPromise;
  }

  isLogged() {
    return !!this.logged;
  }
}

Vue.auth = Vue.prototype.$auth = new Auth();
