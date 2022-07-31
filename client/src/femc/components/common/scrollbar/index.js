import GScrollbar from './scrollbar.vue';

GScrollbar.install = function (Vue) {
  Vue.component(GScrollbar.name, GScrollbar);
};

export { GScrollbar };
