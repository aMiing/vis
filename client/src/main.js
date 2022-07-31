import Vue from 'vue';
import App from './App';
import VCharts from 'v-charts';
import store from '@/store/index.js';

import router from '@/router/index.js';
import localforage from 'localforage';
import VueClipboard from 'vue-clipboard2';
import GLOBAL from './global.config.js';

import './plugins';
import '@/femc/themes/index';

Vue.prototype.$GLOBAL = GLOBAL;

Vue.use(VueClipboard);
GLOBAL.useLocal && localforage.config({ name: 'vis-board' });
Vue.use(VCharts);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
