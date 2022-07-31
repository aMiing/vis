<template>
  <div class="ele-submit-btn__wrap">
    <el-button
      :id="getFieldID(schema)"
      :name="schema.inputName"
      :disabled="disabled"
      :class="schema.fieldClasses"
      :style="schema.styles"
      @click="handleClick"
    >
      {{ schema.buttonText }}
    </el-button>
  </div>
</template>

<script>
import abstractField from '../abstractField';
import { get as objGet, isFunction, isEmpty } from 'lodash';

export default {
  mixins: [abstractField],
  methods: {
    handleClick($event) {
      if (this.schema.validateBeforeSubmit === true) {
        // prevent a <form /> from having it's submit event triggered
        // when we have to validate data first
        $event.preventDefault();
        let validateAsync = false;
        try {
          validateAsync = objGet(this.formOptions, 'validateAsync', false);
        } catch (err) {
          validateAsync = true;
        }
        const errors = this.vfg.validate();
        const handleErrors = errors => {
          if ((validateAsync && !isEmpty(errors)) || (!validateAsync && !errors)) {
            if (isFunction(this.schema.onValidationError)) {
              this.schema.onValidationError(this.model, this.schema, errors, $event);
            }
          } else if (isFunction(this.schema.onSubmit)) {
            this.schema.onSubmit(this.model, this.schema, $event);
          }
        };
        if (errors && isFunction(errors.then)) {
          errors.then(handleErrors);
        } else {
          handleErrors(errors);
        }
      } else if (isFunction(this.schema.onSubmit)) {
        // if we aren't validating, just pass the onSubmit handler the $event
        // so it can be handled there
        this.schema.onSubmit(this.model, this.schema, $event);
      }
    },
  },
};
</script>
