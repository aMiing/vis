<template>
  <div class="ele-select__wrap field-ele-input-mixed">
    <el-input
      :id="getFieldID(schema)"
      :key="schema.field"
      :value="inputValue"
      v-bind="schema"
      :type="schema.inputType || 'text'"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="schema.maxlength"
      :max="schema.max"
      :show-word-limit="!!schema.max"
      @input="handleUpdateInput"
      @blur="schema.blur || (() => {})"
      @focus="schema.focus || (() => {})"
      @change="schema.change || (() => {})"
      @clear="schema.clear || (() => {})"
    >
      <template v-if="mixed" :slot="mixed.position || 'prepend'">
        <el-link
          v-if="mixed.type === 'button'"
          :underline="false"
          type="primary"
          :disabled="mixedBtnDisabled"
          :icon="mixed.icon"
          @click="mixed.click && mixed.click(model)"
          v-html="mixed.label"
        />
        <el-select
          v-else-if="mixed.type === 'select'"
          :value="selectValue"
          :multiple="selectOptions.multiple"
          :multiple-limit="selectOptions.multipleLimit"
          :value-key="selectOptions.valueKey"
          :filterable="selectOptions.filterable"
          :clearable="selectOptions.clearable"
          :placeholder="mixed.placeholder"
          :disabled="disabled"
          :allow-create="selectOptions.allowCreate"
          @change="handleUpdateSelected"
          @remove-tag="handleRemoveTag"
          @visible-change="handleVisibleChange"
        >
          <el-option
            v-for="item in options"
            :key="getItemProp(item, 'value')"
            :label="getItemProp(item, 'label')"
            :value="getItemProp(item, 'value')"
            :disabled="item.disabled && item.disabled(item)"
          />
        </el-select>
      </template>
    </el-input>
  </div>
</template>
<script>
import abstractField from '../abstractField';
export default {
  mixins: [abstractField],
  data() {
    return {};
  },
  computed: {
    mixed() {
      return this.schema.mixed || {};
    },
    mixedBtnDisabled() {
      const field = this.mixed;
      if (field.disabled instanceof Function)
        return field.disabled.call(this, this.model, field, this);

      if (!field.disabled) return false;

      return field.disabled;
    },
    options() {
      if (this.mixed.type === 'select') {
        const values = this.mixed.values;
        if (typeof values == 'function') {
          return values.apply(this, [this.model, this.schema]);
        } else {
          return values;
        }
      } else {
        return [];
      }
    },
    selectOptions() {
      if (this.mixed.type === 'select') {
        return this.mixed.selectOptions || {};
      } else {
        return {};
      }
    },
    inputValue: {
      get() {
        if (this.mixed.type === 'select' && this.mixed.get instanceof Function) {
          return this.mixed.get(this.model, 'input', this.value);
        } else {
          return this.value;
        }
      },
      set(value) {
        if (this.mixed.type === 'select' && this.mixed.set instanceof Function) {
          this.value = this.mixed.set(this.model, value, this.selectValue);
        } else {
          this.value = value;
        }
      },
    },
    selectValue: {
      get() {
        if (this.mixed.get instanceof Function) {
          return this.mixed.get(this.model, 'mixed', this.value);
        } else {
          return this.value;
        }
      },
      set(value) {
        if (this.mixed.set instanceof Function) {
          this.value = this.mixed.set(this.model, this.inputValue, value);
        } else {
          this.value = value;
        }
      },
    },
  },
  methods: {
    getItemProp(item, prop) {
      return this.selectOptions[prop] && this.selectOptions[prop] !== null
        ? item[this.selectOptions[prop]]
        : item;
    },
    handleUpdateInput(value) {
      this.inputValue = value;
    },
    handleUpdateSelected(value /* , id*/) {
      this.selectValue = value;
    },
    handleRemoveTag(/* removedOption, id */) {
      // console.log("onRemove", removedOption, id);
    },
    handleVisibleChange(/*flag*/) {},
  },
};
</script>
<style lang="scss" scoped>
.field-ele-input-mixed {
  ::v-deep .el-input-group__append,
  ::v-deep .el-input-group__prepend {
    .el-select .el-input {
      width: 200px !important;
    }
  }
}
</style>
