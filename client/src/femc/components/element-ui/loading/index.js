import directive from './src/directive';
import service from './src/index';
import GLoading from './src/loading.vue';

GLoading.install = function (Vue) {
  Vue.use(directive);
  Vue.prototype.$loading = service;
};

GLoading.directive = directive;
GLoading.service = service;

export { GLoading };
