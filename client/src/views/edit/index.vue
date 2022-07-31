<template>
  <div class="edit-page" @click.stop="contextmenuHide">
    <!-- 左侧区域 -->
    <!-- <div class="left-config__panel">
      <g-drag-box
        placement="right"
        span="0"
        min="0"
        max="400"
        collapse-button
        collapse2min
        :drag="true"
      >
        <materialList />
      </g-drag-box>
    </div> -->

    <!-- 中心舞台 -->
    <context-menu ref="menuRef" style="position: relative"></context-menu>
    <div class="stage-center">
      <div class="screen-content">
        <div class="screen-scroll-box">
          <div ref="screen-content__wrap" class="screen-content__wrap" :style="contentStyle">
            <mainScreen
              ref="main-screen"
              :screen="screen"
              :elements="elements"
              @updateParentStyle="updateParentStyle"
              @onActivated="onWidgetActivated"
              @handleContextmenuCallback="handleContextmenuCallback"
            />
          </div>
        </div>
        <!-- 缩放控制器 -->
        <div class="screen-content__operations">
          <g-operation-group :options="btnList" :iconOnly="true"></g-operation-group>
          <!-- <el-link :underline="false" @click="fullScreen">
            <i class="iconfont icon-full_screen"></i>
          </el-link> -->
          <el-link :underline="false" @click="addScale(-1)">
            <i class="iconfont icon-shanchu-fangkuang"></i>
          </el-link>
          <div class="scale-slider-wrap">
            <el-slider
              v-model="scale"
              :max="1"
              :min="0"
              :step="0.01"
              :show-tooltip="false"
              :marks="{ 1: '' }"
              @change="handleScaleChange"
            ></el-slider>
            <div class="scale-value">{{ scale.toFixed(2) }}</div>
          </div>
          <el-link :underline="false" @click="addScale(1)">
            <i class="iconfont icon-tianjia-fangkuang"></i>
          </el-link>
        </div>
      </div>
    </div>
    <!-- 右侧设置面板 -->
    <div class="right-config__panel">
      <g-drag-box
        placement="left"
        span="360"
        min="0"
        max="480"
        collapse-button
        collapse2min
        :drag="true"
      >
        <ConfigCenter
          :type="currentType"
          :value="screen"
          :activatedEl="activatedEl"
          :clickTarget="clickTarget"
          @updateSelectedTarget="onWidgetActivated"
        ></ConfigCenter>
      </g-drag-box>
    </div>
  </div>
</template>

<script>
import commonHeader from "./components/header";
import ConfigCenter from "./components/ConfigCenter";
import materialList from "./components/material";
import mainScreen from "./components/main-screen";
import detailMix from "@/mixins/detail";
import fullScreenMix from "@/mixins/fullScreen.js";
import { mapActions, mapMutations } from "vuex";
import { debounce, cloneDeep } from "lodash";
import contextMenu from "@/components/contxtMenu";
export default {
  name: "EditPage",
  components: {
    commonHeader,
    ConfigCenter,
    materialList,
    mainScreen,
    contextMenu,
  },
  mixins: [detailMix, fullScreenMix],
  data() {
    return {
      currentType: "screen",
      contentStyle: { width: "unset", height: "unset" },
      scale: 1,
      activatedEl: null, //当前激活的组件
      clickTarget: "screen",
      propsData: {},
      btnList: [
        {
          name: "全屏",
          iconClass: "iconfont icon-full_screen",
          click: () => this.fullScreen(),
        },
      ],
    };
  },
  computed: {
    pageComponents() {
      return cloneDeep(this.elements);
    },
    screenData() {
      return cloneDeep(this.screen);
    },
  },

  watch: {
    pageComponents: {
      handler(newV, oldV) {
        this.recordDataChange({ oldV, newV, type: "elements" });
      },
      deep: true,
    },
    screenData: {
      handler(newV, oldV) {
        this.recordDataChange({ oldV, newV, type: "screen" });
      },
      deep: true,
    },
  },
  created() {
    this.propsData = cloneDeep(this.screen);
  },
  async mounted() {
    this.$nextTick(() => {
      this.stageResize();
    });
    // 更新id
    const id = this.$route?.query?.id;
    this.updateId(id);
    await this.fetchData(id);
    this.startRecordHistory();
  },
  methods: {
    ...mapActions("editor", ["recordDataChange"]),
    updateParentStyle(scale) {
      const { width, height, sizeUnit } = this.screen;
      this.contentStyle["width"] = width * scale + sizeUnit;
      this.contentStyle["height"] = height * scale + sizeUnit;
    },
    stageResize() {
      debounce(() => {
        const { width: parentWidth, height: parentHeight } =
          this.$refs["screen-content__wrap"].getBoundingClientRect();
        const { width, height } = this.screen;
        this.scale = Math.min(parentWidth / width, parentWidth / height);
        this.$refs["main-screen"]?.updateScale(this.scale);
        this.updateParentStyle(this.scale);
      }, 300)();
    },
    handleScaleChange(val) {
      this.scale = val;
      this.$refs["main-screen"]?.updateScale(this.scale);
      this.updateParentStyle(this.scale);
    },
    onWidgetActivated(ele) {
      if (ele) {
        this.activatedEl = ele;
        this.clickTarget = "widget";
      } else this.clickTarget = "screen";
    },
    handleContextmenuCallback(e) {
      this.$refs.menuRef.show(e);
    },
    contextmenuHide() {
      this.$refs.menuRef.show(false);
    },
    addScale(plusMinus) {
      const newScale = this.scale + 0.1 * plusMinus;
      this.handleScaleChange(newScale);
    },
  },
};
</script>
<style scoped lang="scss">
.edit-page {
  display: flex;
  justify-content: space-between;
  overflow: hidden;

  .left-config__panel {
    background: var(--grey-3, #2e3857);
  }
  .right-config__panel {
    background: var(--grey-3, #2e3857);
  }
  .stage-center {
    flex: 1;
    overflow: hidden;
    margin: 20px 24px 12px;
  }
  .screen-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    .screen-scroll-box {
      flex: 1;
      overflow: auto;
    }
    .screen-content__wrap {
      position: relative;
    }
    .screen-content__operations {
      flex: 0 0 36px;
      display: flex;
      justify-content: flex-end;
      line-height: 36px;
      font-size: 12px;
      color: var(--grey-10);
      .iconfont {
        font-size: 16px;
      }
      .scale-slider-wrap {
        width: 30%;
        max-width: 240px;
        min-width: 100px;
        display: flex;
        padding: 0 4px;
        .el-slider {
          flex: 1;
        }
        .scale-value {
          padding-left: 8px;
          // width: 50px;
        }
      }
    }
  }

  ::v-deep {
    .drag-box__content {
      overflow: hidden;
    }
    .drag-box__icon {
      z-index: 999;
    }
  }
}
.menuClass {
  position: relative;
  display: block;
}
</style>
