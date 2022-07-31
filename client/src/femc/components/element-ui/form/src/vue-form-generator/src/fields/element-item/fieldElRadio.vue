<template>
  <div class="radio-group__wrap">
    <el-radio-group
      :id="getFieldID(schema)"
      v-model="value"
      :disabled="disabled"
      @change="handleUpdateSelected"
    >
      <template v-for="item in options">
        <el-radio
          v-if="!item.hidden"
          v-bind="selectOptions"
          :key="getItemProp(item, 'value')"
          :border="!!selectOptions.border"
          :label="getItemProp(item, 'value')"
          :disabled="item.disabled"
        >
          {{ getItemProp(item, 'label') }}
        </el-radio>
      </template>
    </el-radio-group>
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
.vue-form-generator .field-el-radio {
  .field-wrap {
    line-height: var(--height-base);
  }
}
</style>
