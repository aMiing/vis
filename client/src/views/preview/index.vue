<template>
  <div class="screen-content__wrap" ref="screen-content__wrap">
    <div class="main-screen" ref="main-screen" :style="screenConfig">
      <div
        v-for="item in elements"
        :key="item.id"
        class="component-wrap"
        style="position: absolute"
        :style="{
          width: item.width + item.sizeUnit,
          height: item.height + item.sizeUnit,
          left: item.posX + item.positionUnit,
          top: item.posY + item.positionUnit,
          zIndex: item.zIndex,
        }"
      >
        <component :key="item.id" :is="item.name" :data="transStyle(item)"></component>
      </div>
    </div>
  </div>
</template>
<script>
import detailMix from '@/mixins/detail';
import fullScreenMix from '@/mixins/fullScreen.js';
import modules from '@/components/widgets/index.js';
import { debounce } from 'lodash';
export default {
  name: 'PreviewPage',
  mixins: [detailMix, fullScreenMix],
  components: {
    ...modules,
  },
  data() {
    return {
      scale: 1,
    };
  },
  created() {
    const pageName = this.$route?.name;
    let id = this.$route?.query?.id;
    const publishId = this.$route?.params?.publishId;
    // 根据publishId 查询 screenId
    if (pageName === 'page' && publishId) {
      id = publishId;
    }
    if (id) {
      this.updateId(id);
      this.fetchData(id);
    }
  },
  async mounted() {
    await this.$nextTick();
    const debounceResize = debounce(this.stageResize, 300);
    setTimeout(debounceResize, 300);
    this.$once('hook:beforeDestroy', () => window.removeEventListener('resize', debounceResize));
  },

  computed: {
    screenConfig() {
      const { width, height, sizeUnit = 'px', fontSize, fontUnit } = this.screen;
      return {
        ...this.screen,
        width: width + sizeUnit,
        height: height + sizeUnit,
        fontSize: fontSize + fontUnit,
        transform: `scale(${this.scale})`,
        transition: 'all 0.3s',
      };
    },
  },
  methods: {
    stageResize() {
      const { width: parentWidth, height: parentHeight } =
        this.$refs['screen-content__wrap'].getBoundingClientRect();
      const { width, height } = this.screen;
      this.scale = Math.min(parentWidth / width, parentHeight / height);
    },
    transStyle(data) {
      const fontSize = data.fontSize && data.fontSize + (data?.fontUnit || 'px');
      const borderWidth =
        data.borderWidth &&
        data.borderWidth.map(e => (e || 0) + (data?.borderUnit || 'px')).join(' ');
      const borderStyle = data.borderStyle && data.borderStyle.filter(e => !!e).join(' ');
      const borderColor = data.borderColor && data.borderColor.filter(e => !!e).join(' ');
      const borderRadius =
        data.borderRadius &&
        data.borderRadius.map(e => (e || 0) + (data?.borderRadiusUnit || 'px')).join(' ');
      const padding =
        data.padding && data.padding.map(e => (e || 0) + (data?.paddingUnit || 'px')).join(' ');
      const width = data.width && data.width + (data.sizeUnit || 'px');
      const height = data.height && data.height + (data.sizeUnit || 'px');
      return {
        ...data,
        fontSize,
        borderWidth,
        borderStyle,
        borderColor,
        borderRadius,
        padding,
        width,
        height,
      };
    },
  },
};
</script>
<style scoped lang="scss">
.screen-content__wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .main-screen {
    position: absolute;
    flex-shrink: 0;
    flex-grow: 1;
  }
}
</style>
