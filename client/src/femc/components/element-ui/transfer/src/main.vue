<template>
  <div class="el-transfer">
    <transfer-panel
      v-bind="filterProps"
      ref="leftPanel"
      :data="sourceData"
      :title="titles[0] || t('el.transfer.titles.0')"
      :default-checked="leftDefaultChecked"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      @checked-change="onSourceCheckedChange"
    >
      <slot name="left-footer"></slot>
    </transfer-panel>
    <div class="el-transfer__buttons">
      <el-button
        type="primary"
        :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        :disabled="rightChecked.length === 0"
        @click.native="addToLeft"
      >
        <i class="el-icon-arrow-left"></i>
        <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
      </el-button>
      <el-button
        type="primary"
        :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
        :disabled="leftChecked.length === 0"
        @click.native="addToRight"
      >
        <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
        <i class="el-icon-arrow-right"></i>
      </el-button>
    </div>
    <transfer-panel
      v-bind="filterProps"
      ref="rightPanel"
      :data="targetData"
      :title="titles[1] || t('el.transfer.titles.1')"
      :default-checked="rightDefaultChecked"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      @checked-change="onTargetCheckedChange"
    >
      <slot name="right-footer"></slot>
    </transfer-panel>
  </div>
</template>

<script>
import Emitter from 'element-ui/lib/mixins/emitter';
import Locale from 'element-ui/lib/mixins/locale';
import TransferPanel from './transfer-panel.vue';
import Migrating from 'element-ui/lib/mixins/migrating';

export default {
  name: 'GTransfer',

  components: {
    TransferPanel,
  },

  mixins: [Emitter, Locale, Migrating],

  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    titles: {
      type: Array,
      default() {
        return [];
      },
    },
    buttonTexts: {
      type: Array,
      default() {
        return [];
      },
    },
    filterPlaceholder: {
      type: String,
      default: '',
    },
    filterMethod: Function,
    leftDefaultChecked: {
      type: Array,
      default() {
        return [];
      },
    },
    rightDefaultChecked: {
      type: Array,
      default() {
        return [];
      },
    },
    renderContent: Function,
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    format: {
      type: Object,
      default() {
        return {};
      },
    },
    filterable: Boolean,
    props: {
      type: Object,
      default() {
        return {
          label: 'label',
          key: 'key',
          disabled: 'disabled',
        };
      },
    },
    targetOrder: {
      type: String,
      default: 'original',
    },
    itemHeight: {
      type: Number,
      default: 26,
    },
    virtualScrollLimit: {
      type: Number,
      default: 500,
    },
  },

  data() {
    return {
      leftChecked: [],
      rightChecked: [],
    };
  },

  computed: {
    // 把value数组映射成map
    valueMap() {
      const valueMap = {};
      this.value.forEach(item => {
        valueMap[item] = true;
      });

      return valueMap;
    },
    dataObj() {
      const key = this.props.key;
      return this.data.reduce((o, cur) => (o[cur[key]] = cur) && o, {});
    },

    sourceData() {
      const { data, valueMap, props } = this;
      return data.filter(item => !valueMap[item[props.key]]);
    },

    targetData() {
      const { targetOrder, data, valueMap, props, value, dataObj } = this;
      if (targetOrder === 'original') {
        return data.filter(item => valueMap[item[props.key]]);
      } else {
        return value.reduce((arr, cur) => {
          const val = dataObj[cur];
          if (val) arr.push(val);

          return arr;
        }, []);
      }
    },

    hasButtonTexts() {
      return this.buttonTexts.length === 2;
    },

    filterProps() {
      // 过滤非必要props
      const {
        titles,
        buttonTexts,
        filterPlaceholder,
        leftDefaultChecked,
        rightDefaultChecked,
        value,
        targetOrder,
        ...rest
      } = this.$props;

      return { ...rest };
    },
  },

  watch: {
    value(val) {
      this.dispatch('ElFormItem', 'el.form.change', val);
    },
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          'footer-format': 'footer-format is renamed to format.',
        },
      };
    },

    onSourceCheckedChange(val, movedKeys) {
      this.leftChecked = val;
      if (movedKeys === undefined) return;
      this.$emit('left-check-change', val, movedKeys);
    },

    onTargetCheckedChange(val, movedKeys) {
      this.rightChecked = val;
      if (movedKeys === undefined) return;
      this.$emit('right-check-change', val, movedKeys);
    },

    addToLeft() {
      // 优化时间复杂度为O(N)
      const currentValueMap = {};
      this.value.forEach(item => {
        currentValueMap[item] = { value: item };
      });

      this.rightChecked.forEach(item => {
        if (currentValueMap[item]) delete currentValueMap[item];
      });

      const currentValue = [];
      for (const key in currentValueMap) {
        currentValue.push(currentValueMap[key].value);
      }

      this.$emit('input', currentValue);
      this.$emit('change', currentValue, 'left', this.rightChecked);
    },

    addToRight() {
      // 优化时间复杂度为O(N)
      const currentValueMap = {};
      const leftCheckedMap = {};
      this.value.forEach(item => {
        currentValueMap[item] = { value: item };
      });
      this.leftChecked.forEach(item => {
        leftCheckedMap[item] = { value: item };
      });

      const itemsToBeMoved = [];
      const key = this.props.key;
      this.data.forEach(item => {
        const itemKey = item[key];
        if (leftCheckedMap[itemKey] && !currentValueMap[itemKey]) itemsToBeMoved.push(itemKey);
      });
      let currentValue = [];
      for (const key in currentValueMap) {
        currentValue.push(currentValueMap[key].value);
      }

      currentValue =
        this.targetOrder === 'unshift'
          ? [...itemsToBeMoved, ...currentValue]
          : [...currentValue, ...itemsToBeMoved];

      this.$emit('input', currentValue);
      this.$emit('change', currentValue, 'right', this.leftChecked);
    },

    clearQuery(which) {
      if (which === 'left') {
        this.$refs.leftPanel.query = '';
      } else if (which === 'right') {
        this.$refs.rightPanel.query = '';
      }
    },
  },
};
</script>

<style lang="scss">
.el-transfer-panel__list.is-virtualized {
  overflow: hidden;

  > .vue-recycle-scroller {
    height: 100%;
  }
}
</style>
