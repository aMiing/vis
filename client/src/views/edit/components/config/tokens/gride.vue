<template>
  <el-form-item label="网格">
    <div class="form-item-content">
      <div class="item">
        <label for="" class="item-label">间隙</label>
        <el-input-number v-model="data.gride" :min="1" :max="60"></el-input-number>
      </div>
    </div>
  </el-form-item>
</template>
<script>
import mixin from "./mixins/index";
export default {
  name: "Gride",
  mixins: [mixin],
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss"></style>
