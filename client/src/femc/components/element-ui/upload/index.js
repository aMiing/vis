import GUpload from './index.vue';

GUpload.install = function (Vue) {
  Vue.component(GUpload.name, GUpload);
};

export { GUpload };
