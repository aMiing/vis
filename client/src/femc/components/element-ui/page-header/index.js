import GPageHeader from './src/index.vue';

GPageHeader.install = function (Vue) {
  Vue.component(GPageHeader.name, GPageHeader);
};

export { GPageHeader };
