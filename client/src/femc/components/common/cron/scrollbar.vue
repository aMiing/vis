<template>
  <div class="g-scrollbar" @scroll="handleScroll">
    <div :class="['g-scrollbar__content', wrapClass]">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    wrapClass: {
      type: String,
      default: () => '',
    },
  },
  methods: {
    handleScroll(e) {
      if (this.$listeners.scroll) this.$emit('scroll', e);
    },
  },
};
</script>

<style lang="scss" scoped>
.g-scrollbar {
  overflow-x: hidden;
  overflow-y: auto;
  visibility: hidden;

  &:hover,
  &:focus,
  &__content {
    visibility: visible;
  }
}
</style>
