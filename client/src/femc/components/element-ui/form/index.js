import GForm from './src/index.vue';
import './theme/index.scss';

GForm.install = function (Vue) {
  Vue.component(GForm.name, GForm);
};

export { GForm };
