<template>
  <div class="screen-list">
    <div class="menu-content">
      <el-tabs tab-position="left">
        <el-tab-pane label="全部大屏"></el-tab-pane>
        <el-tab-pane label="未分组"></el-tab-pane>
      </el-tabs>
    </div>

    <div class="card-list-content">
      <g-card-list v-loading="loading" min-width="300">
        <g-card
          v-for="card in panels"
          :key="card.id"
          class="card-custom-class"
          :title="card.title"
          :img="card.snapshot"
        >
          <template #meta1st>
            <span class="creator-box">{{ card.creator }}</span>
            <span class="update-time-box">
              {{ card.created_at | filterTime() }}
            </span>
          </template>
          <template #meta2nd>
            <div class="viewCount">
              <i class="iconfont icon-yulan"></i>
              <span class="count">{{ card.viewCount || 0 }}</span>
            </div>

            <div class="follow-content">
              <el-link :underline="false" @click="clickFollow(card)">
                <i
                  class="iconfont"
                  :class="card.followed ? 'icon-shoucang' : 'icon-shoucang-weidianji'"
                ></i>
              </el-link>
            </div>
          </template>
          <template #operator>
            <div class="g-card__operation">
              <g-operation-group :options="operationList" :data="card"></g-operation-group>
            </div>
          </template>
        </g-card>
      </g-card-list>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import screenConfig from '@/config/screen.js';
import UUID from '@/utils/uid';
import dayjs from 'dayjs';
import { userService } from '@/service';
import { panelService } from '../../../service';
const defaultImg = require('@/assets/images/bg.png');

export default {
  name: 'ScrrenList',
  filters: {
    filterTime(time) {
      return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '--';
    },
  },
  data() {
    return {
      loading: false,
      operationList: [
        {
          id: 1,
          name: '编辑',
          iconClass: 'iconfont icon-bianji',
          hidden: row => row.type === '1',
          click: row => this.goNextPage('edit', row),
        },
        {
          id: 3,
          name: '预览',
          iconClass: 'iconfont icon-yulan',
          hidden: row => row.type === '1',
          click: row => this.goNextPage('preview', row),
        },
        {
          id: 2,
          name: '删除',
          iconClass: 'iconfont icon-shanchu',
          hidden: row => row.type === '1',
          click: row => this.deleatePanel(row),
        },
      ],
    };
  },
  computed: {
    ...mapGetters('user', ['getUserInfo']),
    ...mapGetters('panels', { panels: 'getList' }),
  },
  created() {
    this.getPanelList();
  },
  methods: {
    ...mapActions('panels', ['getPanelList', 'addList', 'deleteDataById']),
    async addPanel(data) {
      const defaultModel = Object.keys(screenConfig).reduce((total, e) => {
        return Object.assign(total, { ...screenConfig[e]?.props });
      }, {});
      const newPanel = {
        // ...defaultModel,
        ...data,
        snapshot: defaultImg,
        id: UUID(),
        creator: this.getUserInfo?.userName,
        viewCount: 0,
        followed: 0,
      };
      await this.addList(newPanel);
      await this.getPanelList();
    },

    deleatePanel({ id }) {
      this.$confirm('此操作将删除该面板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await this.deleteDataById(id);
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
        await this.getPanelList();
      });
    },
    async clickFollow(row) {
      if (row.followed) {
        const { result } = await panelService.update({ id: row.id, followed: 0 });
        result === 0 && (row.followed = 0);
        this.$message.info('已取消收藏');
        // await this.getPanelList();
      } else {
        const { result } = await panelService.update({ id: row.id, followed: 1 });
        result === 0 && (row.followed = 1);
        this.$message.success('收藏成功！');
        // await this.getPanelList();
      }
    },

    goNextPage(name, row) {
      this.$router.push({
        name,
        query: {
          id: row.id,
          name: row?.title,
        },
      });
    },
    modifyPanelTitle(index) {
      this.$prompt('请输入新标题', '修改屏幕标题', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(({ value }) => {
          this.$message({
            type: 'success',
            message: '标题成功修改为: ' + value,
          });
          this.panels[index].title = value;
          //ajax向后台发送修改数据
          let url = 'http://localhost:8888/changeTitle';
          this.$http
            .post(url, { id: this.panels[index].id, value: value }, { emulateJSON: true })
            .then((req, res) => {
              console.log('保存修改到服务器');
            })
            .catch(err => {
              alert('页面数据可能与数据库不完全匹配，请刷新页面或联系系统维护人员！');
              return;
            });
          //定义一个提交修改的函数，这里调用
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改',
          });
        });
    },
  },
  async mounted() {
    // await userService.createUser({
    //   age: 120,
    //   name: '一个小锅仔',
    // });
  },
};
</script>

<style scoped lang="scss">
.screen-list {
  display: flex;
  flex: 1;
  overflow: hidden;
  .menu-content {
    flex: 0 0 120px;
  }
  .follow-content {
    .icon-shoucang {
      color: var(--yellow-6);
    }
  }
  .card-list-content {
    flex: 1;
    overflow: auto;
    .iconfont {
      font-size: 20px;
    }
  }
}
</style>
