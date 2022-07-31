<template>
  <div class="g-scrollbar" @mousemove="handleMouseMove" @mouseout="handleMouseOut">
    <div ref="scrollbar" class="g-scrollbar__wrapper" @scroll="handleScroll" v-on="$listeners">
      <div ref="content" class="g-scrollbar__content">
        <slot />
      </div>
    </div>
    <div class="g-scrollbar__rail --vertical">
      <div
        class="g-scrollbar__slider"
        :style="yStyle"
        @mousedown="handleMouseDown($event, 'y')"
      ></div>
    </div>
    <div class="g-scrollbar__rail --horizontal">
      <div
        class="g-scrollbar__slider"
        :style="xStyle"
        @mousedown="handleMouseDown($event, 'x')"
      ></div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';

export default {
  name: 'GScrollbar',
  props: {
    contentWidth: { type: [Number, String], default: '100%' },
  },
  data() {
    return {
      x: {
        opacity: 0,
        size: 0,
        offset: 0,
        ratio: 0,
        mousedown: false,
      },
      y: {
        opacity: 0,
        size: 0,
        offset: 0,
        ratio: 0,
        mousedown: false,
      },
      wrapper: {
        width: 0,
        height: 0,
      },
    };
  },
  computed: {
    xStyle() {
      return this.genStyle('x');
    },
    yStyle() {
      return this.genStyle('y');
    },
    width() {
      const width = Number(this.contentWidth);
      if (!Number.isNaN(width)) return `${width}px`;
      return this.contentWidth;
    },
  },
  watch: {
    width() {
      this.initScrollbar();
    },
  },
  mounted() {
    this.initScrollbar();
    this.onResize();
  },
  methods: {
    genStyle(direction) {
      const { opacity, size, offset, mousedown } = this[direction];
      const backgroundColor = mousedown ? 'var(--scrollbar-thrumb-bg-hover)' : void 0;
      const [sizeKey, offsetKey] = direction === 'x' ? ['width', 'left'] : ['height', 'top'];
      return { opacity, backgroundColor, [sizeKey]: `${size}px`, [offsetKey]: `${offset}px` };
    },
    handleScroll(e) {
      const { scrollLeft, scrollTop } = e.target;
      this.y.offset = scrollTop * this.y.ratio;
      this.x.offset = scrollLeft * this.x.ratio;
    },
    initScrollbar() {
      const { scrollbar, content } = this.$refs;
      const { width, height } = scrollbar.getBoundingClientRect();
      const { width: cWidth, height: cHeight } = content.getBoundingClientRect();
      this.wrapper.width = width;
      this.wrapper.height = height;
      this.y.ratio = height / cHeight;
      this.x.ratio = width / cWidth;
      const sliderHeight = height * this.y.ratio;
      const sliderWidth = width * this.x.ratio;
      this.x.size = sliderWidth >= width ? 0 : sliderWidth;
      this.y.size = sliderHeight >= height ? 0 : sliderHeight;
    },
    handleMouseMove() {
      if (this.x.opacity === 0) this.x.opacity = 1;
      if (this.y.opacity === 0) this.y.opacity = 1;
    },
    handleMouseOut() {
      if (this.y.mousedown || this.x.mousedown) return;
      this.y.opacity = 0;
      this.x.opacity = 0;
    },
    handleMouseDown(e, direction) {
      const { clientX, clientY } = e;
      const offset = this[direction].offset;
      const start = direction === 'x' ? clientX : clientY;
      const config = this[direction];
      config.mousedown = true;

      const mousemove = e => {
        const { clientX, clientY } = e;
        const diff = (direction === 'x' ? clientX : clientY) - start;
        const calc = offset + diff;
        const [wrapperKey, position] = direction === 'x' ? ['width', 'left'] : ['height', 'top'];
        const max = this.wrapper[wrapperKey] - config.size;
        config.offset = calc < 0 ? 0 : calc > max ? max : calc;
        this.$refs.scrollbar.scrollTo({ [position]: config.offset / config.ratio });
      };

      const mouseup = e => {
        config.mousedown = false;
        if (!this.isInContainer(e.target)) config.opacity = 0;
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
      };

      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup);
    },
    isInContainer(el) {
      const root = this.$el;
      if (root.compareDocumentPosition)
        return root === el || !!(root.compareDocumentPosition(el) & 16);

      if (root.contains && el.nodeType === 1) {
        return root.contains(el) && root !== el;
      }

      while ((el = el.parentNode)) if (el === root) return true;

      return false;
    },
    onResize() {
      const debounceResize = debounce(this.initScrollbar, 300);
      window.addEventListener('resize', debounceResize);
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', debounceResize);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.g-scrollbar {
  overflow: hidden;
  position: relative;
  z-index: auto;
  height: 100%;
  width: 100%;

  &__wrapper {
    width: 100%;
    overflow: scroll;
    height: 100%;
    max-height: inherit;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
    }
  }

  &__rail {
    position: absolute;
    pointer-events: none;
    user-select: none;

    &.--vertical {
      right: 4px;
      top: 0;
      bottom: 0;
      width: 8px;

      .g-scrollbar__slider {
        width: 100%;
      }
    }

    &.--horizontal {
      bottom: 4px;
      left: 0;
      right: 0;
      height: 8px;

      .g-scrollbar__slider {
        height: 100%;
      }
    }
  }

  &__slider {
    position: absolute;
    pointer-events: all;
    background-color: var(--scrollbar-thrumb-bg);
    border-radius: var(--s-4);
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background-color: var(--scrollbar-thrumb-bg-hover);
    }
  }

  &__content {
    width: fit-content;
  }
}
</style>
