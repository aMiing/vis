import GFormBox from './src/form-box.vue';
import './style/index.scss';

GFormBox.install = function (Vue) {
  Vue.component(GFormBox.name, GFormBox);
};

export { GFormBox };
