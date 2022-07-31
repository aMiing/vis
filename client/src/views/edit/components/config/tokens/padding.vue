<template>
  <el-form-item label="边距">
    <div class="form-item-content">
      <div class="item">
        <div class="item-inner-box --wrap">
          <div class="flex-box" v-for="(item, index) in ['上', '右', '下', '左']">
            <el-input-number type="number" v-model="data.padding[index]"></el-input-number>
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
  name: "Padding",
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
