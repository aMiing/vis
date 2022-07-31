import GOperationGroup from './operations.vue';

GOperationGroup.install = Vue => {
  Vue.component(GOperationGroup.name, GOperationGroup);
};

export { GOperationGroup };
