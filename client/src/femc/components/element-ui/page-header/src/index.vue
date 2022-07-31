<template>
  <div class="g-page-header">
    <el-page-header
      :class="{ '--no-content': !currentRouteTitle, '--no-back': noBack }"
      :title="sourceRouteTitle"
      :content="currentRouteTitle"
      @back="back"
    >
      <template v-if="$slots.title" #title><slot name="title" /> </template>
      <template v-if="$slots.content" #content>
        <slot name="content" />
      </template>
    </el-page-header>
    <el-tooltip v-if="tip" :content="tip" placement="right"><tip /> </el-tooltip>
  </div>
</template>

<script>
import Tip from '../icon/tip.vue';
export default {
  name: 'GPageHeader',
  components: { Tip },
  props: {
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    defaultSourceRoute: { type: String, default: '' },
    backRouteOption: { type: Object, default: null },
    tip: { type: String, default: '' },
    beforeBack: { type: Function, default: null },
    noBack: { type: Boolean, default: false },
  },
  data() {
    return {
      sourceRoute: this.$route.query.sourceRoute,
    };
  },
  computed: {
    routeCnMap() {
      return this.$router
        .getRoutes()
        .reduce(
          (map, route) => (
            route.meta && route.meta.title && (map[route.name] = route.meta.title), map
          ),
          {}
        );
    },
    sourceRouteTitle() {
      return this.title || this.routeCnMap[this.sourceRoute || this.defaultSourceRoute];
    },
    currentRouteTitle() {
      return this.content || this.routeCnMap[this.$route.name];
    },
  },
  methods: {
    async back(option) {
      if (this.$listeners.back) {
        this.$listeners.back();
        return;
      }
      try {
        if (this.beforeBack && !(await this.beforeBack())) return;
        if (this.sourceRoute || this.defaultSourceRoute) {
          const route = { name: this.sourceRoute || this.defaultSourceRoute };
          Object.assign(route, option || this.backRouteOption);
          this.$router.push(route);
        } else this.$router.back();
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.g-page-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  .el-page-header {
    &.--no-content {
      ::v-deep .el-page-header__left {
        margin-right: 0;

        &::after {
          content: '';
        }
      }
    }

    &.--no-back {
      ::v-deep .el-page-header__left {
        display: flex;
        align-items: center;

        &::after {
          content: '';
          border-left: 2px solid var(--blue-6);
        }

        .el-icon-back,
        .el-page-header__title {
          display: none;
        }
      }
    }
  }
}
</style>
