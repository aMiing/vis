<template>
  <el-form-item label="尺寸">
    <div class="form-item-content">
      <div class="item">
        <div class="item-inner-box --wrap">
          <div class="flex-box">
            <el-input-number
              ref="width"
              v-model="data.width"
              :min="1"
              :max="1920"
            ></el-input-number>
            <label class="label">宽度</label>
          </div>
          <div class="flex-box">
            <el-input-number
              ref="height"
              v-model="data.height"
              :min="1"
              :max="1080"
            ></el-input-number>
            <label class="label">高度</label>
          </div>
        </div>
      </div>
    </div>
  </el-form-item>
</template>
<script>
import mixin from "./mixins/index";
export default {
  name: "Size",
  mixins: [mixin],
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss">
.form-item-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>
