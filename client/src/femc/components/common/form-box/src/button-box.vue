<template>
  <div class="g-form-box__footer" :class="buttonsClass" :style="{ marginLeft: offset + 'px' }">
    <div class="g-form-box__footer-btns">
      <slot name="buttons" />
      <span v-if="hasTip" class="g-form-box__tip">
        <info />
        <slot v-if="$slots.tip" name="tip" />
        <template v-else>{{ tip }}</template>
      </span>
    </div>
  </div>
</template>

<script>
import Info from './info';

export default {
  name: 'GButtonBox',
  components: {
    Info,
  },
  props: {
    placement: String,
    tip: String,
    offset: {
      type: [Number, String],
      default: 0,
    },
  },
  computed: {
    buttonsClass() {
      return this.placement === 'left' ? 'g-form-box--left' : '';
    },
    hasTip() {
      return this.$slots.tip || this.tip;
    },
  },
};
</script>
