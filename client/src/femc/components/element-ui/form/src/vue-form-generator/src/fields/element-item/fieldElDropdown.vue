<template>
  <div class="group-dropdown_wrap">
    <span class="group-dropdown_input">
      <el-input
        v-model="value"
        :type="schema.inputType || 'text'"
        :maxlength="schema.max"
        :disabled="disabled"
        :show-word-limit="!!schema.max"
      />
    </span>
    <el-dropdown
      trigger="click"
      @command="
        params => {
          value = params;
        }
      "
    >
      <i class="el-icon-arrow-down el-icon--right" />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="item in options"
          :key="getItemProp(item, 'value')"
          :command="getItemProp(item, 'value')"
        >
          {{ getItemProp(item, 'label') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
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
};
</script>
<style lang="scss" scoped>
.group-dropdown_wrap {
  width: 100%;
  .group-dropdown_input {
    ::v-deep .el-input {
      width: calc(100% - 20px);
    }
  }
}
</style>
