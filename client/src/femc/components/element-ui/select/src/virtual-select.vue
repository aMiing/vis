<template>
  <el-select
    ref="select"
    class="g-select"
    :popper-class="popperClass"
    :filterable="filterable"
    :remote="filterable"
    :remote-method="handleFilter"
    v-bind="$attrs"
    v-on="$listeners"
    @visible-change="handleVisibleChange"
  >
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>
    <RecycleScroller
      v-if="filterData.length"
      ref="scrollbox"
      class="virtual__wrapper"
      :class="{ 'el-select-group': group }"
      :key-field="mergedOptions.value"
      :item-size="itemHeight"
      :items="filterData"
    >
      <template #default="{ item }">
        <li v-if="item._isTitle" class="el-select-group__title">
          {{ item[mergedOptions.label] }}
        </li>
        <slot v-else-if="$scopedSlots.default" :item="item" />
        <el-option v-else :key="item[mergedOptions.value]" v-bind="getOptionConfig(item)" />
      </template>
    </RecycleScroller>
  </el-select>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import ElSelect from './select.vue';

export default {
  name: 'GSelect',
  components: { RecycleScroller, ElSelect },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    options: Object,
    itemHeight: {
      type: Number,
      default: 32,
    },
    filterable: Boolean,
    group: Boolean,
  },
  data() {
    return { filterData: [] };
  },
  computed: {
    popperClass() {
      const popperClass = this.$attrs['popper-class'] || this.$attrs.popperClass;
      // 合并传过来的popoverClass
      return popperClass ? `g-select__popper ${popperClass}` : 'g-select__popper';
    },
    mergedOptions() {
      return {
        label: 'label',
        value: 'value',
        options: 'options',
        disabled: 'disabled',
        ...this.options,
      };
    },
    linearData() {
      if (!this.group) return this.data || [];
      const { label, options, value } = this.mergedOptions;
      const result = [];
      this.data.forEach(group => {
        result.push({ _isTitle: true, [value]: Math.random(), [label]: group[label] });
        group[options].forEach(item => {
          result.push(item);
        });
      });

      return result;
    },
  },
  watch: {
    linearData: {
      immediate: true,
      handler(data) {
        this.filterData = data;
      },
    },
  },
  methods: {
    focus() {
      this.$refs.select && this.$refs.select.focus();
    },
    blur() {
      this.$refs.select && this.$refs.select.blur();
    },
    getOptionConfig(item) {
      const label = item[this.mergedOptions.label];
      const value = item[this.mergedOptions.value];
      const disabled = item[this.mergedOptions.disabled];

      return { label, value, disabled };
    },
    handleVisibleChange(visible) {
      this.setIconClass(visible);
      this.filterData = this.linearData;
      if (visible) {
        const index = this.linearData.findIndex(
          item => item[this.mergedOptions.value] === this.$attrs.value
        );

        if (index > -1 && this.$refs.scrollbox && this.$refs.scrollbox.$el) {
          this.$nextTick(() => {
            this.$refs.scrollbox.$el.scrollTo({ top: index * this.itemHeight });
          });
        }
      }
    },
    handleFilter(value) {
      const labelKey = this.mergedOptions.label;
      this.filterData = [];
      this.$nextTick(() => {
        this.filterData = this.linearData.filter(item => (item[labelKey] + '').includes(value));
      });
    },
    setIconClass(visible) {
      if (!this.filterable) return;
      const handle = visible ? 'add' : 'remove';
      this.$refs.select.$el
        .querySelector('.el-select__caret.el-input__icon.el-icon-')
        .classList[handle]('is-reverse');
    },
  },
};
</script>

<style lang="scss">
.g-select {
  &__popper {
    .el-scrollbar__bar {
      display: none;
    }

    .virtual__wrapper {
      max-height: 247px;
    }
  }

  .el-select__caret.el-input__icon.el-icon-::before {
    content: '\e6e1';
  }
}
</style>
