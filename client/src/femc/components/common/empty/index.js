import GEmpty from './src/empty.vue';
import './style/index.scss';

GEmpty.install = function (Vue) {
  Vue.component(GEmpty.name, GEmpty);
};

export { GEmpty };
