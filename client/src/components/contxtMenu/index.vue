<template>
  <el-popover
    placement="right"
    width="100"
    trigger="manual"
    v-model="visible"
    popper-class="popover"
    :close-delay="0"
    :style="{ left: menuX + 'px', top: menuY + 'px' }"
  >
    <span slot="reference"></span>
    <div
      v-for="(btn, index) in editorBtnList"
      :key="index"
      class="expand-item"
      :disabled="isDisabled(btn)"
    >
      <el-tooltip v-if="isDisabled(btn)" :content="btn.reason" placement="right">
        <div class="expand-item-content disabled">
          <i class="expand-item__icon" :class="btn.iconClass"></i>
          <span class="expand-item__text">{{ btn.name }}</span>
        </div>
      </el-tooltip>
      <div v-else class="expand-item-content" @click.stop="btn.click()">
        <i class="expand-item__icon" :class="btn.iconClass"></i>
        <span class="expand-item__text">{{ btn.name }}</span>
      </div>
    </div>
  </el-popover>
</template>
<script>
import operationsMix from "@/mixins/operations.js";
export default {
  name: "ContentMenu",
  mixins: [operationsMix],
  data() {
    return {
      visible: false,
      menuX: 0,
      menuY: 0,
    };
  },
  methods: {
    async show(e) {
      this.visible = false;
      await this.$nextTick();
      this.visible = !!e;
      if (!!e) {
        const { layerX, layerY } = e;
        this.menuX = layerX + 24;
        this.menuY = layerY + 20;
      }
    },
    isDisabled(btn) {
      return btn.disabled && btn.disabled();
    },
  },
};
</script>
<style scoped lang="scss">
.expand-item {
  display: flex;
  align-items: center;
  i.reference__icon {
    font-size: 16px;
  }
  .expand-item-content {
    width: 100%;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      color: var(--blue-6);
      background: var(--grey-8);
    }
    &.disabled {
      cursor: not-allowed;
      color: var(--grey-10);
    }
  }
  .expand-item__text {
    margin-left: 8px;
  }
}
</style>
