<template>
  <div class="publish-dialog">
    <el-dialog title="发布" :visible.sync="visible" append-to-body>
      <el-alert
        title="即将基于当前页面状态发布，发布后将可以通过专属连接访问。"
        type="info"
        :closable="false"
      ></el-alert>
      <div v-show="url" class="link-wrap">
        <span>链接地址：</span>
        <el-link :href="url" target="_blank" type="primary">{{ url }}</el-link>
        <el-link
          :underline="false"
          class="copy-btn"
          v-clipboard:copy="url"
          v-clipboard:success="onCopy"
        >
          <i class="iconfont icon-copy"></i>
        </el-link>
      </div>
      <div class="operations-box" slot="footer">
        <el-button type="primary" @click="publish">立即发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  name: 'Publish',
  data() {
    return {
      visible: false,
      url: '',
    };
  },
  methods: {
    ...mapActions('editor', ['publishNow']),
    show(data) {
      this.visible = true;
      console.log('publish', data);
    },
    async publish() {
      const url = await this.publishNow();
      if (url) {
        const origin = location.origin;
        this.url = origin + url;
      } else {
        this.$message.error('发布失败！');
      }
    },
    onCopy() {
      this.$message.success('已复制到剪切板');
    },
  },
};
</script>
<style scoped lang="scss">
.link-wrap {
  display: flex;
  padding: 16px 4px 4px;
  align-items: center;
  .copy-btn {
    padding: 0 8px;
  }
}
</style>
