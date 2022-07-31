<template>
  <div
    class="drag-box"
    :class="{ [`--${placement}`]: true, '--animate': animate }"
    :style="boxStyle"
    @transitionend.self="handleTransitionend"
  >
    <div
      v-show="collapse2min ? true : !collapse"
      class="drag-box__border"
      :class="{ '--hover': hover }"
      :style="{ zIndex: collapse2min ? '' : '1' }"
      title="可拖拽侧边栏"
      @mousedown="handleMousedown"
    />
    <div v-if="collapseButton" class="drag-box__icon" :style="iconStyle" @click="handleCollapse">
      <ladder draggable="false" />
      <i class="el-icon-arrow-left" />
    </div>
    <div class="drag-box__content">
      <slot :collapse="collapse" />
    </div>
  </div>
</template>

<script>
import Ladder from './ladder.vue';
import debounce from 'lodash/debounce';

export default {
  name: 'GDragBox',
  components: { Ladder },
  props: {
    placement: {
      type: String,
      default: 'right',
    },
    collapseButton: {
      type: Boolean,
      default: false,
    },
    min: {
      type: [Number, String],
      default: 240,
    },
    max: {
      type: [Number, String],
      default: 480,
    },
    span: {
      type: [Number, String],
      default: 240,
    },
    sticky: {
      type: [Boolean, Number],
      default: false,
    },
    collapse2min: {
      type: Boolean,
      default: false,
    },
    drag: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      collapse: false,
      iconOffset: 0,
      animate: false,
      size: {},
      triggerBySelf: false,
    };
  },
  computed: {
    isHorizontal() {
      return ['left', 'right'].includes(this.placement);
    },
    boxStyle() {
      const { isHorizontal, size, collapse, collapse2min, min } = this;
      const minSpan = collapse2min ? min : 0;
      let computedSpan = collapse ? minSpan : size.span;
      computedSpan += 'px';
      const [width, height] = isHorizontal ? [computedSpan, '100%'] : ['100%', computedSpan];
      return { width, height };
    },
    iconStyle() {
      const { placement, iconOffset, collapse } = this;
      const strategy = {
        left: `translateY(-50%) rotate(${collapse ? 0 : 180}deg)`,
        right: `translateY(-50%) rotate(${collapse ? 180 : 0}deg)`,
        top: `translateX(-50%) rotate(${collapse ? 90 : -90}deg)`,
        bottom: `translateX(-50%) rotate(${collapse ? -90 : 90}deg)`,
      };

      const transform = strategy[placement] || strategy.right;
      return { transform, [placement]: iconOffset + 'px' };
    },
    hover() {
      if (!this.drag) return false;
      if (this.collapse2min) return true;
      return !this.collapse;
    },
  },
  watch: {
    collapse(val) {
      this.$emit('collapse', val);
    },
    'size.span': {
      immediate: true,
      handler() {
        if (!this.collapse2min) return;
        this.collapse = this.size.span <= this.size.min;
        this.iconOffset = this.collapse ? -12 : 0;
      },
    },
  },
  mounted() {
    this.setSize();
    const handleResize = debounce(this.setSize, 300);

    window.addEventListener('resize', handleResize);
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', handleResize);
    });
  },
  methods: {
    setSize(isResize) {
      if (this.triggerBySelf) {
        this.triggerBySelf = !this.triggerBySelf;
        return;
      }
      const { min: rawMin, max: rawMax, span: rawSpan, size } = this;

      let span = isResize ? size.span : this.transRaw2Pixel(rawSpan);
      const min = this.transRaw2Pixel(rawMin);
      const max = this.transRaw2Pixel(rawMax);
      if (size.span > max) span = max;
      if (size.span < min) span = min;

      this.size = { min, max, span };
    },
    async handleCollapse() {
      this.animate = true;
      await this.$nextTick();

      this.collapse = !this.collapse;
      this.iconOffset = this.collapse ? -12 : 0;

      if (this.collapse2min && !this.collapse && this.size.span <= this.size.min) {
        const direction = this.isHorizontal ? 'width' : 'height';
        this.size.span = this.size.max;
        this.$el.style[direction] = this.size.span + 'px';
      }
    },
    handleMousedown(e) {
      if (!this.drag || (!this.collapse2min && this.collapse)) return;
      const { clientX: startX, clientY: startY } = e;
      const { width, height } = this.$el.getBoundingClientRect();
      const dragBox = this.$el;

      const getSpan = e => {
        const { clientX, clientY } = e;
        const strategy = {
          left: width + startX - clientX,
          right: width + clientX - startX,
          top: height + startY - clientY,
          bottom: height + clientY - startY,
        };
        return strategy[this.placement] || strategy.right;
      };

      const mousemove = e => {
        let span = getSpan(e);
        span = span > this.size.max ? this.size.max : span;
        span = span < this.size.min ? this.size.min : span;
        const direction = this.isHorizontal ? 'width' : 'height';
        this.size.span = span;
        dragBox.style[direction] = this.size.span + 'px';
      };

      const mouseup = e => {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
        const typeofSticky = typeof this.sticky;

        if (typeofSticky === 'number' || (typeofSticky === 'boolean' && this.sticky)) {
          const span = getSpan(e);
          const stickySpan = typeofSticky === 'number' ? this.sticky : 30;
          if (span - this.size.min < stickySpan) {
            this.size.span = this.size.min;
            const direction = this.isHorizontal ? 'width' : 'height';
            dragBox.style[direction] = this.size.span + 'px';
          }
        }

        this.dispatchResize();
      };
      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup);
    },
    transRaw2Pixel(raw) {
      const rawStr = String(raw);
      // 百分比
      if (rawStr.endsWith('%')) {
        const { width, height } = this.$el.parentNode.getBoundingClientRect();
        const percent = rawStr.slice(0, -1);
        const span = this.isHorizontal ? width : height;
        return (span * percent) / 100;
      }

      // 以px结尾去除px
      if (rawStr.endsWith('px')) return Number(rawStr.slice(0, -2));
      return Number(rawStr);
    },
    dispatchResize() {
      this.triggerBySelf = true;
      window.dispatchEvent(new Event('resize'));
    },
    async handleTransitionend() {
      this.animate = false;
      await this.$nextTick();
      this.dispatchResize();
    },
  },
};
</script>

