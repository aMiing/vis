<template>
  <div class="layer">
    <div class="side-head">
      <div class="title">图层管理</div>
      <div class="operate-btn-group">
        <el-tooltip class="item" effect="dark" content="上移一层" placement="top-start">
          <el-button type="text" size="small"><i class="iconfont icon-line-up"></i></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="下移一层" placement="bottom">
          <el-button type="text" size="small"><i class="iconfont icon-line-down"></i></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="置顶" placement="top-start">
          <el-button type="text" size="small"><i class="iconfont icon-zhiding"></i></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="置底" placement="bottom-start">
          <el-button type="text" size="small"><i class="iconfont icon-zhidi"></i></el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="z-axis-list">
      <div
        class="leftComponentList .drag"
        v-for="(pageComponent, index) in pageComponents"
        :key="index"
      >
        <div class="z-axis-item" @click="checkedIt">
          <input type="checkbox" name="" id="" @click="checkBox" />
          <i :class="'iconfont icon-' + pageComponent.icon" @click="checkBox"></i>
          {{ pageComponent.name }}{{ index }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      pageComponents: [],
    };
  },
  methods: {
    checkBox(e) {
      e.stopPropagation(); //阻止事件冒泡
      let theList = e.path[1];
      let allList = document.getElementsByClassName("z-axis-item");
      theList.style.background = "rgba(0,192,222,.2)";
      //console.log(theList);
      let j = 0;
      while (theList != allList[j]) {
        j++;
      }
      // (uid.slice(0,-1) == j)
      /*获取*/
      var allDrags = document.getElementsByClassName("drag");
      var oDrag;
      for (let i = 0; i < allDrags.length; i++) {
        if (allDrags[i].attributes[3].nodeValue.slice(4) == j) {
          oDrag = allDrags[i]; //获取操作目标对象
        }
      }
      var theBtns = oDrag.getElementsByClassName("btn");
      if (e.path[0].checked == true) {
        /*获取当前的 .btn 并且设置为显示状态*/
        for (let i = 0; i < theBtns.length; i++) {
          theBtns[i].style.visibility = "visible";
          oDrag.style.border = "0.1px solid #6bf";
        }
      } else {
        for (let i = 0; i < theBtns.length; i++) {
          theBtns[i].style.visibility = "hidden";
          oDrag.style.border = 0;
        }
      }
    },
    checkedIt: function (e) {
      //实现了点击列表的正常切换，要实现点击带动主面板控件的切换
      let allList = document.getElementsByClassName("z-axis-item");
      let theList = e.target;
      for (let i = 0; i < allList.length; i++) {
        allList[i].style.background = "#1b1f25";
        allList[i].getElementsByTagName("input")[0].checked = false;
      }
      theList.style.background = "rgba(50,180,255,.8)";
      theList.getElementsByTagName("input")[0].checked = true;
      var j = 0;
      while (theList != allList[j]) {
        j++;
      }
      var allDrags = document.getElementsByClassName("drag");
      var oDrag = allDrags[j];
      // console.log(oDrag);
      //去除其他元素的边框
      for (let m = 0; m < allDrags.length; m++) {
        allDrags[m].style.border = "0";
        //console.log(allDrags[m].style);
      }
      /*获取所有的 .btn 并且设置为隐藏状态*/
      var allBtns = document.getElementsByClassName("btn");
      for (let q = 0; q < allBtns.length; q++) {
        //console.log('iii');
        allBtns[q].style.visibility = "hidden";
      }
      //console.log('ccc');
      /*获取当前的 .btn 并且设置为显示状态*/
      var theBtns = oDrag.getElementsByClassName("btn");
      for (let q = 0; q < theBtns.length; q++) {
        theBtns[q].style.visibility = "visible";
        oDrag.style.border = "0.1px solid #6bf";
      }
      //切换属性设置面板
      let pageSetting = document.getElementsByClassName("pageSetting")[0];
      //console.log(this.$parent.$el.childNodes[0].childNodes[2].getElementsByClassName('leftComponentList')[i]);
      let widgetSetting = document.getElementsByClassName("widgetSetting")[0];
      //console.log(widgetSetting);
      pageSetting.style.display = "none";
      widgetSetting.style.display = "block";
      this.showSetting = this.pageComponents[j].uid;
    },
  },
};
</script>

<style scoped lang="scss">
.layer {
  position: relative;
  height: 100%;
  min-width: 100px;
  .side-head {
    text-align: center;
    .title {
      margin: 0;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
  }
}
</style>
