<template>
  <div class="panel-list">
    <div class="header">
      <div class="header-title">
        <span>大屏管理</span>
      </div>
      <el-button class="panel__create" @click="createNewPanel">
        <i class="iconfont icon-tianjia1"></i>
        <span class="add-label">新建可视化</span>
        <createDialog ref="createDialog" @submit="addPanel" />
      </el-button>
    </div>
    <screenList ref="screenList" />
  </div>
</template>

<script>
import screenList from "./components/list";
import createDialog from "@/components/dialog/create-dialog";
export default {
  name: "PanelList",
  components: {
    screenList,
    createDialog,
  },
  data() {
    return {};
  },
  methods: {
    createNewPanel() {
      this.$refs.createDialog.show();
    },
    addPanel(data) {
      this.$refs.screenList.addPanel(data);
    },
  },
};
</script>

<style scoped lang="scss">
.panel-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .header {
    // height: 30px;
    line-height: 30px;
    padding: 0 4px 8px;
    display: flex;
    justify-content: space-between;
  }

  .panel__create {
    text-align: right;
  }
}
</style>
