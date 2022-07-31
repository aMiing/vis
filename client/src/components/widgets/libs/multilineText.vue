<template>
  <div class="multilineText" :style="{ ...data, ...computedStyle }">
    <span class="content">{{ data.text }}</span>
  </div>
</template>

<script>
export default {
  name: "MultilineText",
  props: ["data"],
  computed: {
    computedStyle() {
      const data = this.data;
      return {
        lineHeight:
          data.lineHeight +
          (typeof data.lineHeight === "number" ? data.lineHeightUnit || "px" : ""),
        textIndent: data.indent + (typeof data.indent === "number" ? data.indentUnit || "em" : ""),
      };
    },
  },
};
</script>

<style scoped lang="scss">
// .multilineText-wrapper {
//   position: absolute;
//   width: 100%;
//   text-align: center;
//   height: 100%;
// }
</style>
