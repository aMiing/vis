<template>
  <el-tooltip v-if="!banTooltip && hasEllipsis" v-bind="$attrs" :content="text">
    <div v-if="hasSlot" slot="content">
      <slot name="content"> </slot>
    </div>
    <div ref="content" class="text-ellipsis-content">
      {{ showText }}
    </div>
  </el-tooltip>
  <div v-else ref="content" class="text-ellipsis-content">
    {{ showText }}
  </div>
</template>

<script>
import { getActualWidthOfChars, getActualElementWidth } from './utils';
import debounce from 'lodash/debounce';
export default {
  name: 'GTextEllipsis',
  props: {
    text: {
      type: String,
      default: '',
    },
    dotOffsetLeft: {
      type: [Number, String],
      default: 0,
    },
    banTooltip: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showText: '',
      hasEllipsis: false,
    };
  },
  computed: {
    hasSlot() {
      return !!this.$slots.content;
    },
  },
  watch: {
    text() {
      this.showText = this.zipText();
    },
  },
  mounted() {
    this.showText = this.zipText();
    this.addEventListener();
  },

  methods: {
    addEventListener() {
      const handleResize = debounce(() => {
        this.showText = this.zipText();
      }, 300);
      window.addEventListener('resize', handleResize);
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', handleResize);
      });
    },
    zipText() {
      const el = this.$refs.content;
      const { fontSize, fontFamily } = window.getComputedStyle(el);
      const font = { size: Number.parseInt(fontSize), family: fontFamily };
      const rawText = this.text;
      // 多个空格合并
      const text = rawText.trim().replace(/(?<!\s)\s+(?!\s)/g, ' ');
      const parentWidth = getActualElementWidth(el);
      const realWidth = getActualWidthOfChars(text, font);
      if (parentWidth < realWidth) {
        this.hasEllipsis = true;
        const dotOffsetLeft = +this.dotOffsetLeft;
        const SEPARATOR = '...';
        const rightPart = text.slice(text.length - dotOffsetLeft);
        const rightPartWidth = getActualWidthOfChars(SEPARATOR + rightPart, font);
        let availableLeftWidth = Math.round(parentWidth - rightPartWidth);
        let final = '';
        let charIndex = 0;
        while (availableLeftWidth > 0) {
          const char = text[charIndex];
          let charWidth = getActualWidthOfChars(char, font);
          if (availableLeftWidth - charWidth < 0) break;
          final += char;
          availableLeftWidth -= charWidth;
          charIndex += 1;
        }
        final += `${SEPARATOR}${rightPart}`;
        return final;
      } else {
        this.hasEllipsis = false;
        return text;
      }
    },
  },
};
</script>
