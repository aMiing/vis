import GTree from './src/tree.vue';

GTree.install = function (Vue) {
  Vue.component(GTree.name, GTree);
};

export { GTree };
