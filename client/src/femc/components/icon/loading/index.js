import GIconButtonLoading from './src/button.vue';

import './src/style.scss';

GIconButtonLoading.install = function (Vue) {
  Vue.component(GIconButtonLoading.name, GIconButtonLoading);
};

export { GIconButtonLoading };
