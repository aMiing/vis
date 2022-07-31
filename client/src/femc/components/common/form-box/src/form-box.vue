<template>
  <div ref="formBox" class="g-form-box">
    <div v-if="hasHeader" class="g-form-box__header">
      <slot v-if="$slots.header" name="header" />
      <template v-else>{{ title }}</template>
      <span v-if="hasExtra" class="g-form-box__header-extra">
        <slot name="extra" />
      </span>
    </div>
    <div class="g-form-box__content">
      <slot />
    </div>
    <template v-if="$slots.buttons">
      <g-affix v-if="sticky" ref="affix" :target="target" position="bottom" :z-index="zIndex">
        <GButtonBox :placement="buttonPlacement" :offset="offset" :tip="tip">
          <template v-if="$slots.buttons" slot="buttons">
            <slot name="buttons" />
          </template>
          <template v-if="$slots.tip" slot="tip">
            <slot name="tip" />
          </template>
        </GButtonBox>
      </g-affix>
      <GButtonBox v-else :placement="buttonPlacement" :offset="offset" :tip="tip">
        <template v-if="$slots.buttons" slot="buttons">
          <slot name="buttons" />
        </template>
        <template v-if="$slots.tip" slot="tip">
          <slot name="tip" />
        </template>
      </GButtonBox>
    </template>
  </div>
</template>

<script>
import GAffix from '../../affix/src/affix.vue';
import GButtonBox from './button-box.vue';

export default {
  name: 'GFormBox',
  components: {
    GAffix,
    GButtonBox,
  },
  props: {
    title: String,
    extra: String,
    tip: String,
    buttonPlacement: String,
    offset: {
      type: [Number, String],
      default: 0,
    },
    target: [Object, String],
    sticky: {
      type: Boolean,
      default: false,
    },
    zIndex: {
      type: [Number, String],
      default: 100,
    },
  },
  computed: {
    hasHeader() {
      return this.$slots.header || this.title;
    },
    hasExtra() {
      return this.$slots.extra;
    },
    hasFooter() {
      return this.$slots.footer;
    },
  },
};
</script>
