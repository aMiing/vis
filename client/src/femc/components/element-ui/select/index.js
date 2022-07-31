import GSelect from './src/virtual-select.vue';

GSelect.install = function (Vue) {
  Vue.component(GSelect.name, GSelect);
};

export { GSelect };
