<template>
  <div v-attributes="'wrapper'" class="wrapper">
    <input
      :id="getFieldID(schema)"
      v-attributes="'input'"
      class="form-control"
      type="file"
      :name="schema.inputName"
      :accept="schema.accept"
      :multiple="schema.multiple"
      :placeholder="schema.placeholder"
      :readonly="schema.readonly"
      :required="schema.required"
      :disabled="disabled"
      @change="onChange"
    />
  </div>
</template>

<script>
import abstractField from '../abstractField';
import { isFunction } from 'lodash';

export default {
  mixins: [abstractField],
  methods: {
    onChange($event) {
      if (isFunction(this.schema.onChanged)) {
        // Schema has defined onChange method.
        this.schema.onChanged.call(this, this.model, this.schema, $event, this);
      }
    },
  },
};
</script>

<style lang="scss">
.vue-form-generator .field-input {
  .wrapper {
    width: 100%;
  }
  .helper {
    margin: auto 0.5em;
  }
}
</style>
