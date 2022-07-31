<template>
  <el-form-item label="字体">
    <div class="form-item-content">
      <div class="famill item">
        <label for="" class="item-label">字体名称</label>
        <el-select v-model="data.fontFamily" placeholder="请选择字体">
          <el-option
            v-for="item in fontOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="size item">
        <label for="" class="item-label">字体大小</label>
        <div class="slider-box">
          <el-slider :min="1" v-model="fontSize" @change="fontSizeChange"></el-slider>
        </div>
      </div>

      <div class="weight item">
        <label for="" class="item-label">字体粗细</label>
        <div class="slider-box">
          <el-slider
            v-model="fontWeight"
            :step="10"
            :min="300"
            :max="800"
            @change="fontWeightChange"
          ></el-slider>
        </div>
      </div>

      <div class="color item">
        <label for="" class="item-label">字体颜色</label>
        <el-color-picker v-model="data.color"></el-color-picker>
      </div>
    </div>
  </el-form-item>
</template>
<script>
import mixin from "./mixins/index";
export default {
  name: "Font",
  mixins: [mixin],
  data() {
    return {
      fontOptions: [
        {
          value: "宋体",
          label: "宋体",
        },
        {
          value: "楷体",
          label: "楷体",
        },
        {
          value: "罗马",
          label: "罗马",
        },
        {
          value: "新宋",
          label: "新宋",
        },
        {
          value: "等线",
          label: "等线",
        },
      ],
      fontSize: this.$props?.data?.fontSize || 12,
      fontWeight: this.$props?.data?.fontWeight || 400,
    };
  },
  methods: {
    fontSizeChange(val) {
      this.data.fontSize = val;
    },
    fontWeightChange(val) {
      this.data.fontWeight = val;
    },
  },
};
</script>
<style scoped lang="scss"></style>
