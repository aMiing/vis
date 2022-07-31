<template>
  <el-form-item label="层级">
    <div class="form-item-content">
      <div class="item">
        <label class="item-label">zIndex: {{ data.zIndex }}</label>
        <div class="btn-box">
          <el-tooltip v-for="item in btns" :key="item.name" :content="item.label">
            <el-link :underline="false" @click="handleClick(item.name)">
              <i class="iconfont" :class="item.icon"></i>
            </el-link>
          </el-tooltip>
        </div>
      </div>
    </div>
  </el-form-item>
</template>
<script>
import mixin from "./mixins/index";
export default {
  name: "Layer",
  mixins: [mixin],
  data() {
    return {
      btns: [
        {
          name: "auto",
          label: "自动",
          icon: "icon-auto",
        },
        {
          name: "up",
          label: "向上一层",
          icon: "icon-MoveUp",
        },
        {
          name: "down",
          label: "向下一层",
          icon: "icon-MoveDown",
        },
      ],
    };
  },
  methods: {
    handleClick(val) {
      switch (val) {
        case "up":
          this.data.zIndex = (Number(this.data.zIndex) || 0) + 1;
          break;
        case "down":
          this.data.zIndex = (Number(this.data.zIndex) || 0) - 1;
          break;
        default:
          this.data.zIndex = "auto";
          break;
      }
    },
  },
};
</script>
<style scoped lang="scss">
.item-label {
  display: inline-block;
  width: 90px;
}
.btn-box {
  display: flex;
  font-size: 18px;
  .el-link {
    padding: 0 8px;
  }
}
</style>
