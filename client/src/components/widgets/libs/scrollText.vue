<template>
  <div class="scrollText" :style="data">
    <marquee
      :width="data.width"
      :behavior="data.behavior"
      :direction="data.direction"
      :scrollamount="data.scrollamount"
    >
      {{ data.text }}
    </marquee>
  </div>
</template>

<script>
export default {
  props: ["data"],
};
</script>

<style scoped lang="scss">
.scrollText {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
