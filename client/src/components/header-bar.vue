<template>
  <div class="header-bar">
    <div :span="4" class="logo-content" @click="clickLogo">
      <span class="big-logo">{{ sysName }}</span>
      <span class="version">v1.0.0尝鲜版</span>
    </div>

    <div v-if="isEdit" class="edit-header_content">
      <g-operation-group :options="editorBtnList" :iconOnly="true"></g-operation-group>
      <publish-dialog ref="publish-dialog"></publish-dialog>
    </div>
    <div v-else class="common-header_content">
      <g-operation-group :options="commonBtnList" :iconOnly="true"></g-operation-group>
      <div class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">欢迎你 {{ getUserInfo.userName }}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import operationsMix from "@/mixins/operations.js";
import publishDialog from "@/components/dialog/publish.vue";
export default {
  name: "HeaderBar",
  components: { publishDialog },
  mixins: [operationsMix],
  data() {
    return {
      sysName: "VMS-BD",
      sysUserName: "amingxiansen",
      sysUserAvatar: "",
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    isEdit() {
      return this.$route?.name === "edit";
    },
  },
  methods: {
    //退出登录
    logout: function () {
      this.$confirm("确认退出吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          this.$router.push("/login");
        })
        .catch(() => {});
    },
    onKeydown(e) {
      if (e.ctrlKey || e.metaKey) {
        if (e.shiftKey && e.key === "z") {
          this.canRedo && this.redo();
        } else if (e.key === "z") {
          // 这就是为什么要始终返回值，应为如果不返回，Promise会自动返回一个undefined，data就会被赋值，然后页面出问题
          this.canUndo && this.undo();
        }
      }
    },
    clickLogo() {
      this.$router.replace({ name: "root" }).catch(() => {});
    },
  },
  mounted() {
    this.updateTheme();
    window.addEventListener("keydown", this.onKeydown);
    // 利用hook，在监听的地方解绑监听
    this.$once("hook:beforeDestroy", () => window.removeEventListener("keydown", this.onKeydown));
  },
};
</script>
<style scoped lang="scss">
.header-bar {
  position: fixed;
  width: 100%;
  height: 36px;
  line-height: 36px;
  z-index: 99;
  background: var(--grey-8);
  color: var(--color-text-1);
  display: flex;
  justify-content: space-between;
  .logo-content {
    // text-align: center;
    padding: 0 20px;
    flex: 1;
    cursor: pointer;
    .big-logo {
      font-size: 20px;
    }
  }
  .edit-header_content {
    text-align: right;
    padding: 0 12px;
  }
  .common-header_content {
    display: flex;

    .userinfo {
      padding: 0 12px;
      .userinfo-inner {
        cursor: pointer;
        img {
          width: 20px;
          height: 20px;
          border-radius: 10px;
          margin: 5px;
          float: right;
        }
      }
    }
  }
}
</style>
