<template>
  <div v-loading="loading" class="g-query-box" :style="{ height: tableScrollable ? '100%' : '' }">
    <div v-if="$slots.query" class="g-query-box__header">
      <el-form inline label-suffix=":">
        <slot name="query" />
        <el-form-item>
          <el-button type="primary" native-type="submit" @click.prevent="search()">搜索</el-button>
          <el-button native-type="reset" @click.prevent="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-else-if="$slots['query-without-search']" class="g-query-box__header">
      <slot name="query-without-search" />
    </div>

    <template v-if="!useEmpty || (data && data.length > 0)">
      <div :class="{ 'g-query-box__main': tableScrollable }">
        <slot :data="data" />
      </div>
      <div class="g-query-box__footer">
        <div class="g-query-box__footer-left">
          <slot name="pagination-operator" />
        </div>
        <el-pagination
          v-if="page.total > 10"
          v-bind="page"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
        <div v-else-if="page.total > 0" class="g-query-box__no-more">没有更多数据了~</div>
      </div>
    </template>
    <div v-else-if="showEmpty" class="g-query-box__empty">
      <slot v-if="$slots.error" name="error" />
      <g-empty v-else size="lg" img="空状态" title="暂无数据～" />
    </div>
  </div>
</template>

<script>
import { GEmpty } from '../../common';
import cloneDeep from 'lodash/cloneDeep';
import qs from 'qs';

const to = promise => promise.then(data => [null, data]).catch(err => [err]);

