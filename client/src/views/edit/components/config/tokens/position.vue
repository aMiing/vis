<template>
  <el-form-item label="位置">
    <div class="form-item-content">
      <div class="item">
        <div class="item-inner-box --wrap">
          <div class="flex-box">
            <el-input-number
              v-model="data.posX"
              :step="data.gride || 5"
              :min="0"
              :max="1920"
            ></el-input-number>
            <span class="label">横坐标</span>
          </div>
          <div class="flex-box">
            <el-input-number
              v-model="data.posY"
              :step="data.gride || 5"
              :min="0"
              :max="1080"
            ></el-input-number>
            <span class="label">纵坐标</span>
          </div>
        </div>
      </div>
    </div>
  </el-form-item>
</template>
<script>
import mixin from "./mixins/index";
export default {
  name: "Position",
  mixins: [mixin],
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss"></style>
