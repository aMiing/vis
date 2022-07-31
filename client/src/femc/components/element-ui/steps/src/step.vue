<template>
  <div
    class="el-step"
    :style="style"
    :class="[
      !isSimple && `is-${$parent.direction}`,
      isSimple && 'is-simple',
      isLast && !space && !isCenter && !isBlock && 'is-flex',
      isCenter && !isVertical && !isSimple && 'is-center',
      isBlock && 'is-block',
      isBlock && index && `is-${currentStatus}-block-before`,
      isBlock && !isLast && nextStatus !== 'process' && `is-${currentStatus}-block-after`,
      isBlock && !isLast && nextStatus === 'process' && `next-process-block-after`,
    ]"
  >
    <!-- icon & line -->
    <div class="el-step__head" :class="[`is-${currentStatus}`, `${position}-step`]">
      <div class="el-step__icon" :class="`is-${icon ? 'icon' : 'text'}`">
        <slot v-if="currentStatus !== 'success' && currentStatus !== 'error'" name="icon">
          <i v-if="icon" class="el-step__icon-inner iconfont" :class="[icon]"></i>
          <div v-if="!icon" class="el-step__icon-inner">{{ index + 1 }}</div>
        </slot>
        <i
          v-else
          :class="['el-icon-' + (currentStatus === 'success' ? 'check' : 'close')]"
          class="el-step__icon-inner is-status"
        >
        </i>
      </div>
    </div>
    <!-- title & description -->
    <div class="el-step__main">
      <div ref="title" class="el-step__title" :class="['is-' + currentStatus]">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="isSimple && !isBlock" class="el-step__arrow"></div>
      <div v-else-if="description" class="el-step__description" :class="['is-' + currentStatus]">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GStep',

  props: {
    stepIndex: Number,
    width: [Number, String],
    title: String,
    icon: String,
    description: String,
    status: String,
    position: {
      type: String,
      default: 'second',
    },
  },

  data() {
    return {
      index: -1,
      lineStyle: {},
      internalStatus: '',
    };
  },
  computed: {
    currentStatus() {
      return this.status || this.internalStatus;
    },
    prevStatus() {
      const prevStep = this.$parent.steps[this.index - 1];
      return prevStep ? prevStep.currentStatus : 'wait';
    },
    nextStatus() {
      const prevStep = this.$parent.steps[this.index + 1];
      return prevStep ? prevStep.currentStatus : 'pass';
    },
    isCenter() {
      return this.$parent.alignCenter;
    },
    isVertical() {
      return this.$parent.direction === 'vertical';
    },
    isSimple() {
      return this.$parent.simple;
    },
    isBlock() {
      return this.$parent.block;
    },
    isFixedWidth() {
      return this.width != null;
    },
    isLast() {
      const parent = this.$parent;
      return parent.steps[parent.steps.length - 1] === this;
    },
    stepsCount() {
      return this.$parent.steps.length;
    },
    space() {
      const {
        isSimple,
        $parent: { space },
      } = this;
      return isSimple ? '' : space;
    },
    style: function () {
      const style = {};
      const parent = this.$parent;
      const len = parent.steps.length;
      let space;
      if (typeof this.space === 'number') {
        space = this.space + 'px';
      } else if (this.space) {
        space = this.space;
      } else {
        space = 100 / (len - (this.isCenter ? 0 : 1)) + '%';
      }
      if (this.isFixedWidth && this.isBlock) {
        style.width =
          typeof this.width === 'number' && !isNaN(this.width) ? this.width + 'px' : this.width;
      } else {
        style.flexBasis = !this.isBlock ? space : 100 / this.stepsCount + '%';
        if (this.isVertical) return style;
        if (this.isBlock) {
          style.maxWidth = 100 / this.stepsCount + '%';
        } else {
          if (this.isLast) {
            style.maxWidth = 100 / this.stepsCount + '%';
          } else {
            style.marginRight = -this.$parent.stepOffset + 'px';
          }
        }
      }
      style.zIndex = len - this.index;

      return style;
    },
  },
  created() {
    if (this.stepIndex != null) {
      (this.$parent.steps || []).splice(this.stepIndex, 0, this);
    } else {
      (this.$parent.steps || []).push(this);
    }
  },
  beforeDestroy() {
    const steps = this.$parent.steps;
    const index = steps.indexOf(this);
    if (index >= 0) {
      steps.splice(index, 1);
    }
  },
  mounted() {
    const unwatch = this.$watch('index', () => {
      this.$watch('$parent.active', this.updateStatus, { immediate: true });
      this.$watch('$parent.steps', () => {
        const activeIndex = this.$parent.active;
        this.updateStatus(activeIndex);
      });
      this.$watch(
        '$parent.processStatus',
        () => {
          const activeIndex = this.$parent.active;
          this.updateStatus(activeIndex);
        },
        { immediate: true }
      );
      unwatch();
    });
  },

  methods: {
    updateStatus(val) {
      const prevChild = this.$parent.$children[this.index - 1];

      if (val > this.index) {
        this.internalStatus = this.$parent.finishStatus;
      } else if (val === this.index && this.prevStatus !== 'error') {
        this.internalStatus = this.$parent.processStatus;
      } else {
        this.internalStatus = 'wait';
      }

      if (prevChild) prevChild.calcProgress(this.internalStatus);
    },

    calcProgress(status) {
      let step = 100;
      const style = {};

      style.transitionDelay = 150 * this.index + 'ms';
      if (status === this.$parent.processStatus) {
        step = this.currentStatus !== 'error' ? 0 : 0;
      } else if (status === 'wait') {
        step = 0;
        style.transitionDelay = -150 * this.index + 'ms';
      }

      style.borderWidth = step && !this.isSimple ? '1px' : 0;
      this.$parent.direction === 'vertical'
        ? (style.height = step + '%')
        : (style.width = step + '%');

      this.lineStyle = style;
    },
  },
};
</script>
