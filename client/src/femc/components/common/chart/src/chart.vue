<template>
  <div v-if="!emptyString" key="gChart" ref="gChart" class="g-chart" />
  <div v-else key="gChartEmpty" class="g-chart-empty">
    {{ emptyString }}
  </div>
</template>

<script>
import { init, registerTheme } from 'echarts';
import darkTheme from './themes/dark.json';
import lightTheme from './themes/light.json';
import resize from './resizeMixin';

registerTheme('g-chart-dark', darkTheme);
registerTheme('g-chart-light', lightTheme);

export default {
  name: 'GChart',
  mixins: [resize],
  inject: {
    injectTheme: {
      type: Function,
      default: () => 'dark',
    },
  },
  model: {
    prop: 'chartInstance',
    event: 'changeChartInstance',
  },
  props: {
    options: [Object, Function],
    emptyString: String,
    chartInstance: Object,
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    theme() {
      return typeof this.injectTheme === 'function' ? this.injectTheme() : this.injectTheme;
    },
  },
  watch: {
    options: {
      handler(val) {
        if (!this.chart) {
          this.initChart();
        }
        this.renderChart(val);
      },
      deep: true,
    },
    theme() {
      this.clearChart();
      this.initChart();
      this.renderChart(this.options);
    },
    chart: {
      handler(val) {
        this.$emit('changeChartInstance', val);
      },
      immediate: true,
    },
    emptyString(val) {
      if (val) {
        this.chart = null;
      }
    },
  },
  mounted() {
    this.initChart();
    this.renderChart(this.options);
  },
  beforeDestroy() {
    this.clearChart();
  },
  methods: {
    initChart() {
      const dom = this.$refs.gChart;
      if (dom) this.chart = init(dom, `g-chart-${this.theme}`, { devicePixelRatio: 2 });
    },
    renderChart(options) {
      if (!this.chart) {
        return;
      }
      const _options = typeof options === 'function' ? options() : options;
      this.chart.setOption(_options || {}, true);
    },
    clearChart() {
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.g-chart-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--grey-10);
}
</style>
