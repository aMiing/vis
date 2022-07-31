import fullScreen from "@/utils/fullScreen.js";

export default {
  data() {
    return {
      fullInstance: null,
    };
  },
  async mounted() {
    this.fullInstance = new fullScreen(() => {
      console.log("不支持全屏");
    });
    window.addEventListener("keydown", this.onKeydown);
    // 利用hook，在监听的地方解绑监听
    this.$once("hook:beforeDestroy", () => window.removeEventListener("keydown", this.onKeydown));
  },
  methods: {
    fullScreen() {
      const main = this.$refs["screen-content__wrap"];
      this.fullInstance.Fullscreen(main);
    },
    // 退出全屏 退出到上次的状态
    exitScreen() {
      this.fullInstance.exitFullscreen();
    },

    onKeydown(e) {
      if (e.shiftKey && e.key === "F") {
        if (this.fullInstance.isElementFullScreen()) {
          this.exitScreen();
        } else {
          this.fullScreen();
        }
      }
    },
  },
};
