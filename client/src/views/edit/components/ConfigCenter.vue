<template>
  <div class="config">
    <div class="tabs-content">
      <el-tabs type="card" v-model="activeTab" :stretch="true">
        <el-tab-pane class="radio-item" name="widget" label="组件列表"></el-tab-pane>
        <el-tab-pane class="radio-item" name="attribute" label="属性设置"></el-tab-pane>
      </el-tabs>
    </div>
    <Materials v-show="activeTab === 'widget'"></Materials>
    <div class="config__main" v-show="activeTab === 'attribute'">
      <!-- 组件属性设置面板 -->
      <widget-config v-if="target === 'widget'" v-bind="$attrs" v-on="$listeners"></widget-config>
      <screen-config v-if="target === 'screen'" v-bind="$attrs" v-on="$listeners"></screen-config>
    </div>
  </div>
</template>

<script>
import Materials from "./material";

import screenConfig from "./config/screen-config";
import widgetConfig from "./config/widget-config";
export default {
  name: "PropertyConfig",
  props: { clickTarget: { type: String, default: "screen" } },
  components: {
    Materials,
    screenConfig,
    widgetConfig,
  },
  data() {
    return {
      activeTab: "widget",
      target: "screen",
    };
  },
  watch: {
    clickTarget(val) {
      this.target = val;
      this.activeTab = "attribute";
    },
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.config {
  display: flex;
  flex-direction: column;
  height: 100%;
  .config__main {
    flex: 1;
    overflow: auto;
  }
  ::v-deep {
    .el-tabs__header {
      margin-bottom: 0px;
    }
  }
}
</style>

<style lang="scss">
.form-item-content {
  display: flex;
  flex-direction: column;
  .item {
    // flex: 1;
    display: flex;
    margin-bottom: 8px;
    min-width: 120px;
    margin-right: 4px;
    .item-label {
      font-size: 12px;
      padding: 0 8px 0 4px;
      color: var(--grey-11);
      flex-shrink: 0;
    }
    .slider-box {
      flex: 1;
      padding: 0 4px;
    }
    .item-inner-box {
      display: flex;
      justify-content: flex-start;
      &.--wrap {
        flex-wrap: wrap;
      }
      .flex-box {
        padding: 0 4px;
        display: flex;
        flex-direction: column;
        .label {
          text-align: center;
          color: var(--grey-11);
          font-size: 12px;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
