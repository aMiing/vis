<template>
  <textarea
    :id="getFieldID(schema)"
    v-model="value"
    v-attributes="'input'"
    class="form-control"
    :class="schema.fieldClasses"
    :disabled="disabled"
    :maxlength="schema.max"
    :minlength="schema.min"
    :placeholder="schema.placeholder"
    :readonly="schema.readonly"
    :required="schema.required"
    :rows="schema.rows || 2"
    :name="schema.inputName"
  />
</template>

<script>
import abstractField from '../abstractField';

export default {
  mixins: [abstractField],
};
</script>

<style lang="scss"></style>
