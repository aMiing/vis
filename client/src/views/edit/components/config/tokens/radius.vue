<template>
  <el-form-item label="圆角">
    <div class="form-item-content">
      <div class="item">
        <div class="item-inner-box --wrap">
          <div class="flex-box" v-for="(item, index) in ['左上', '右上', '右下', '左下']">
            <el-input-number type="number" v-model="data.borderRadius[index]"></el-input-number>
            <span class="label">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-form-item>
</template>
<script>
import mixin from "./mixins/index";
export default {
  name: "Radius",
  mixins: [mixin],
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss">
.item-inner-box {
  flex-wrap: wrap;
}
</style>
