<template>
  <div
    ref="drag"
    class="drag dashbord"
    @mousedown="MoveIt"
    title="仪表盘"
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
      <ve-gauge
        :data="chartData"
        :width="chartWidth"
        :height="chartHeight"
        :extend="chartExtend"
        :settings="chartSettings"
      ></ve-gauge>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item"],
  data() {
    return {
      chartSettings: {
        dataName: {
          速度: "km/h",
        },
        seriesMap: {
          速度: {
            min: this.item.minData,
            max: this.item.maxData,
            splitNumber: this.item.splitNum,
            radius: "90%",
            axisLine: {
              lineStyle: {
                color: [
                  [0.09, "lime"],
                  [0.82, "#1e90ff"],
                  [1, "#ff4500"],
                ],
                width: this.item.axisLineWidth,
                shadowColor: "#fff",
                shadowBlur: 10,
              },
            },
            axisLabel: {
              fontFamily: this.item.fontFamily,
              fontWeight: this.item.fontWeight,
              fontSize: this.item.fontSize,
              color: this.item.fontColor,
              textStyle: {
                fontWeight: "bolder",
                color: "#fff",
                shadowColor: "#fff",
                shadowBlur: 10,
              },
            },
            axisTick: {
              length: 15,
              lineStyle: {
                color: "auto",
                shadowColor: "#fff",
                shadowBlur: 10,
              },
            },
            splitLine: {
              length: 25,
              lineStyle: {
                width: 3,
                color: "#fff",
                shadowColor: "#fff",
                shadowBlur: 10,
              },
            },
            pointer: {
              shadowColor: "#fff",
              shadowBlur: 5,
            },
            title: {
              textStyle: {
                fontWeight: "bolder",
                fontSize: 20,
                fontStyle: "italic",
                color: "#fff",
                shadowColor: "#fff",
                shadowBlur: 10,
              },
            },
            detail: {
              backgroundColor: "rgba(30,144,255,0.8)",
              borderWidth: 1,
              borderColor: "#fff",
              shadowColor: "#fff",
              shadowBlur: 5,
              offsetCenter: [0, "50%"],
              textStyle: {
                fontWeight: "bolder",
                color: "#fff",
              },
            },
          },
        },
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
        columns: ["type", "value"],
        rows: [{ type: "速度", value: 66 }],
      },
    };
  },
  watch: {
    "item.dataName": function () {
      this.chartSettings.dataName["速度"] = this.item.dataName;
    },
    "item.minData": function () {
      this.chartSettings.seriesMap["速度"].min = this.item.minData;
    },
    "item.maxData": function () {
      this.chartSettings.seriesMap["速度"].max = this.item.maxData;
    },
    "item.splitNum": function () {
      this.chartSettings.seriesMap["速度"].splitNumber = this.item.splitNum;
    },
    "item.fontSize": function () {
      this.chartSettings.seriesMap["速度"].axisLabel.fontSize = this.item.fontSize;
    },
    "item.fontFamily": function () {
      this.chartSettings.seriesMap["速度"].axisLabel.fontFamily = this.item.fontFamily;
    },
    "item.fontColor": function () {
      this.chartSettings.seriesMap["速度"].axisLabel.color = this.item.fontColor;
    },
    "item.axisLineWidth": function () {
      this.chartSettings.seriesMap["速度"].axisLine.lineStyle.width = parseInt(
        this.item.axisLineWidth
      );
      console.log(this.chartSettings.seriesMap["速度"].axisLine.lineStyle.width);
    },
  },
  beforeCreate: function () {},
  created: function () {
    let self = this;
    setInterval(function () {
      if (self.chartData.rows[0].value >= 0 && self.chartData.rows[0].value <= 220) {
        self.chartData.rows[0].value += Math.ceil((Math.random() - 0.5) * 60);
      } else {
        self.chartData.rows[0].value = 110;
      }
    }, 2000);
  },
  mounted: function () {
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
  },
  computed: {
    chartExtend() {
      return {
        backgroundColor: this.item.bgColor,
        color: this.colorItems[parseInt(this.item.colorType) - 1],
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
