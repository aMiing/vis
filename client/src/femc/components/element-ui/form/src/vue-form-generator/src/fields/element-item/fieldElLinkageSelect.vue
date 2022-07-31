<template>
  <div class="ele-linkage-select__wrap">
    <el-select
      v-for="(_select, index) in linkageLevelList"
      :key="index"
      v-model="value[index]"
      :style="selectWidthStyle"
      :multiple="selectOptions.multiple"
      :multiple-limit="selectOptions.multipleLimit"
      :value-key="selectOptions.valueKey"
      :filterable="selectOptions.filterable"
      :clearable="selectOptions.clearable"
      :placeholder="schema.placeholder"
      :disabled="disabled"
      :allow-create="selectOptions.allowCreate"
      :default-first-option="selectOptions.defaultFirstOption"
      @change="handleUpdateSelected($event, index)"
      @remove-tag="handleRemoveTag"
      @visible-change="handleVisibleChange"
    >
      <template v-for="item in _select">
        <el-option
          v-if="!item.hidden"
          :key="getItemProp(item, 'value')"
          :label="getItemProp(item, 'label')"
          :value="getItemProp(item, 'value')"
          :disabled="item.disabled"
        >
          <span>{{ getItemProp(item, 'label') }}</span>
          <span v-if="selectOptions.expand">
            {{ '(' + item[selectOptions.expand] + ')' }}
          </span>
        </el-option>
      </template>
    </el-select>
  </div>
</template>
<script>
import abstractField from '../abstractField';
export default {
  mixins: [abstractField],
  data() {
    return {
      linkageLevelList: [],
    };
  },
  computed: {
    linkageLevel: {
      get() {
        const linkageLevel = this.selectOptions.linkageLevel;
        if (typeof linkageLevel == 'function') {
          return Number(linkageLevel.apply(this, [this.model, this.schema]));
        } else {
          return Number(linkageLevel);
        }
      },
    },
    selectWidthStyle() {
      const _width = this.linkageLevel ? Math.floor(100 / this.linkageLevel) - 2 : 100;
      return { width: _width + '%' };
    },

    selectOptions() {
      return this.schema.selectOptions || {};
    },
    linkageOptionsFun() {
      return this.selectOptions.linkageOptionsFun || (() => []);
    },
  },
  watch: {
    linkageLevel(value) {
      value && this.initLinkageLevelList(value);
    },
  },
  created() {
    this.initLinkageLevelList(this.linkageLevel);
  },
  methods: {
    async initLinkageLevelList(_linkageLevel) {
      // 清空多余value项
      if (!this.value) this.value = [];
      this.value.length = _linkageLevel;
      _linkageLevel = _linkageLevel >= 0 ? _linkageLevel : 0;
      const arr = new Array(_linkageLevel).fill('');
      this.linkageLevelList = await Promise.all(
        arr.map(async (item, index) => {
          // 默认填充第一层
          if (!index) return (await this.linkageOptionsFun(index)) || [];
          else if (this.value[index] || this.value[index - 1])
            // 已有值项以及下一项的 下拉选项填充
            return (await this.linkageOptionsFun(index + 1, this.value[index - 1])) || [];
          else return [];
        })
      );
    },
    async handleUpdateSelected(_value, index) {
      // 联动后续数组项
      this.linkageLevelList = await Promise.all(
        this.linkageLevelList.map(async (item, _index) => {
          if (_index >= index + 1) {
            this.value[_index] = '';
            if (_value && _index === index + 1) {
              return (await this.linkageOptionsFun(index + 1, _value)) || [];
            }
            return [];
          } else {
            return item;
          }
        })
      );
      // 清空多于value项
      this.value.length = this.linkageLevel;
    },
    handleRemoveTag(/* removedOption, id */) {
      // console.log("onRemove", removedOption, id);
    },
    handleVisibleChange(/* flag*/) {},

    // TODO validate
  },
};
</script>
<style lang="scss">
.ele-linkage-select__wrap {
  ::v-deep .el-select {
    margin-right: 2%;
  }
}
</style>
