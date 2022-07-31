<template>
  <el-form-item label="行间样式">
    <div class="form-item-content">
      <div class="item">
        <label for="" class="item-label">首行缩进</label>
        <el-slider :max="20" v-model="data.indent"></el-slider>
      </div>
      <div class="item">
        <label for="" class="item-label">行高</label>
        <el-slider :min="10" :max="60" v-model="data.lineHeight"></el-slider>
      </div>
    </div>
  </el-form-item>
</template>
<script>
import mixin from "./mixins/index";
export default {
  name: "RowStyle",
  mixins: [mixin],
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss"></style>
