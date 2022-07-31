<template>
  <div class="form-group" :class="getFieldRowClasses(field)">
    <label
      v-if="fieldTypeHasLabel(field)"
      :for="getFieldID(field)"
      :class="field.labelClasses"
      :style="{
        width: labelWidth,
      }"
    >
      <span v-html="field.label"></span>
      <el-popover v-if="field.help" ref="popover" trigger="hover">
        <div v-html="field.help"></div>

        <span slot="reference" class="help">
          <i class="icon"></i>
          <!-- <div class="helpText" v-html='field.help'></div> -->
        </span>
      </el-popover>
      <span>:</span>
    </label>

    <div class="field-wrap_box">
      <div class="field-wrap">
        <component
          :is="getFieldType(field)"
          ref="child"
          :vfg="vfg"
          :disabled="fieldDisabled(field)"
          :readonly="fieldReadonly(field)"
          :model="model"
          :schema="field"
          :rules="rules"
          :form-options="options"
          @model-updated="onModelUpdated"
          @validated="onFieldValidated"
        ></component>
        <div v-if="buttonVisibility(field)" class="buttons">
          <button
            v-for="(btn, index) in field.buttons"
            :key="index"
            :class="btn.classes"
            :type="getButtonType(btn)"
            @click="buttonClickHandler(btn, field, $event)"
            v-text="btn.label"
          ></button>
        </div>
      </div>

      <div v-if="field.hint" class="hint" v-html="fieldHint(field)"></div>

      <div v-if="fieldErrors(field).length > 0" class="errors help-block">
        <span v-for="(error, index) in fieldErrors(field)" :key="index" v-html="error"></span>
      </div>
    </div>
  </div>
</template>
<script>
import { get as objGet, isNil, isFunction } from 'lodash';
import { slugifyFormID } from './utils/schema';
import formMixin from './formMixin.js';
import fieldComponents from './utils/fieldsLoader.js';

export default {
  name: 'FormGroup',
  components: { ...fieldComponents },
  mixins: [formMixin],
  props: {
    vfg: {
      type: Object,
      required: true,
    },
    model: { type: Object, required: true },
    options: {
      type: Object,
      default: () => ({}),
    },
    field: {
      type: Object,
      required: true,
    },
    errors: {
      type: Array,
      default() {
        return [];
      },
    },
    labelWidth: {
      type: String,
      default: 'auto',
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    // Should field type have a label?
    fieldTypeHasLabel(field) {
      if (isNil(field.label)) return false;

      let relevantType = '';
      if (field.type === 'input') {
        relevantType = field.inputType;
      } else {
        relevantType = field.type;
      }

      switch (relevantType) {
        case 'button':
        case 'submit':
        case 'reset':
          return false;
        default:
          return true;
      }
    },
    getFieldID(schema) {
      const idPrefix = objGet(this.options, 'fieldIdPrefix', '');
      return slugifyFormID(schema, idPrefix);
    },
    // Get type of field 'field-xxx'. It'll be the name of HTML element
    getFieldType(fieldSchema) {
      return 'field-' + fieldSchema.type;
    },
    // Get type of button, default to 'button'
    getButtonType(btn) {
      return objGet(btn, 'type', 'button');
    },
    // Child field executed validation
    onFieldValidated(res, errors, field) {
      this.$emit('validated', res, errors, field);
    },
    buttonVisibility(field) {
      return field.buttons && field.buttons.length > 0;
    },
    buttonClickHandler(btn, field, event) {
      return btn.onclick.call(this, this.model, field, event, this);
    },
    // Get current hint.
    fieldHint(field) {
      if (isFunction(field.hint)) return field.hint.call(this, this.model, field, this);

      return field.hint;
    },
    fieldErrors(field) {
      return this.errors.filter(e => e.field === field).map(item => item.error);
    },
    onModelUpdated(newVal, schema) {
      this.$emit('model-updated', newVal, schema);
    },
    validate(calledParent) {
      return this.$refs.child.validate(calledParent);
    },
    clearValidationErrors() {
      if (this.$refs.child) {
        return this.$refs.child.clearValidationErrors();
      }
    },
  },
};
</script>
<style lang="scss"></style>
