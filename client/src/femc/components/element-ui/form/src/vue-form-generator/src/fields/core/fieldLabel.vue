<template>
  <span :id="getFieldID(schema)" v-attributes="'label'" :class="schema.fieldClasses">
    {{ value }}
  </span>
</template>

<script>
import abstractField from '../abstractField';

export default {
  mixins: [abstractField],
};
</script>

<style lang="scss">
.vue-form-generator {
  .field-label .field-wrap {
    line-height: var(--height-base);
  }
}
</style>
