<template>
  <div
    ref="drag"
    class="drag barChart"
    title="柱状图"
    :uid="item.uid"
    :style="{
      position: Position,
      cursor: Cursor,
      overflow: Overflow,
      width: item.widgetWidth + '%',
      height: item.widgetHeight + '%',
      left: item.widgetLeft + '%',
      top: item.widgetTop + '%',
    }"
  >
    <div
      class="btn"
      style="position: absolute; left: 0; top: 0; z-index: 99; background: #6bf; font-size: 1vw"
    >
      <div
        class="copy btn"
        @click="copyIt"
        title="复制"
        style="cursor: pointer; float: left; padding: 2px"
      >
        <a href="#"><i class="iconfont icon-fuzhi1"></i></a>
      </div>
      <div
        class="delete btn"
        @click="deleteIt"
        title="删除"
        style="cursor: pointer; float: left; padding: 2px"
      >
        <a><i class="iconfont icon-icon-delete"></i></a>
      </div>
    </div>

    <div
      class="reSize btn"
      @mousedown="resizeIt"
      title="改变大小"
      style="position: absolute; right: 0; bottom: 0; z-index: 99"
    >
      <el-button
        size="small"
        style="
          cursor: se-resize;
          background-color: #6bf;
          color: #000;
          font-size: 1vw;
          background: #6bf;
          border: 0;
          border-radius: 0;
        "
      >
        <i class="iconfont icon-resize" style="cursor: se-resize"></i>
      </el-button>
    </div>
    <div
      ref="barChart"
      style="position: absolute; width: 100%; display: table; text-align: center; height: 100%"
      :style="{
        fontWeight: item.fontWeight * 10,
        fontFamily: item.fontFamily,
        fontSize: item.fontSize / 20 + 'vw',
        textAlign: item.textAlign,
      }"
    >
      <ve-histogram
        :data="chartData"
        :width="chartWidth"
        :height="chartHeight"
        :extend="chartExtend"
        :settings="chartSettings"
      ></ve-histogram>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"],
  data() {
    return {
      chartSettings: {
        showLine: [],
        axisSite: { right: ["下单率"] },
        yAxisType: ["KMB", "percent"],
        yAxisName: ["数值", "比率"],
      },
      colorItems: [
        ["#0037FF", "#B300FF", "#FF0044", "#f3f22F", "#03ff03", "#FF6A00"],
        ["#F59885", "#FFF87B", "#BBFE6E", "#6EFEF9", "#6E7AFE", "#E58AFC", "#FC8AB9"],
      ],
      Position: "absolute",
      Cursor: "move",
      Overflow: "hidden",
      chartWidth: "300px",
      chartHeight: "200px",
      chartData: {
        columns: ["日期", "访问用户", "下单用户", "下单率"],
        rows: [
          { 日期: "1/1", 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
          { 日期: "1/2", 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
          { 日期: "1/3", 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
          { 日期: "1/4", 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
          { 日期: "1/5", 访问用户: 3792, 下单用户: 3492, 下单率: 0.33 },
          { 日期: "1/6", 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 },
        ],
      },
    };
  },
  watch: {
    "item.showLine": function () {
      console.log(this.chartSettings.showLine);
      let self = this;
      if (this.chartSettings.showLine.length < 3) {
        self.chartSettings.showLine.push(self.chartData.columns[self.item.showLine]);
      } else {
        self.chartSettings.showLine = [];
      }
    },
  },
  beforeCreate: function () {},
  created: function () {},
  mounted: function () {
    this.chartWidth =
      this.item.widgetWidth *
        (document.getElementsByClassName("screenPanel")[0].clientWidth / 100) +
      "px";
    this.chartHeight =
      this.item.widgetHeight *
        (document.getElementsByClassName("screenPanel")[0].clientHeight / 90) +
      "px";
    let self = this;
    window.onresize = function () {
      self.chartWidth =
        self.item.widgetWidth *
          (document.getElementsByClassName("screenPanel")[0].clientWidth / 100) +
        "px";
      self.chartHeight =
        self.item.widgetHeight *
          (document.getElementsByClassName("screenPanel")[0].clientHeight / 90) +
        "px";
    };
  },
  beforeUpdate: function () {
    this.chartWidth =
      this.item.widgetWidth *
        (document.getElementsByClassName("screenPanel")[0].clientWidth / 100) +
      "px";
    this.chartHeight =
      this.item.widgetHeight *
        (document.getElementsByClassName("screenPanel")[0].clientHeight / 90) +
      "px";
  },
  computed: {
    chartExtend() {
      return {
        series: {
          label: {
            normal: {
              show: this.item.seriesShow,
              position: this.item.seriesPosition,
            },
          },
        },
        backgroundColor: this.item.bgColor,
        color: this.colorItems[parseInt(this.item.colorType) - 1],
        legend: {
          show: this.item.legend,
          align: "left",
          orient: "horizontal",
          textStyle: {
            color: this.item.fontColor,
            fontWeight: this.item.fontWeight,
            fontFamily: this.item.fontFamily,
            fontSize: this.item.fontSize,
          },
        },
        xAxis: {
          axisLabel: {
            color: this.item.fontColor,
            fontWeight: this.item.fontWeight,
            fontFamily: this.item.fontFamily,
            fontSize: this.item.fontSize,
          },
        },
        yAxis: {
          axisLabel: {
            color: this.item.fontColor,
            fontWeight: this.item.fontWeight,
            fontFamily: this.item.fontFamily,
            fontSize: this.item.fontSize,
          },
        },
      };
    },
  },
  methods: {
    deleteIt: function (e) {
      let oDrag = this.$el;
      //阻止事件冒泡
      e.stopPropagation();
      //获知点击的是第几个控件

      var self = this;
      // let i = parseInt(this.uid.slice(4,));
      let i = this.item.id;
      if (confirm("删除之后将不能恢复,确定删除吗？")) {
        self.$emit("deleate", i);
        //oDrag.parentNode.removeChild(oDrag);
      } else {
        console.log("取消删除元素--" + oDrag.innerHTML);
      }
    },
    copyIt: function (e) {
      let oDrag = this.$el;
      //阻止事件冒泡
      e.stopPropagation();
    },
  },
};
</script>

<style scoped lang="scss"></style>
