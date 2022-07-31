<template>
  <div class="setting-content">
    <div class="screen-title">屏幕名称：{{ title || "--" }}</div>
    <div class="config-content">
      <attributesVue :model="value"></attributesVue>
    </div>
    <div class="operation-content">
      <el-button type="primary" plain>重置</el-button>
      <el-button type="primary" plain>恢复默认背景</el-button>
    </div>
  </div>
</template>

<script>
import config from "@/config/screen";
import attributesVue from "./screen/attributes.vue";
const screenShot = require("@/assets/images/bg.png");
export default {
  name: "ScreenConfig",
  components: {
    attributesVue,
  },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      config,
      screenShot,
    };
  },
  computed: {
    title() {
      return this.$route?.query?.name;
    },
  },
};
</script>

<style lang="scss" scoped>
.setting-content {
  // position: relative;
  height: 100%;
  min-width: 270px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.screen-title {
  line-height: 32px;
  border-bottom: 1px solid var(--grey-1);
  padding: 4px 16px;
  font-weight: 600;
}
.config-content {
  position: relative;
  padding: 12px;
  overflow: auto;
  // overflow-x: hidden;
  // height: calc(100% - 30px - 54px);
  flex: 1;

  .size {
    display: flex;
    flex-direction: column;
    height: 70px;
    justify-content: space-between;
  }
}
.operation-content {
  flex: 0 0 55px;
  text-align: center;
  // position: absolute;
  // bottom: 0;
  width: 100%;
  padding: 12px 0;
  border-top: 1px solid var(--grey-1);
}
.screenshot {
  position: relative;
  .screenshot__img {
    object-fit: scale-down;

    width: 100%;
    height: 100%;
  }
  .screenshot__btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
