<template>
  <div class="attributes">
    <el-form label-width="45px">
      <template v-for="(value, key) in screenConfig">
        <component :key="key" :is="getComponent(key)" :data="model || value.props"></component>
      </template>
    </el-form>
  </div>
</template>

<script>
import componentTokens from "../tokens/index";
import screenConfig from "@/config/screen.js";

export default {
  name: "Attributes",
  props: {
    model: {
      default: () => ({}),
      type: Object,
    },
  },
  components: { ...componentTokens },
  data() {
    return {
      screenConfig,
    };
  },
  mounted() {},
  methods: {
    getComponent(key) {
      const transMap = {
        title: "commonText",
        link: "linkConf",
      };
      return transMap[key] || key;
    },
  },
};
</script>
<style scoped lang="scss"></style>
