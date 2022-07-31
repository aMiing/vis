<template>
  <div v-if="readonly" class="g-time-picker__input">
    <el-input
      ref="input"
      :value="value"
      :class="{ 'is-active': visible, '--readonly': readonly }"
      placeholder="请选择时间"
      suffix-icon="el-icon-time"
      readonly
      @change="handleInputChange"
      @keyup.native.prevent.stop="handleKeyup"
      @keypress.native.prevent.stop
      @keydown.native.prevent.stop
    />
  </div>
  <el-popover
    v-else
    v-model="visible"
    width="166"
    popper-class="g-time-picker"
    @after-enter="handlePopoverShow"
    @after-leave="handlePopoverHide"
  >
    <div class="g-time-picker__wrapper">
      <div class="g-time-picker__main">
        <scrollbar
          v-for="(col, i) in data"
          ref="colRef"
          :key="col.id"
          class="g-time-picker__col"
          wrap-class="g-time-picker__col-wrapper"
          @scroll="e => handleItemScroll(e, i)"
        >
          <div
            v-for="(num, j) in col.nums"
            :key="num"
            class="g-time-picker__item"
            :class="{ '--active': j === activedItems[i] }"
            @click="handleItemClick(i, j)"
          >
            {{ num }}
          </div>
        </scrollbar>
      </div>
      <div class="g-time-picker__footer">
        <span class="g-time-picker__cancel" @click="cancel">取消</span>
        <span class="g-time-picker__ok" @click="ok">确定</span>
      </div>
    </div>
    <template #reference>
      <div class="g-time-picker__input">
        <el-input
          ref="input"
          :value="value"
          :class="{ 'is-active': visible, '--readonly': readonly }"
          placeholder="请选择时间"
          suffix-icon="el-icon-time"
          @change="handleInputChange"
          @keyup.native.prevent.stop="handleKeyup"
          @keypress.native.prevent.stop
          @keydown.native.prevent.stop
        />
      </div>
    </template>
  </el-popover>
</template>

<script>
import Scrollbar from './scrollbar.vue';

const noop = () => {
  /* empty block */
};

