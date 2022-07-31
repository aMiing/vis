<template>
  <div class="common-header">
    <el-col :span="3" class="backBtn">
      <el-link href="/">{{ sysName }}</el-link>
    </el-col>
    <!-- 控件组 -->
    <div class="widgetGroup">
      <!-- 组件列表 -->
      <widgetsList />
    </div>

    <el-col :span="12" class="userinfo">
      <el-button
        id="saveBtn"
        type="text"
        @click="saveChange()"
        size="medium"
        title="保存"
        ><i class="iconfont icon-baocun1"></i
      ></el-button>
      <el-popover
        class="navbar-item"
        placement="bottom-start"
        size=""
        width="200"
        trigger="hover"
        content="没有任何异常"
      >
        <el-button type="text" slot="reference" size="medium" title="异常"
          ><i class="iconfont icon-warning navbar-item"></i
        ></el-button>
      </el-popover>
      <el-dropdown trigger="hover" class="navbar-item">
        <div>
          <i></i>
          <el-button
            type="text"
            size="medium"
            class="el-dropdown-link"
            title="帮助"
            ><i class="iconfont icon-icon navbar-item"></i
          ></el-button>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>帮助文档</el-dropdown-item>
          <el-dropdown-item>提交工单</el-dropdown-item>
          <el-dropdown-item>社区论坛</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="text" size="medium" title="发布"
        ><i class="iconfont icon-fabu navbar-item"></i
      ></el-button>
      <el-button type="text" @click="previewIt()" size="medium" title="预览"
        ><i class="iconfont icon-yulan navbar-item"></i
      ></el-button>
    </el-col>
  </div>
</template>

<script>
import widgetsList from "./widgets";
export default {
  components: {
    widgetsList,
  },
  data() {
    return {
      sysName: "VMS面板",
    };
  },
};
</script>

<style scoped lang="scss">
.common-header {
  height: 40px;
  background: #1b1f25;
  color: #fff;

  .widgetGroup {
    position: absolute;
    left: 200px;
    z-index: 9;
    width: 600px;
    text-align: center;
    color: #fff;
    height: 40px;
    .el-menu--horizontal .el-menu-item {
      float: left;
      width: 33%;
      height: 45px;
      line-height: 45px;
      background-color: #373d41;
      color: #333;
      .el-menu {
        background-color: #373d41;
      }
    }
  }
  .userinfo {
    text-align: right;

    padding-right: 50px;
    float: right;
    .userinfo-inner {
      cursor: pointer;
      color: #fff;
      img {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        margin: 10px 0px 10px 10px;
        float: right;
      }
    }
  }
  .backBtn {
    height: 40px;
    line-height: 40px;
    font-size: 22px;
    padding: 0 20px;
    img {
      width: 40px;
      float: left;
      margin: 10px 10px 10px 18px;
    }
    .txt {
      color: #fff;
    }
  }
  .backBtn-width {
    width: 150px;
  }
  .tools {
    padding: 0px 23px;
    width: 14px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
  }
}
</style>