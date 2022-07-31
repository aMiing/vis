import GCascaderPanel from './src/cascader-panel.vue';
import GCascader from './src/cascader.vue';

GCascaderPanel.install = function (Vue) {
  Vue.component(GCascaderPanel.name, GCascaderPanel);
};

GCascader.install = function (Vue) {
  Vue.component(GCascader.name, GCascader);
};

export { GCascaderPanel, GCascader };
