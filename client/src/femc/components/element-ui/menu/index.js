import GMenu from './menu.vue';

GMenu.install = function (Vue) {
  Vue.component(GMenu.name, GMenu);
};

export { GMenu };
