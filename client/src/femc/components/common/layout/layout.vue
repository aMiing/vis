<template>
  <div class="g-layout">
    <div v-if="$slots.header" class="g-layout__header">
      <slot name="header" />
    </div>
    <div class="g-layout__main" :style="{ 'padding-right': $slots.sider ? '4px' : 0 }">
      <div v-if="$slots.sider" class="g-layout__sider">
        <slot name="sider" />
      </div>
      <div
        :id="contentId"
        class="g-layout__content"
        :style="{
          padding: $slots.sider ? '16px 4px 16px 16px' : 0,
          'overflow-y': $slots.sider ? 'scroll' : 'auto',
        }"
        v-on="events"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GLayout',
  props: { contentId: { type: String, default: '' } },
  data() {
    return { events: {} };
  },
  created() {
    Object.keys(this.$listeners).forEach(key => {
      const matcher = key.match(/content-(.*)/);
      if (matcher && matcher[1]) this.$set(this.events, matcher[1], this.$listeners[key]);
    });
  },
};
</script>
<style lang="scss" scoped>
.g-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;

  &__header {
    height: 56px;
    flex-shrink: 0;
    background: linear-gradient(-234deg, #35416a, #6576a3);
  }

  &__main {
    display: flex;
    flex-direction: row;
    flex: 1;
    overflow: hidden;
  }

  &__sider {
    overflow: hidden;
    height: 100%;
  }

  &__content {
    flex: 1;
    overflow-x: hidden;
    position: relative;
  }
}
</style>
