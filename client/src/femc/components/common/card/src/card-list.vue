<template>
  <ul class="g-card-list" :style="listStyle">
    <slot name="prepend" />
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'GCardList',
  props: {
    minWidth: {
      type: [String, Number],
      default: 256,
    },
  },
  computed: {
    listStyle() {
      return {
        'grid-template-columns': `repeat(auto-fill, minmax(${parseInt(this.minWidth)}px, 1fr))`,
      };
    },
  },
};
</script>
