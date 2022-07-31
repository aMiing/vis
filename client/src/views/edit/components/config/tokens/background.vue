<template>
  <el-form-item label="背景">
    <div class="form-item-content">
      <div class="item">
        <label for="" class="item-label">颜色</label>
        <el-color-picker show-alpha v-model="data.backgroundColor"></el-color-picker>
      </div>
      <div v-if="data.backgroundImage !== undefined" class="item">
        <label for="" class="item-label">图片</label>
        <img :src="data.backgroundImage" alt="" width="100" height="60" />
      </div>
    </div>
  </el-form-item>
</template>
<script>
import mixin from "./mixins/index";
export default {
  name: "Background",
  mixins: [mixin],
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss"></style>
