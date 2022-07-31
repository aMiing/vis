<template>
  <RecycleScroller
    class="g-big-text"
    :items="items"
    :item-size="itemHeight"
    :style="{ lineHeight: `${itemHeight}px`, fontSize: `${fontSize}px` }"
  >
    <template #default="{ item }">
      {{ item.value }}
    </template>
  </RecycleScroller>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller';
import debounce from 'lodash/debounce';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

export default {
  name: 'GBigText',
  components: { RecycleScroller },
  props: {
    source: { type: String, default: '' },
    itemHeight: { type: Number, default: 24 },
    fontSize: { type: Number, default: 16 },
    gap: { type: Number, default: 30 },
  },
  data() {
    return { rowWidth: 0 };
  },
  computed: {
    items() {
      return this.rowWidth > 0 ? this.transTextArray() : [];
    },
  },
  mounted() {
    this.setRowWidth();
    this.addEventListener();
  },
  methods: {
    addEventListener() {
      const handleResize = debounce(this.setRowWidth, 500);
      window.addEventListener('resize', handleResize);
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', handleResize);
      });
    },
    setRowWidth() {
      const el = this.$el;
      const BORDER_BOX = 'border-box';
      const {
        boxSizing,
        width: widthString,
        borderWidth: borderWidthString,
        paddingLeft: paddingLeftString,
        paddingRight: paddingRightString,
      } = window.getComputedStyle(el);

      const width = Number.parseFloat(widthString);
      const paddingLeft = Number.parseFloat(paddingLeftString);
      const paddingRight = Number.parseFloat(paddingRightString);
      const borderWidth = Number.parseFloat(borderWidthString);

      this.rowWidth =
        boxSizing === BORDER_BOX ? width - borderWidth * 2 - paddingLeft - paddingRight : width;
      // 如果是有滚轮就需要加上滚轮宽度
      if (el.scrollHeight > el.clientHeight) this.rowWidth += 8;
    },
    transTextArray() {
      const { source, fontSize, rowWidth, gap } = this;
      const arr = [];
      let i = 0;
      const len = ((rowWidth - gap) / fontSize) * 2;
      while (source[i]) {
        let j = 0;
        let value = '';
        while (j < len) {
          const item = source[i + j];
          if (item === undefined) break;
          const charCode = source.charCodeAt(i + j);
          value += item;
          j += charCode > 255 ? 2 : 1;
        }

        arr.push({ id: i, value });
        i += j;
      }

      return arr;
    },
  },
};
</script>

<style scoped>
.g-big-text {
  white-space: nowrap;
  height: 100%;
  letter-spacing: 0;
}
</style>
