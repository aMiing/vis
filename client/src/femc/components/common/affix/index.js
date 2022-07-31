import GAffix from './src/affix.vue';
import './style/index.scss';

GAffix.install = function (Vue) {
  Vue.component(GAffix.name, GAffix);
};

export { GAffix };
