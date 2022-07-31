import Vue from "vue";
import App from "./App";
import VCharts from "v-charts";
import store from "@/store/index.js";
import VueRouter from "vue-router";
import routerList from "@/router/preview.js";
import localforage from "localforage";
import "./plugins";
import "@/femc/themes/index";
import GLOBAL from './global.config.js';
Vue.prototype.GLOBAL = GLOBAL;

GLOBAL.useLocal && localforage.config({ name: "vis-board" });
Vue.use(VCharts);
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: routerList,
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
