<template>
  <div class="el-transfer-panel">
    <p class="el-transfer-panel__header">
      <el-checkbox
        v-model="allChecked"
        :indeterminate="isIndeterminate"
        @change="handleAllCheckedChange"
      >
        {{ title }}
        <span>{{ checkedSummary }}</span>
      </el-checkbox>
    </p>

    <div :class="['el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']">
      <el-input
        v-if="filterable"
        v-model="query"
        class="el-transfer-panel__filter"
        size="small"
        :placeholder="placeholder"
        @mouseenter.native="inputHover = true"
        @mouseleave.native="inputHover = false"
      >
        <i
          slot="prefix"
          :class="['el-input__icon', 'el-icon-' + inputIcon]"
          @click="clearQuery"
        ></i>
      </el-input>
      <el-checkbox-group
        v-show="!hasNoMatch && data.length > 0"
        v-model="checked"
        :class="{ 'is-filterable': filterable, 'is-virtualized': needVirtualized }"
        class="el-transfer-panel__list"
      >
        <recycle-scroller
          v-if="needVirtualized"
          :items="filteredData"
          :item-size="itemHeight"
          :key-field="keyProp"
        >
          <template #default="{ item }">
            <el-checkbox
              :key="item[keyProp]"
              class="el-transfer-panel__item"
              :label="item[keyProp]"
              :disabled="item[disabledProp]"
            >
              <option-content :option="item" />
            </el-checkbox>
          </template>
        </recycle-scroller>
        <template v-else>
          <el-checkbox
            v-for="item in filteredData"
            :key="item[keyProp]"
            class="el-transfer-panel__item"
            :label="item[keyProp]"
            :disabled="item[disabledProp]"
          >
            <option-content :option="item"></option-content>
          </el-checkbox>
        </template>
      </el-checkbox-group>
      <p v-show="hasNoMatch" class="el-transfer-panel__empty">{{ t('el.transfer.noMatch') }}</p>
      <p v-show="data.length === 0 && !hasNoMatch" class="el-transfer-panel__empty">
        {{ t('el.transfer.noData') }}
      </p>
    </div>
    <p v-if="hasFooter" class="el-transfer-panel__footer">
      <slot></slot>
    </p>
  </div>
</template>

<script>
import Locale from 'element-ui/lib/mixins/locale';
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

export default {
  name: 'ElTransferPanel',

  components: {
    RecycleScroller,
    OptionContent: {
      props: {
        option: Object,
      },
      render(h) {
        const getParent = vm => {
          if (vm.$options.componentName === 'ElTransferPanel') {
            return vm;
          } else if (vm.$parent) {
            return getParent(vm.$parent);
          } else {
            return vm;
          }
        };
        const panel = getParent(this);
        const transfer = panel.$parent || panel;
        return panel.renderContent ? (
          panel.renderContent(h, this.option)
        ) : transfer.$scopedSlots.default ? (
          transfer.$scopedSlots.default({ option: this.option })
        ) : (
          <span>{this.option[panel.labelProp] || this.option[panel.keyProp]}</span>
        );
      },
    },
  },
  mixins: [Locale],

  componentName: 'ElTransferPanel',

  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    renderContent: Function,
    placeholder: String,
    title: String,
    filterable: Boolean,
    format: Object,
    filterMethod: Function,
    defaultChecked: Array,
    props: Object,
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
      checked: [],
      allChecked: false,
      query: '',
      inputHover: false,
      checkChangeByUser: true,
    };
  },

  computed: {
    filteredData() {
      return this.data.filter(item => {
        if (typeof this.filterMethod === 'function') {
          return this.filterMethod(this.query, item);
        } else {
          const label = item[this.labelProp] || item[this.keyProp].toString();
          return label.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        }
      });
    },

    checkableData() {
      return this.filteredData.filter(item => !item[this.disabledProp]);
    },

    checkedSummary() {
      const checkedLength = this.checked.length;
      const dataLength = this.data.length;
      const { noChecked, hasChecked } = this.format;
      if (noChecked && hasChecked) {
        return checkedLength > 0
          ? hasChecked.replace(/\${checked}/g, checkedLength).replace(/\${total}/g, dataLength)
          : noChecked.replace(/\${total}/g, dataLength);
      } else {
        return `${checkedLength}/${dataLength}`;
      }
    },

    isIndeterminate() {
      const checkedLength = this.checked.length;
      return checkedLength > 0 && checkedLength < this.checkableData.length;
    },

    hasNoMatch() {
      return this.query.length > 0 && this.filteredData.length === 0;
    },

    inputIcon() {
      return this.query.length > 0 && this.inputHover ? 'circle-close' : 'search';
    },

    labelProp() {
      return this.props.label || 'label';
    },

    keyProp() {
      return this.props.key || 'key';
    },

    disabledProp() {
      return this.props.disabled || 'disabled';
    },

    hasFooter() {
      return !!this.$slots.default;
    },

    // 判断是否需要开启虚拟滚动
    needVirtualized() {
      return this.filteredData.length > this.virtualScrollLimit;
    },
  },

  watch: {
    checked(val, oldVal) {
      this.updateAllChecked();
      if (this.checkChangeByUser) {
        const movedKeys = val
          .concat(oldVal)
          .filter(v => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1);
        this.$emit('checked-change', val, movedKeys);
      } else {
        this.$emit('checked-change', val);
        this.checkChangeByUser = true;
      }
    },

    data() {
      // 优化时间复杂度为O(N)
      const checked = [];
      const filteredDataKeyMap = {};
      this.filteredData.forEach(item => {
        filteredDataKeyMap[item[this.keyProp]] = true;
      });

      this.checked.forEach(item => {
        if (filteredDataKeyMap[item]) checked.push(item);
      });
      this.checkChangeByUser = false;
      this.checked = checked;
    },

    checkableData() {
      this.updateAllChecked();
    },

    defaultChecked: {
      immediate: true,
      handler(val, oldVal) {
        if (oldVal && val.length === oldVal.length && val.every(item => oldVal.indexOf(item) > -1))
          return;
        const checked = [];
        const checkableDataKeys = this.checkableData.map(item => item[this.keyProp]);
        val.forEach(item => {
          if (checkableDataKeys.indexOf(item) > -1) {
            checked.push(item);
          }
        });
        this.checkChangeByUser = false;
        this.checked = checked;
      },
    },
  },

  methods: {
    updateAllChecked() {
      // 优化时间复杂度为O(N)
      const { checked, checkableData, keyProp } = this;
      const checkedMap = {};
      checked.forEach(item => {
        checkedMap[item] = { value: item };
      });
      this.allChecked =
        checkableData.length > 0 && checkableData.every(item => checkedMap[item[keyProp]]);
    },

    handleAllCheckedChange(value) {
      this.checked = value ? this.checkableData.map(item => item[this.keyProp]) : [];
    },

    clearQuery() {
      if (this.inputIcon === 'circle-close') {
        this.query = '';
      }
    },
  },
};
</script>
