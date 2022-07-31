<template>
  <el-form-item label="文本">
    <div class="form-item-content">
      <el-input type="textarea" :rows="1" v-model="data.value"></el-input>
    </div>
  </el-form-item>
</template>
<script>
import mixin from "./mixins/index";
export default {
  name: "TextArea",
  mixins: [mixin],
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss"></style>