<style lang="scss" scoped>
$dragOffset: 8px;
$dragSpan: 10px;
$iconWidth: 12px;
$iconHeight: 80px;

.drag-box {
  position: relative;

  &.--animate {
    transition: all 0.1s ease-in-out;
  }

  &__border {
    position: absolute;
    user-select: none;
  }

  &__icon {
    position: absolute;
    font-size: 12px;
    color: var(--grey-11, #9dacd1);
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;

    i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    img {
      width: $iconWidth;
      height: $iconHeight;
      user-select: none;
    }

    &:hover {
      cursor: pointer;
    }
  }

  &__content {
    width: 100%;
    height: 100%;
  }

  &.--left,
  &.--right {
    .drag-box__border {
      width: $dragSpan;
      height: 100%;

      &.--hover:hover {
        cursor: ew-resize;
      }
    }

    .drag-box__icon {
      width: $iconWidth;
      height: $iconHeight;
      top: 50%;
    }
  }

  &.--top,
  &.--bottom {
    .drag-box__border {
      width: 100%;
      height: $dragSpan;

      &.--hover:hover {
        cursor: ns-resize;
      }
    }

    .drag-box__icon {
      width: $iconHeight;
      height: $iconWidth;
      left: 50%;
    }
  }

  &.--left {
    .drag-box__border {
      left: -$dragOffset;
    }
  }

  &.--right {
    .drag-box__border {
      right: -$dragOffset;
    }
  }

  &.--top {
    .drag-box__border {
      top: -$dragOffset;
    }
  }

  &.--bottom {
    .drag-box__border {
      bottom: -$dragOffset;
    }
  }
}
</style>
