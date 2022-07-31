import GTransfer from './src/main.vue';

/* istanbul ignore next */
GTransfer.install = function (Vue) {
  Vue.component(GTransfer.name, GTransfer);
};

export { GTransfer };
