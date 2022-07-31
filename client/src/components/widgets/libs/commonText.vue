<template>
  <div class="widget" :style="data">
    <div class="text" :style="{ textAlign: data.textAlign || 'center' }">
      {{ data.text }}
    </div>
  </div>
</template>

<script>
export default {
  name: "CommonText",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  mounted: function () {},
  methods: {},
};
</script>

<style scoped lang="scss">
.widget {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>
