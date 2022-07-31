<template>
  <div
    ref="drag"
    class="drag pieChart"
    @mousedown="MoveIt"
    title="饼状图"
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
      ref="barChart"
      style="position: absolute; width: 100%; display: table; text-align: center; height: 100%"
      :style="{
        fontWeight: item.fontWeight * 10,
        fontFamily: item.fontFamily,
        fontSize: item.fontSize / 20 + 'vw',
        textAlign: item.textAlign,
      }"
    >
      <ve-pie
        :data="chartData"
        :width="chartWidth"
        :height="chartHeight"
        :extend="chartExtend"
        :settings="chartSettings"
      ></ve-pie>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"],
  data() {
    return {
      chartSettings: {
        radius: "",
        offsetY: "",
        roseType: "",
        level: "",
        dataType: "percent",
      },
      colorItems: [
        ["#0037FF", "#B300FF", "#FF0044", "#f3f22F", "#03ff03", "#FF6A00"],
        ["#F59885", "#FFF87B", "#BBFE6E", "#6EFEF9", "#6E7AFE", "#E58AFC", "#FC8AB9"],
      ],
      Position: "absolute",
      Cursor: "move",
      Overflow: "",
      chartWidth: "300px",
      chartHeight: "200px",
      chartData: {
        columns: ["日期", "访问用户"],
        rows: [
          { 日期: "第一季度", 访问用户: 1393 },
          { 日期: "第二季度", 访问用户: 3530 },
          { 日期: "第三季度", 访问用户: 2923 },
          { 日期: "第四季度", 访问用户: 1723 },
        ],
      },
    };
  },
  watch: {
    "item.roseType": function () {
      console.log(this.item.roseType);
      this.chartSettings.roseType = this.item.roseType;
    },
    "item.level": function () {
      if (this.item.level) {
        this.chartSettings.level = [
          ["第一季度", "第二季度"],
          ["第四季度", "第三季度"],
        ];
      } else {
        this.chartSettings.level = "";
      }
    },
  },
  beforeCreate: function () {},
  created: function () {},
  mounted: function () {
    this.chartSettings.roseType = this.item.roseType;
    if (this.item.level) {
      this.chartSettings.level = [
        ["第一季度", "第二季度"],
        ["第四季度", "第三季度"],
      ];
    } else {
      this.chartSettings.level = "";
    }
    this.chartWidth =
      this.item.widgetWidth *
        (document.getElementsByClassName("screenPanel")[0].clientWidth / 100) +
      "px";
    this.chartHeight =
      this.item.widgetHeight *
        (document.getElementsByClassName("screenPanel")[0].clientHeight / 100) +
      "px";

    this.chartSettings.radius =
      this.item.widgetHeight *
      (document.getElementsByClassName("screenPanel")[0].clientHeight / 250);
    this.chartSettings.offsetY = this.chartSettings.radius * 1.3;
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

      self.chartSettings.radius =
        self.item.widgetHeight *
        (document.getElementsByClassName("screenPanel")[0].clientHeight / 250);
      self.chartSettings.offsetY = self.chartSettings.radius * 1.3;
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

    this.chartSettings.radius =
      this.item.widgetHeight *
      (document.getElementsByClassName("screenPanel")[0].clientHeight / 250);
    this.chartSettings.offsetY = this.chartSettings.radius * 1.3;
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
          align: this.item.align,
          orient: this.item.orient,
          x: this.item.x,
          textStyle: {
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
      let pageSetting = this.$parent.$el.childNodes[8].getElementsByClassName("pageSetting")[0];

      let widgetSetting = this.$parent.$el.childNodes[8].getElementsByClassName("widgetSetting")[0];
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
    },
  },
};
</script>

<style scoped lang="scss"></style>
