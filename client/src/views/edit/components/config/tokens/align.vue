<template>
  <el-form-item label="对齐方式">
    <div class="form-item-content">
      <el-radio-group v-model="data.textAlign" size="mini">
        <el-radio-button label="left">居左</el-radio-button>
        <el-radio-button label="center">居中</el-radio-button>
        <el-radio-button label="right">居右</el-radio-button>
      </el-radio-group>
    </div>
  </el-form-item>
</template>
<script>
import mixin from "./mixins/index";
export default {
  name: "Align",
  mixins: [mixin],
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss"></style>
