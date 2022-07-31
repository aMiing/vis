<template>
  <el-form-item label="边框">
    <div class="form-item-content">
      <div class="item" v-for="(item, index) in ['上', '右', '下', '左']">
        <label for="" class="item-label">
          {{ item }}
        </label>
        <div class="item-inner-box">
          <div class="flex-box">
            <el-input-number type="number" v-model="data.borderWidth[index]"></el-input-number>
            <span class="label">粗细</span>
          </div>
          <div class="flex-box">
            <el-select type="number" v-model="data.borderStyle[index]">
              <el-option
                v-for="item in borderStyleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="label">类型</span>
          </div>
          <div class="flex-box">
            <el-color-picker v-model="data.borderColor[index]"></el-color-picker>
            <span class="label">颜色</span>
          </div>
        </div>
      </div>
    </div>
  </el-form-item>
</template>
<script>
import mixin from "./mixins/index";
export default {
  name: "Border",
  mixins: [mixin],
  data() {
    return {
      borderStyleOptions: [
        {
          label: "实线",
          value: "solid",
        },
        {
          label: "虚线",
          value: "dashed",
        },
        {
          label: "圆点",
          value: "dotted",
        },
        {
          label: "双线",
          value: "double",
        },
        {
          label: "浮雕",
          value: "ridge",
        },
        {
          label: "雕刻",
          value: "groove",
        },
        {
          label: "陷入",
          value: "inset",
        },
        {
          label: "突出",
          value: "outside",
        },
      ],
    };
  },
  methods: {},
};
</script>
<style scoped lang="scss"></style>
