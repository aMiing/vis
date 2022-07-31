<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {},
};
</script>

<style lang="scss">
body {
  margin: 0px;
  padding: 0px;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  * {
    box-sizing: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    box-shadow: 0 0 0 1000px var(--input-bg) inset;
    -webkit-text-fill-color: var(--input-text-color);
    color: var(--input-text-color);
  }

  #app {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0;
    right: 0;
    background: #000;
  }

  .popover {
    padding: 8px 0;
  }
}
</style>
