<template>
  <div
    ref="drag"
    class="drag horizontalBarChart"
    @mousedown="MoveIt"
    title="水平柱状图"
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
      title="复制"
      style="position: absolute; left: 0; top: 0; z-index: 99; background: #6bf; font-size: 1vw"
    >
      <div class="copy btn" @click="copyIt" style="cursor: pointer; float: left; padding: 2px">
        <a href="#"><i class="iconfont icon-fuzhi1"></i></a>
      </div>
      <div
        class="deleate btn"
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
      ref="horizontalBarChart"
      style="position: absolute; width: 100%; display: table; text-align: center; height: 100%"
      :style="{
        fontWeight: item.fontWeight * 10,
        fontFamily: item.fontFamily,
        fontSize: item.fontSize / 20 + 'vw',
        textAlign: item.textAlign,
      }"
    >
      <ve-bar
        :data="chartData"
        :width="chartWidth"
        :height="chartHeight"
        :extend="chartExtend"
        :settings="chartSettings"
      ></ve-bar>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"],
  data() {
    return {
      chartSettings: {
        xAxisType: ["KMB", "KMB"],
        xAxisName: ["下单用户", "访问用户"],
        axisSite: {
          top: ["访问用户"],
        },
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
        columns: ["日期", "访问用户", "下单用户"],
        rows: [
          { 日期: "1/1", 访问用户: 1393, 下单用户: 1093 },
          { 日期: "1/2", 访问用户: 3530, 下单用户: 3230 },
          { 日期: "1/3", 访问用户: 2923, 下单用户: 2623 },
          { 日期: "1/4", 访问用户: 1723, 下单用户: 1423 },
          { 日期: "1/5", 访问用户: 3792, 下单用户: 3492 },
          { 日期: "1/6", 访问用户: 4593, 下单用户: 4293 },
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
        (document.getElementsByClassName("screenPanel")[0].clientHeight / 100) +
      "px";
    let self = this;
    window.onresize = function () {
      self.chartWidth =
        self.item.widgetWidth *
          (document.getElementsByClassName("screenPanel")[0].clientWidth / 100) +
        "px";
      self.chartHeight =
        self.item.widgetHeight *
          (document.getElementsByClassName("screenPanel")[0].clientHeight / 100) +
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
        (document.getElementsByClassName("screenPanel")[0].clientHeight / 100) +
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
    MoveIt: function (e) {
      var i = parseInt(this.item.uid.slice(4));
      let oDrag = this.$el; //获取操作目标对象
      this.$emit("loadSetting", i); //i-1从id转换成index下标

      //console.log(this);
      //去除其他元素的边框
      var allDrags = document.getElementsByClassName("drag");
      for (let m = 0; m < allDrags.length; m++) {
        allDrags[m].style.border = "0";
        //console.log(allDrags[m].style);
      }
      /*获取所有的 .btn 并且设置为隐藏状态*/
      var allBtns = document.getElementsByClassName("btn");
      for (var j = 0; j < allBtns.length; j++) {
        //console.log('iii');
        allBtns[j].style.visibility = "hidden";
      }
      //console.log('ccc');
      /*获取当前的 .btn 并且设置为显示状态*/
      var theBtns = oDrag.getElementsByClassName("btn");
      for (var j = 0; j < theBtns.length; j++) {
        theBtns[j].style.visibility = "visible";
        this.$el.style.border = "0.1px solid #6bf";
      }
      //切换属性设置面板
      let pageSetting = document.getElementsByClassName("pageSetting")[0];

      let widgetSetting = document.getElementsByClassName("widgetSetting")[0];
      //console.log(widgetSetting);
      pageSetting.style.display = "none";
      widgetSetting.style.display = "block";

      var offsetParent = oDrag.parentNode; //获取父元素
      var parentOffsetWidth = offsetParent.offsetWidth; //获取父元素的宽度
      var parentOffsetLeft = offsetParent.offsetLeft; //获取父元素的左边距
      var parentOffsetTop = offsetParent.offsetTop; //获取父元素的上边距

      let disx = e.pageX - oDrag.offsetLeft;
      let disy = e.pageY - oDrag.offsetTop;
      var self = this;
      document.onmousemove = function (e) {
        //调整控件位置，并转化成百分比的形式
        oDrag.style.left = (100 * (e.pageX - disx)) / parentOffsetWidth + "%";
        oDrag.style.top = (100 * (e.pageY - disy)) / (parentOffsetWidth * 0.6) + "%";
        let leftNum = (100 * (e.pageX - disx)) / parentOffsetWidth;
        let topNum = (100 * (e.pageY - disy)) / (parentOffsetWidth * 0.6);
        //console.log(self.uid);
        self.$emit("changePosition", { uid: self.item.uid, left: leftNum, top: topNum });
      };
      document.onmouseup = function (e) {
        document.onmousemove = document.onmouseup = null;
        /*self.$emit('saveChange',{uid:self.uid,save:true});这里没必要对数据库操作，对面不进行*/
      };
    },
    resizeIt: function (e) {
      let oDrag = this.$el;
      //阻止事件冒泡
      e.stopPropagation();
      let disx = oDrag.offsetLeft;
      let disy = oDrag.offsetTop;

      var self = this;
      var offsetParent = oDrag.parentNode; //获取父元素
      var parentOffsetWidth = offsetParent.offsetWidth; //获取父元素的宽度
      var parentOffsetHeight = offsetParent.offsetHeight; //获取父元素的宽度
      document.onmousemove = function (e) {
        oDrag.style.width = (100 * (e.pageX - disx - 190)) / parentOffsetWidth + "%";
        oDrag.style.height = (100 * (e.pageY - disy - 90)) / parentOffsetHeight + "%";
        let widthNum = (100 * (e.pageX - disx - 190)) / parentOffsetWidth;
        // console.log(widthNum);
        let heightNum = (100 * (e.pageY - disy - 90)) / parentOffsetHeight;
        /*为了可以获取到最新的width和height的值，巧用var self = this;将外部的this引入到内部，实现动态引用的效果*/
        //console.log(self.$el.parentNode.children[i]);
        self.$emit("changeSize", { uid: self.item.uid, width: widthNum, height: heightNum });
        //console.log();
      };
      document.onmouseup = function (e) {
        document.onmousemove = document.onmouseup = null;
        // self.$emit('saveChange',{uid:self.uid,save:true});
      };
    },
    deleteIt: function (e) {
      let oDrag = this.$el;
      //阻止事件冒泡
      e.stopPropagation();
      //获知点击的是第几个控件

      var self = this;
      // let i = parseInt(this.uid.slice(4,));
      let i = this.item.id;
      //console.log(self);
      if (confirm("删除之后将不能恢复,确定删除吗？")) {
        self.$emit("deleate", i);
        //oDrag.parentNode.removeChild(oDrag);
      } else {
        console.log("取消删除元素--" + oDrag.innerHTML);
      }
    },
    copyIt: function (e) {
      let oDrag = this.$el;
      //console.log(oDrag);
      let oDrag1 = oDrag;
      //阻止事件冒泡
      e.stopPropagation();

      console.log();
    },
  },
};
</script>

<style scoped lang="scss"></style>
