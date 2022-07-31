<template>
  <div
    class="el-steps"
    :class="[
      !simple && !block && 'el-steps--' + direction,
      simple && !block && 'el-steps--simple',
      simple && block && 'g-steps--block',
    ]"
  >
    <slot></slot>
  </div>
</template>

<script>
/*
 * 相较于原生element-steps，增加block主题配置
 * block起效需要同时开启 simple模式
 */
import Migrating from 'element-ui/lib/mixins/migrating';

export default {
  name: 'GSteps',

  mixins: [Migrating],

  props: {
    space: [Number, String],
    active: Number,
    direction: {
      type: String,
      default: 'horizontal',
    },
    alignCenter: Boolean,
    simple: Boolean,
    finishStatus: {
      type: String,
      default: 'finish',
    },
    processStatus: {
      type: String,
      default: 'process',
    },
    block: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      steps: [],
      stepOffset: 0,
    };
  },

  watch: {
    active(newVal, oldVal) {
      this.$emit('change', newVal, oldVal);
    },

    steps(steps) {
      steps.forEach((child, index) => {
        child.index = index;
      });
    },
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          center: 'center is removed.',
        },
      };
    },
  },
};
</script>
