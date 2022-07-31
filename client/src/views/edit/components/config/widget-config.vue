<template>
  <div class="setting-content">
    <!-- <div class="flex-item__tab">
      <el-tabs v-model="activeTab" type="card" :stretch="true">
        <el-tab-pane name="style" label="样式"></el-tab-pane>
        <el-tab-pane name="data" label="数据"></el-tab-pane>
        <el-tab-pane name="interactive" label="交互"></el-tab-pane>
      </el-tabs>
    </div> -->
    <div class="flex-item__content">
      <div class="tab-style" v-show="activeTab === 'style'">
        <div class="widget-title">组件名称： {{ activatedEl.label || "--" }}</div>
        <attrConfig :data="activatedEl" />
      </div>
    </div>

    <div class="element-operations-group">
      <g-operation-group :options="componentOperationList" :iconOnly="true"></g-operation-group>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import attrConfig from "./widget/attributes.vue";
export default {
  name: "WidgetConfig",
  props: {
    activatedEl: {
      type: Object,
      default: null,
    },
  },
  components: {
    attrConfig,
  },
  data() {
    return {
      activeTab: "style",
      componentOperationList: [
        {
          name: "删除",
          iconClass: "iconfont icon-shanchu",
          click: () => this.delete(),
        },
        {
          name: "复制",
          iconClass: "iconfont icon-copy",
          click: () => this.copy(),
        },
      ],
    };
  },
  computed: {},
  methods: {
    ...mapMutations("editor", ["deleteElement"]),
    ...mapActions("editor", ["copyElement"]),
    delete() {
      this.deleteElement(this.activatedEl?.id);
      this.$emit("updateSelectedTarget", null);
    },
    async copy() {
      const result = await this.copyElement(this.activatedEl);
      this.$emit("updateSelectedTarget", result);
    },
  },
};
</script>
<style lang="scss" scoped>
.setting-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .widget-title {
    line-height: 32px;
    padding: 4px 0;
    font-weight: 600;
  }
  .flex-item__content {
    flex: 1;
    overflow: auto;
    padding: 0 16px 8px;
  }
  .element-operations-group {
    width: 100%;
    height: 34px;
    opacity: 0.7;
    border-top: 1px solid var(--grey-1);
    padding: 4px 16px;
    text-align: center;
  }
}
</style>
