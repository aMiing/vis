<template>
  <div class="el-affix" :style="containerStyle">
    <div :class="{ 'g-affix--fixed': fixed }" :style="affixStyle">
      <slot />
    </div>
  </div>
</template>

<script>
import { addResizeListener, removeResizeListener } from 'element-ui/lib/utils/resize-event';
import { rafThrottle } from 'element-ui/lib/utils/util';
import { isString, isHtmlElement } from 'element-ui/src/utils/types';
import { getScrollContainer } from 'element-ui/src/utils/dom';
import isNull from 'lodash/isNull';

export default {
  name: 'GAffix',
  props: {
    zIndex: {
      type: [Number, String],
      default: 100,
    },
    target: [Object, String],
    offset: {
      type: Number,
      default: 0,
    },
    position: {
      type: String,
      default: 'top',
    },
    scrollContainer: [Object, String],
  },
  data() {
    return {
      targetEl: null,
      currentScrollContainer: null,
      fixed: false,
      height: 0,
      width: 0,
      scrollTop: 0,
      clientHeight: 0,
      transformX: 0,
      transformY: 0,
      gap: null, // 间距
    };
  },
  computed: {
    containerStyle() {
      return {
        width: this.fixed ? `${this.width}px` : '',
        height: this.fixed ? `${this.height}px` : '',
      };
    },
    affixStyle() {
      if (!this.fixed) return;

      const offset = this.offset ? `${this.offset}px` : 0;
      const transform =
        this.transformX || this.transformY
          ? `translate(${this.transformX}px, ${this.transformY}px)`
          : '';

      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        top: this.position === 'top' ? offset : '',
        bottom: this.position === 'bottom' ? offset : '',
        transform,
        zIndex: this.zIndex,
      };
    },
  },
  watch: {
    fixed: {
      handler(val) {
        this.$emit('change', val);
      },
      deep: true,
    },
  },
  mounted() {
    this.init();
    this.initEvent();
  },
  beforeDestroy() {
    this.currentScrollContainer.removeEventListener('scroll', this.throttledScrollHandler);
    removeResizeListener(this.$el, this.updateStyle);
    this.targetEl && removeResizeListener(this.targetEl, this.updateStyle);
  },
  methods: {
    getContainer(el) {
      let dom = null;
      if (isHtmlElement(el)) {
        dom = el;
      } else if (isString(el)) {
        dom = document.querySelector(el);
      }
      return dom;
    },
    init() {
      const { scrollContainer, target = document.body } = this;
      this.targetEl = target && this.getContainer(target);
      this.currentScrollContainer =
        this.getContainer(scrollContainer) || getScrollContainer(this.$el);
    },
    initEvent() {
      this.throttledScrollHandler = rafThrottle(this.onScroll);
      this.currentScrollContainer.addEventListener('scroll', this.throttledScrollHandler);

      addResizeListener(this.$el, this.updateStyle);
      this.targetEl && addResizeListener(this.targetEl, this.updateStyle);
    },
    onScroll() {
      this.updateStyle();
      this.$emit('scroll', {
        scrollTop: this.scrollTop,
        fixed: this.fixed,
      });
    },
    updateStyle() {
      const { targetEl, currentScrollContainer } = this;
      if (!this.$el || !targetEl) return;

      const containerRect = this.$el.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      if (this.target && isNull(this.gap)) {
        this.gap =
          targetRect.width - containerRect.width > 0 ? targetRect.width - containerRect.width : 0;
      }

      this.width = this.target ? targetRect.width - this.gap : containerRect.width;
      this.height = containerRect.height;
      this.scrollTop =
        currentScrollContainer instanceof Window
          ? document.documentElement.scrollTop
          : currentScrollContainer.scrollTop;
      this.clientHeight = document.documentElement.clientHeight;

      const strategy = {
        top: (containerRect, targetRect) => {
          if (this.target) {
            const difference = targetRect.bottom - this.offset - this.height;
            this.fixed = this.offset > containerRect.top && targetRect.bottom > 0;
            this.transformX = -document.documentElement.scrollLeft;
            this.transformY = difference < 0 ? difference : 0;
          } else {
            this.fixed = this.offset > containerRect.top;
          }
        },
        bottom: (containerRect, targetRect) => {
          if (this.target) {
            const difference = this.clientHeight - targetRect.top - this.offset - this.height;
            this.fixed =
              this.clientHeight - this.offset < containerRect.bottom &&
              this.clientHeight > targetRect.top;
            this.transformX = -document.documentElement.scrollLeft;
            this.transformY = difference < 0 ? -difference : 0;
          } else {
            this.fixed = this.clientHeight - this.offset < containerRect.bottom;
          }
        },
      };

      strategy[this.position] && strategy[this.position](containerRect, targetRect);
    },
  },
};
</script>
