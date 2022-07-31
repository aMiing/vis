<template>
  <el-form-item label="文本">
    <div class="form-item-content">
      <el-input v-model="data.text" placeholder="请输入文本内容"></el-input>
    </div>
  </el-form-item>
</template>
<script>
import mixin from "./mixins/index";
export default {
  name: "CommonText",
  mixins: [mixin],
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss"></style>
