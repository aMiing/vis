<template>
  <div class="date-picker__wrap">
    <el-date-picker
      v-model="value"
      :type="selectOptions.type"
      value-format="timestamp"
      v-bind="selectOptions"
      :disabled="disabled"
      :placeholder="selectOptions.placeholder"
      @blur="selectOptions.blur || (() => {})"
      @focus="selectOptions.focus || (() => {})"
    />
  </div>
</template>
<script>
import abstractField from '../abstractField';
export default {
  mixins: [abstractField],
  computed: {
    selectOptions() {
      return this.schema.selectOptions || {};
    },
  },
};
</script>
<style lang="scss">
.date-picker {
  .el-select {
    width: 100% !important;
  }
}
</style>