export default {
  name: 'GQueryBox',
  components: { GEmpty },
  props: {
    queryParams: { type: Object, default: () => ({}) },
    fetchMethod: { type: Function, default: () => {} },
    pagination: {
      type: Object,
      default: () => ({}),
    },
    keyOptions: {
      type: Object,
      default: () => ({ pageNum: 'pageNum', pageSize: 'pageSize' }),
    },
    banRequestWhileInit: {
      type: Boolean,
      default: false,
    },
    triggerLoading: {
      type: Boolean,
      default: false,
    },
    // 是否表单内部滚动
    tableScrollable: {
      type: Boolean,
      default: false,
    },
    banSaveParams: {
      type: Boolean,
      default: false,
    },
    clearSessionBeforeDestroy: {
      type: Boolean,
      default: null,
    },
    useEmpty: {
      type: Boolean,
      default: false,
    },
    keepNullStr: {
      type: Boolean,
      default: false,
    },
    banUrlParams: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pathname: null,
      routerName: null,
      loading: false,
      data: [],
      timer: null,
      cacheParams: null,
      showEmpty: this.banRequestWhileInit,
      // queryParams是脏数据，这个params才是真实的查询条件
      params: {},
      keyData: { pageNum: 'pageNum', pageSize: 'pageSize' },
      page: {
        layout: 'total, sizes, prev, pager, next, jumper',
        currentPage: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 30, 50],
      },
    };
  },
  computed: {
    keptInSession() {
      return this.clearSessionBeforeDestroy !== null;
    },
    id() {
      return `GDIOS__QUERY_${this.routerName}`;
    },
  },
  mounted() {
    // 缓存当前路由名称
    if (this.$route) this.routerName = this.$route.name;
    this.pathname = location.pathname;
    // 缓存初始值，用于重置
    this.cacheParams = cloneDeep(this.queryParams);
    this.mergeKeyOptions();
    this.mergePaginationOptions();
    this.handleQueryData();
    this.clearSession();
    if (!this.banRequestWhileInit) this.refresh({ keepCurrentPage: true });
  },
  methods: {
    handlePageChange(currentPage) {
      this.page.currentPage = currentPage;
      this.debounceRefresh({ keepCurrentPage: true });
    },
    handleSizeChange(size) {
      this.page.pageSize = size;
      this.debounceRefresh();
    },
    mergePaginationOptions() {
      this.page = { ...this.page, ...this.pagination };
    },
    mergeKeyOptions() {
      this.keyData = { ...this.keyData, ...this.keyOptions };
    },
    // keepCurrentPage 是否保留当前页
    debounceRefresh(options = {}) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.refresh(options);
      }, 300);
    },
    async refresh(options = {}) {
      const { recordCacheParams, keepCurrentPage } = options;
      // 需要记录缓存参数
      if (recordCacheParams) this.cacheParams = cloneDeep(this.params);
      // 不保留当前页码，就重置currentPage
      if (!keepCurrentPage) this.page.currentPage = 1;
      if (this.triggerLoading) this.loading = true;
      const { currentPage, pageSize } = this.page;
      let params = {};
      // 过滤掉空字符串、null和undefined
      Object.keys(this.params).forEach(key => {
        const val = this.params[key];
        let condition = val !== null && val !== undefined;
        if (!this.keepNullStr) condition = condition && val !== '';
        if (condition) params[key] = val;
      });
      const { pageSize: pageSizeKey, pageNum: pageNumKey } = this.keyData;
      params = { ...params, [pageNumKey]: currentPage, [pageSizeKey]: pageSize };
      const [err, data] = await to(this.fetchMethod(params));
      this.loading = false;
      if (err) return;
      // 没有取消保存的话就将数据存入query
      if (!this.banSaveParams) {
        this.replaceRoute(params);
        this.keptInSession && sessionStorage.setItem(this.id, JSON.stringify(params));
      }
      this.data = data.data;
      this.page.total = data.total;
      if (this.page.total === 0 || !this.data || this.data.length === 0) this.showEmpty = true;
      const totalPage = Math.ceil(this.page.total / this.page.pageSize);
      // 当删除的是最后一页的最后一条数据时，重新请求
      if (
        (!this.data || this.data.length === 0) &&
        this.page.total > 0 &&
        currentPage > totalPage
      ) {
        this.page.currentPage = totalPage || 1;
        this.refresh(options);
      }
    },
    search(options = {}) {
      this.params = cloneDeep(this.queryParams);
      this.debounceRefresh(options);
    },
    reset() {
      if (this.$listeners && this.$listeners.reset) {
        this.$emit('reset');
        this.cacheParams = cloneDeep(this.queryParams);
      } else {
        this.$emit('update:queryParams', cloneDeep(this.cacheParams));
      }

      this.params = cloneDeep(this.cacheParams);
      this.$nextTick(() => {
        this.debounceRefresh();
      });
    },
    replaceRoute(query = {}) {
      if (this.banUrlParams || !this.$route || !this.$router) return;

      // 缓存params
      const { params } = this.$route;
      let search = qs.stringify(query);
      if (search) search = `?${search}`;

      const { mode } = this.$router;
      let url = location.href;

      if (mode === 'hash') {
        const { hash, href } = location;
        const newHash = hash.replace(/\?.*$/, '');
        const hashIndex = href.indexOf(hash);
        const hrefWithoutHash = href.slice(0, hashIndex);
        url = hrefWithoutHash + newHash + search;
      }

      if (mode === 'history') {
        if (location.search) {
          url = location.href.replace(location.search, search);
        } else {
          // TODO, 待优化
          url = location.href + search;
        }
      }

      // 切换使用replaceState函数，location.replace在history模式下会重刷当前页面
      // params就是vue-router的params
      history.replaceState(params, '', url);
    },
    handleQueryData() {
      if (this.banSaveParams) {
        this.params = cloneDeep(this.queryParams);
        return;
      }
      const cacheQuery = this.keptInSession && sessionStorage.getItem(this.id);
      let query;
      if (cacheQuery) {
        query = JSON.parse(cacheQuery);
        this.replaceRoute(query);
      } else {
        const queryStr = location.hash || location.search;
        query = qs.parse(queryStr.split('?')?.[1] || '');
      }
      if (!query) return;
      const { pageNum: pageNumKey, pageSize: pageSizeKey } = this.keyOptions;
      let currentPage = query[pageNumKey];
      let pageSize = query[pageSizeKey];
      currentPage = Number(currentPage);
      pageSize = Number(pageSize);
      if (!Number.isNaN(currentPage)) this.page.currentPage = currentPage;
      if (!Number.isNaN(pageSize)) this.page.pageSize = pageSize;
      // 计算不准确的最大值，用来保证pagination正常显示
      const total = currentPage * pageSize;
      this.page.total = Number.isNaN(total) ? 0 : total;
      Object.assign(this.queryParams, cloneDeep(query));
      this.params = cloneDeep(this.queryParams);
    },
    clearSession() {
      this.$once('hook:beforeDestroy', () => {
        if (this.clearSessionBeforeDestroy) {
          sessionStorage.removeItem(this.id);
          /**
           * @description query置空
           * 1. routeName存在
           * 2. 离开的页面和当前页面一致（没有切换页面）
           * 3. 离开的pathname和当前pathname一致（没有切换项目）
           */
          if (
            this.$route &&
            this.$route.name &&
            this.routerName === this.$route.name &&
            this.pathname === location.pathname
          )
            this.replaceRoute();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.g-query-box {
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__main {
    flex: 1;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;

    ::v-deep {
      .el-table {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .el-table__body-wrapper {
        flex: 1;
        overflow-y: auto;
      }
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    padding: 16px;
  }

  &__empty {
    flex: 1;
    padding: 16px;
  }

  &__no-more {
    width: 100%;
    text-align: center;
    color: var(--grey-10);
  }
}
</style>
