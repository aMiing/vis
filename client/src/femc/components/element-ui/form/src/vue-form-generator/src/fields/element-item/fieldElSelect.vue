<template>
  <div class="ele-select__wrap">
    <el-select
      :id="getFieldID(schema)"
      v-model="value"
      v-bind="selectOptions"
      :multiple="selectOptions.multiple"
      :multiple-limit="selectOptions.multipleLimit"
      :value-key="selectOptions.valueKey"
      :filterable="selectOptions.filterable"
      :clearable="selectOptions.clearable"
      :placeholder="schema.placeholder"
      :disabled="disabled"
      :allow-create="selectOptions.allowCreate"
      :default-first-option="selectOptions.defaultFirstOption"
      @change="handleUpdateSelected"
      @remove-tag="selectOptions.removeTag || (() => {})"
      @visible-change="selectOptions.visibleChange || (() => {})"
      @blur="selectOptions.blur || (() => {})"
      @focus="selectOptions.focus || (() => {})"
      @clear="selectOptions.clear || (() => {})"
    >
      <template v-if="selectOptions.isGroup">
        <el-option-group
          v-for="group in options"
          :key="group[selectOptions.label]"
          :label="group[selectOptions.label]"
        >
          <template v-for="(item, index) in group.options">
            <el-option
              v-if="!item.hidden"
              :key="selectOptions.value ? item[selectOptions.value] : index"
              :label="selectOptions.label ? item[selectOptions.label] : item"
              :value="selectOptions.value ? item[selectOptions.value] : item"
              :disabled="item.disabled"
            >
              <span>{{ selectOptions.label ? item[selectOptions.label] : item }}</span>
              <span v-if="selectOptions.expand">
                {{ '(' + item[selectOptions.expand] + ')' }}
              </span>
            </el-option>
          </template>
        </el-option-group>
      </template>
      <template v-else>
        <template v-for="(item, index) in options">
          <el-option
            v-if="!item.hidden"
            :key="selectOptions.value ? item[selectOptions.value] : index"
            :label="selectOptions.label ? item[selectOptions.label] : item"
            :value="selectOptions.value ? item[selectOptions.value] : item"
            :disabled="item.disabled"
          >
            <span>{{ selectOptions.label ? item[selectOptions.label] : item }}</span>
            <span v-if="selectOptions.expand">
              {{ '(' + item[selectOptions.expand] + ')' }}
            </span>
          </el-option>
        </template>
      </template>
    </el-select>
  </div>
</template>
<script>
import abstractField from '../abstractField';
export default {
  mixins: [abstractField],
  computed: {
    options() {
      const values = this.schema.values;
      if (typeof values == 'function') {
        return values.apply(this, [this.model, this.schema]);
      } else {
        return values;
      }
    },
    selectOptions() {
      return this.schema.selectOptions || {};
    },
  },
  methods: {
    handleUpdateSelected(/* value, id*/) {
      // this.value = value;
    },
  },
};
</script>
<style lang="scss">
.ele-select__wrap {
  .el-select {
    width: 100% !important;
  }
}
</style>
