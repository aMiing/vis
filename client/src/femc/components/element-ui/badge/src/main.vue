<template>
  <div class="el-badge" :class="{ 'is-status': hasStatus }">
    <template v-if="hasStatus">
      <span class="el-badge__status-dot" :class="`--${status}`" :style="statusStyle"></span>
      <span class="el-badge__status-text">{{ text }}</span>
    </template>
    <template v-else>
      <slot></slot>
      <transition name="el-zoom-in-center">
        <sup
          v-show="!hidden && (content || content === 0 || isDot)"
          class="el-badge__content"
          :class="[
            'el-badge__content--' + type,
            {
              'is-fixed': $slots.default,
              'is-dot': isDot,
            },
          ]"
          v-text="content"
        ></sup>
      </transition>
    </template>
  </div>
</template>

<script>
export default {
  name: 'GBadge',

  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: [String, Number],
    // eslint-disable-next-line vue/require-default-prop
    max: Number,
    isDot: Boolean,
    hidden: Boolean,
    // eslint-disable-next-line vue/require-default-prop
    type: {
      type: String,
      validator(val) {
        return ['primary', 'success', 'warning', 'info', 'danger'].indexOf(val) > -1;
      },
    },
    // 设置为状态点
    // eslint-disable-next-line vue/require-default-prop
    status: {
      type: String,
      validator(val) {
        return ['success', 'processing', 'default', 'fail', 'pending'].indexOf(val) > -1;
      },
    },
    color: String,
    // eslint-disable-next-line vue/require-default-prop
    text: String,
  },

  computed: {
    hasStatus() {
      return (
        (this.status !== null && this.status !== undefined) ||
        (this.color !== null && this.color !== undefined)
      );
    },
    statusStyle() {
      return this.color ? { background: this.color } : '';
    },
    content() {
      if (this.isDot) return;

      const value = this.value;
      const max = this.max;

      if (typeof value === 'number' && typeof max === 'number') {
        return max < value ? `${max}+` : value;
      }

      return value;
    },
  },
};
</script>
