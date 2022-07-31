<template>
  <vue-form-generator
    ref="vueFormGenerator"
    class="g-form"
    :schema="newSchema"
    :model="model"
    :options="options"
    :label-width="labelWidth"
    :rules="validators"
    @validated="handleValidated"
    @model-updated="handleModelUpdated"
  />
</template>

<script>
import VueFormGenerator from './vue-form-generator/src/formGenerator';
import validatorsConfig from './vue-form-generator/src/utils/validators.js';
import './vue-form-generator/assets/vfg.css';
import { cloneDeep } from 'lodash';
import { validateCn, customValidate } from './validateCn';
export default {
  name: 'GForm',
  components: {
    'vue-form-generator': VueFormGenerator,
  },
  props: {
    schema: {
      type: Object,
      default: () => ({
        fields: [],
      }),
    },
    model: {
      type: Object,
      default: () => ({}),
    },
    options: {
      type: Object,
      default: () => ({
        disabled: false,
        validateAfterLoad: true,
        validateAfterChanged: true,
      }),
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
    labelWidth: {
      type: [String],
      default: '90px',
    },
  },
  data() {
    return {
      newSchema: {},
      validators: {},
    };
  },
  watch: {
    'schema.fields': {
      deep: true,
      immediate: true,
      handler: function (/*fields*/) {
        this.newSchema = this.fieldsHandle(cloneDeep(this.schema));
      },
    },
  },
  created() {
    // 常用校验正则方法注册
    this.meregeValidator(Object.assign({}, validatorsConfig, customValidate, this.rules));

    // 确保自定义校验注册完毕
    setTimeout(() => {
      this.newSchema = this.fieldsHandle(cloneDeep(this.schema));
    }, 0);
  },
  methods: {
    meregeValidator(validators) {
      for (let key in validators) {
        this.validators[key] = validators[key];
      }
    },
    handleValidated(flag, errors, vm) {
      this.$emit('validated', flag, errors, vm);
    },
    disabledFieldHandle(disabled, field) {
      // 若设置为 true，则表单内组件上的 disabled 属性不再生效
      if (disabled && disabled instanceof Function ? disabled() : disabled) {
        // 缓存 TODO disabled切换后重置
        // field.__disabled = field.disabled
        field.disabled = true;
        if (field.append) {
          field.append.disabled = true;
        }
      }
    },
    handleModelUpdated(newVal, schema) {
      this.$emit('model-updated', newVal, schema);
    },
    async validate() {
      // 统一同步以及异步的检验输出方式
      let result;
      const res = this.$refs.vueFormGenerator.validate();
      const handler = validate => {
        if (Array.isArray(validate) && validate.length) {
          result = false;
          return;
        }
        result = validate;
      };
      if (res instanceof Promise) await res.then(handler);
      else handler(res);
      return result;
    },
    formatterValidateHandle(validator) {
      if (
        JSON.stringify(this.validators) !== '{}' &&
        !Object.assign({}, customValidate, this.rules)[validator] &&
        !(validator instanceof Function) &&
        validateCn
      ) {
        validator = (this.validators[validator] || {}).locale(validateCn);
      }
      return validator;
    },
    formatterValidate(field) {
      // 翻译vue-form-generator默认报错信息
      if (!field.validator || field.validator instanceof Function) return;
      else if (Array.isArray(field.validator)) {
        field.validator.forEach((validate, index) => {
          field.validator[index] = this.formatterValidateHandle(validate);
        });
      } else {
        field.validator = this.formatterValidateHandle(field.validator);
      }
    },
    fieldsHandle(schema) {
      const _groups = [].concat(schema.groups || []);
      const _fields = [].concat(schema.fields || []);
      try {
        _fields.forEach(field => {
          this.formatterValidate(field);
          this.disabledFieldHandle(this.options.disabled, field);
        });
        _groups.forEach(group =>
          group.fields.forEach(field => {
            this.formatterValidate(field);
            this.disabledFieldHandle(this.options.disabled, field);
          })
        );
      } catch (err) {
        console.log(err);
      }
      if (_groups.length) {
        _groups[_groups.length] = { legend: '', fields: [] };
      }
      return { fields: _fields, groups: _groups };
    },
  },
};
</script>
