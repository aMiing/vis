import GSteps from './src/steps.vue';
import GStep from './src/step.vue';
import './style/index.scss';

GSteps.install = function (Vue) {
  Vue.component(GSteps.name, GSteps);
};

GStep.install = function (Vue) {
  Vue.component(GStep.name, GStep);
};

export { GSteps, GStep };
