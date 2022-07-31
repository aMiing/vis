<template>
  <el-form-item label="变换">
    <div class="form-item-content">
      <div v-if="typeof data.rotate === 'number'" class="item">
        <label class="item-label">旋转</label>
        <el-input-number v-model="data.rotate" :min="0" :max="360"></el-input-number>
      </div>
      <div v-if="typeof data.scale === 'number'" class="item">
        <label class="item-label">缩放</label>
        <el-input-number v-model="data.scale" :step="0.01" :min="0" :max="2"></el-input-number>
      </div>
    </div>
  </el-form-item>
</template>
<script>
import mixin from "./mixins/index";
export default {
  name: "Zoom",
  mixins: [mixin],
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss"></style>
