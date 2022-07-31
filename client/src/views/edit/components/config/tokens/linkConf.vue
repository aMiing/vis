<template>
  <el-form-item label="超链接配置">
    <div class="form-item-content">
      <div class="item">
        <label for="" class="item-label">超链接</label>
        <el-switch v-model="data.isLink"></el-switch>
      </div>
      <div class="item">
        <label for="" class="item-label">链接地址</label>
        <el-input v-model="data.url"></el-input>
      </div>
      <div class="item">
        <label for="" class="item-label">打开方式</label>

        <el-radio-group v-model="data.target">
          <el-radio label="_blank">新窗口</el-radio>
          <el-radio label="_parent">此窗口</el-radio>
        </el-radio-group>
      </div>
    </div>
  </el-form-item>
</template>
<script>
import mixin from "./mixins/index";
export default {
  name: "LinkConf",
  mixins: [mixin],
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss"></style>
