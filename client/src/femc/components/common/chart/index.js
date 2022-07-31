import GChart from './src/chart.vue';

GChart.install = Vue => {
  Vue.component(GChart.name, GChart);
};

export { GChart };
