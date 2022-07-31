<template>
  <div class="container">
    <div class="banner">
      <el-carousel :interval="5000" indicator-position="none" arrow="never">
        <el-carousel-item v-for="item in bannerImg" :key="item.name">
          <img :src="item.img" alt="" width="100%" height="120%" />
        </el-carousel-item>
      </el-carousel>

      <!-- 导航栏 -->
      <div class="menu-expanded">
        <!--导航菜单-->
        <el-menu
          :default-active="$route.path"
          mode="horizontal"
          class="el-menu-vertical-demo"
          unique-opened
          router
        >
          <el-menu-item v-for="item in menuList" :key="item.name" :index="item.path">
            <i :class="item.meta.iconCls"></i>
            {{ item.meta.label }}
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <!-- 主区域呈现 -->
    <div class="content-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
const bannerImg = require("@/assets/images/banner.png");
import { menuList } from "@/router/menu";
export default {
  data() {
    return {
      menuList,
      bannerImg: [
        { name: "test1", img: bannerImg },
        { name: "test2", img: bannerImg },
        { name: "test3", img: bannerImg },
      ],
    };
  },
  mounted() {},
  methods: {},
};
</script>
<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  .banner {
    width: 100%;
    height: 29%;
    overflow: hidden;
  }

  .menu-expanded {
    position: absolute;
    top: 25%;
    z-index: 99;
    margin-left: 16px;
  }

  .content-container {
    flex: 1;
    overflow: hidden;
    padding: 8px 16px;
  }
}
</style>
