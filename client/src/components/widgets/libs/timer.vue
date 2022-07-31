<template>
  <div class="timer" :style="data">
    <i class="el-icon-time">&nbsp;</i>
    <span class="timeText">{{ time }}</span>
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  props: ["data"],
  data() {
    return {
      time: "",
      timer: null,
    };
  },
  computed: {
    refresh() {
      const minUnit = this.data.timeFormatter.slice(-2);
      const refreshMap = {
        ss: 1000,
        mm: 60 * 1000,
        dd: 60 * 60 * 1000,
      };
      return refreshMap[minUnit] || 1000;
    },
  },
  mounted() {
    this.time = dayjs(new Date()).format(this.data.timeFormatter);
    this.timer = setInterval(() => {
      this.time = dayjs(new Date()).format(this.data.timeFormatter);
    }, this.refresh);
  },
  unmounted() {
    this.timer = null;
  },
};
</script>

<style scoped lang="scss">
.timer {
  position: absolute;
  width: 100%;
  display: table;
  text-align: center;
  height: 100%;
}
</style>
