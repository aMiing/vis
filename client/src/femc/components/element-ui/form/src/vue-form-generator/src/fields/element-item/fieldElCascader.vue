<template>
  <div class="ele-cascader__wrap">
    <el-cascader
      v-bind="selectOptions"
      :id="getFieldID(schema)"
      ref="cascader"
      :key="schema.key"
      v-model="value"
      :options="options"
      :props="props"
      :placeholder="schema.placeholder"
      :show-all-levels="showAllLevels"
      :filterable="selectOptions.filterable"
      :collapse-tags="selectOptions.collapseTags"
      :clearable="selectOptions.clearable"
      :disabled="disabled"
      @remove-tag="handleRemoveTag"
      @change="handleChange"
      @blur="selectOptions.blur || (() => {})"
      @focus="selectOptions.focus || (() => {})"
      @visible-change="selectOptions.visibleChange || (() => {})"
      @expand-change="selectOptions.expandChange || (() => {})"
    />
  </div>
</template>
<script>
import abstractField from '../abstractField';
import CascaderMixin from './cascader-mixin';
export default {
  mixins: [abstractField, CascaderMixin],
  methods: {
    getOptions(values) {
      if (typeof values == 'function') {
        return this.handlerTreeData(values.apply(this, [this.model, this.schema]));
      } else {
        return this.handlerTreeData(values);
      }
    },
    handleRemoveTag(node) {
      this.removeNode = node;
    },
  },
};
</script>
