<template>
  <div class="widget" :style="data">
    <div class="border"></div>
  </div>
</template>

<script>
export default {
  name: "Border",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style slot-scope lang="scss"></style>
