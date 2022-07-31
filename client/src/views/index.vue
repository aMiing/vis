<template>
  <div class="entry">
    <header-bar></header-bar>
    <router-view class="main-content"></router-view>
  </div>
</template>
<script>
import headerBar from '@/components/header-bar.vue';
export default {
  name: 'root',
  components: { headerBar },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang="scss">
.main-content {
  position: absolute;
  width: 100%;
  height: 100%;
  padding-top: 36px;
  background: var(--grey-1);
}
</style>
