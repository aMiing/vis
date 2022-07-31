<template>
  <div :class="{'login__input-field--dark' : formStyle === 'dark',
       'login__input-field--light' : formStyle === 'light',
       'login__input-field--white' : formStyle === 'white'}"
       class="login__input-field">
    <icon-svg :icon-name="icon" class="login__input-icon" v-if="icon"></icon-svg>
    <input :placeholder="placeholder"
           :type="type"
           :value="value"
           @input="updateValue"
           class="login__input"/>
    <slot></slot>
  </div>
</template>
<script>
import IconSvg from '@/components/icon-svg'
export default {
  name: 'LoginInput',
  components: { IconSvg },
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    formStyle: {
      type: String,
      default: ''
    }
  },

  model: {
    prop: 'value',
    event: 'change'
  },

  methods: {
    updateValue (e) {
      this.$emit('change', e.target.value)
    }
  }
}
</script>