export default {
  name: 'GTimePicker',
  components: { Scrollbar },
  inject: ['updateCron'],
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
      default: () => '',
      validator(val) {
        const regExp = /(([0-1][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]/;
        return !val || regExp.test(val);
      },
    },
    type: {
      type: String,
      default: () => 'hour,minute',
    },
    readonly: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      cacheValue: '',
      selected: 0,
      visible: false,
      timer: null,
      activedItems: {
        0: 0,
        1: 0,
        2: 0,
      },
      data: [
        { id: 0, nums: ['00'] },
        { id: 1, nums: ['00'] },
        { id: 2, nums: ['00'] },
      ],
    };
  },
  computed: {
    selection() {
      const start = this.selected * 3;
      return [start, start + 2];
    },
  },
  watch: {
    type: {
      immediate: true,
      handler(type) {
        const typeArr = type.split(',');
        typeArr.forEach(item => {
          const val = item.trim();
          const strategy = {
            hour: () => {
              this.data[0].nums = this.generateCounter(24);
            },
            minute: () => {
              this.data[1].nums = this.generateCounter(60);
            },
            second: () => {
              this.data[2].nums = this.generateCounter(60);
            },
            noop,
          };

          const execute = strategy[val] || strategy.noop;
          execute();
        });
      },
    },
    selected: {
      handler() {
        this.selectText();
      },
    },
    activedItems: {
      // immediate: true,
      deep: true,
      async handler() {
        // 小时是可选的，需要同步分钟信息
        if (this.type.includes('hour'))
          this.$emit('minute-change', this.supply0(this.activedItems[1]));
        this.transformObj2String();
        this.selectText();
        this.scrollToTargetPosition(this.selected);
      },
    },
  },
  methods: {
    handlePopoverHide() {
      this.updateCron();
    },
    handlePopoverShow() {
      this.cacheValue = this.value;
      if (this.value) {
        const splitArr = this.value.split(':');
        for (let i = 0, len = splitArr.length; i < len; i++) {
          const val = splitArr[i];
          this.activedItems[i] = Number(val);
          this.scrollToTargetPosition(i);
        }
      }
    },
    supply0(num) {
      return num < 10 ? `0${num}` : `${num}`;
    },
    handleInputChange(val) {
      this.$emit('change', val);
    },
    cancel() {
      this.visible = false;
      this.$emit('change', this.cacheValue);
      this.$emit('minute-change', this.cacheValue.split(':')[1]);
    },
    ok() {
      this.visible = false;
    },
    transformObj2String() {
      const value = Object.values(this.activedItems)
        .reduce((acc, val) => `${acc}:${this.supply0(val)}`, '')
        .slice(1);
      this.$emit('change', value);
    },
    scrollToTargetPosition(index) {
      const { activedItems, $refs } = this;
      const top = activedItems[index] * 24;
      $refs.colRef[index].$el.scrollTo({ top, behavior: 'smooth' });
    },
    generateCounter(num) {
      const result = [];
      for (let i = 0; i < num; i++) {
        result.push(this.supply0(i));
      }
      return result;
    },
    handleItemClick(i, j) {
      this.selected = i;
      this.activedItems[i] = j;
    },
    handleItemScroll(e, index) {
      this.selected = index;
      if (this.timer) clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        const remainder = e.target.scrollTop % 24;
        let divisor = Math.floor(e.target.scrollTop / 24);
        if (remainder >= 12) divisor++;
        this.activedItems[index] = divisor;
      }, 100);
    },
    selectText() {
      if (!this.$refs.input) return;
      const dom = this.$refs.input.$el.querySelector('input');
      if (dom) {
        dom.focus();
        dom.setSelectionRange(...this.selection);
      }
    },
    handleKeyup(e) {
      const strategy = {
        ArrowUp: () => {
          const { data, selected, activedItems } = this;
          const index = activedItems[selected];
          if (index + 1 < data[selected].nums.length) activedItems[selected]++;
        },
        ArrowDown: () => {
          const { activedItems, selected } = this;
          activedItems[selected] > 0 && activedItems[selected]--;
        },
        ArrowLeft: () => {
          if (this.selected > 0) this.selected--;
        },
        ArrowRight: () => {
          if (this.selected < 2) this.selected++;
        },
        noop,
      };

      const execute = strategy[e.key] || strategy.noop;
      execute();
    },
  },
};
</script>

<style lang="scss">
.g-time-picker {
  &.el-popover.el-popper {
    padding: 0;
    &[x-placement^='bottom'] {
      margin-top: 2px;
    }

    &[x-placement^='top'] {
      margin-bottom: 2px;
    }

    .popper__arrow,
    .popper__arrow::after {
      display: none;
    }
  }

  &__input {
    width: 166px;

    .el-input__clear {
      position: absolute;
      top: 50%;
      right: 0px;
      transform: translateY(-50%);
      background-color: var(--input-bg, #212845);
      padding: 2px;
    }
  }

  &__wrapper {
    width: 100%;
    height: 168px;
    user-select: none;
  }

  &__main {
    height: calc(100% - 32px);
    display: flex;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      z-index: -1;
      display: block;
      width: 100%;
      height: 24px;
      line-height: 24px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--blue-6);
    }
  }

  &__col {
    flex-basis: 33.3%;
    flex-grow: 0;
    overflow-y: hidden;
    overflow-x: hidden;
    height: 100%;

    &-wrapper {
      &::before,
      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 56px;
      }
    }
  }

  &__item {
    height: 24px;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
    color: var(--grey-12);

    &:hover {
      color: var(--blue-6);
    }

    &.--active {
      color: #fff;

      &:hover {
        color: #fff;
      }
    }
  }

  &__footer {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 8px;
    border-top: 1px solid var(--grey-1, #1b223d);
    font-size: 12px;
    box-sizing: border-box;

    span {
      cursor: pointer;
    }
  }

  &__cancel {
    color: var(--grey-12);

    &:hover {
      color: var(--grey-11);
    }
  }

  &__ok {
    color: var(--blue-6);
    margin-left: 8px;

    &:hover {
      color: var(--blue-5);
    }
  }
}
</style>
