<template>
  <div class="operator-group">
    <template v-for="(btn, index) in filterListBtns">
      <el-link
        v-if="btn.type !== 'expand'"
        :key="index"
        :underline="false"
        :disabled="isDisabled(btn)"
        @click="btn.click(data)"
      >
        <el-tooltip v-if="isDisabled(btn) || iconOnly" :content="tooltipText(btn)">
          <div class="btn-item-content">
            <i class="btn-item__icon" :class="btn.iconClass"> </i>
            <span v-if="!iconOnly" class="list-name--label">{{ btn.name }}</span>
          </div>
        </el-tooltip>
        <div v-else class="btn-item-content">
          <i class="btn-item__icon" :class="btn.iconClass"> </i>
          <span class="list-name--label">{{ btn.name }}</span>
        </div>
      </el-link>
      <el-popover
        v-else
        :key="index"
        :content="btn.name"
        :trigger="moreTrigger"
        placement="bottom"
        popper-class="popover-operator"
        @show="$emit('showMore', data)"
        @hide="$emit('hideMore', data)"
      >
        <el-link slot="reference" :underline="false">
          <div class="btn-item-content">
            <i class="reference__icon" :class="moreIcon"></i>
          </div>
        </el-link>
        <div v-for="(expandItem, idx) in btn.expandBtns" :key="idx" class="expand-item">
          <el-tooltip
            v-if="isDisabled(expandItem)"
            placement="right"
            :content="tooltipText(expandItem)"
          >
            <div class="expand-item-content disabled">
              <i class="expand-item__icon" :class="expandItem.iconClass"> </i>
              <span class="expand-item__text">{{ expandItem.name }}</span>
            </div>
          </el-tooltip>
          <div v-else class="expand-item-content" @click="expandItem.click(data)">
            <i class="expand-item__icon" :class="expandItem.iconClass"> </i>
            <span class="expand-item__text">{{ expandItem.name }}</span>
          </div>
        </div>
      </el-popover>
    </template>
  </div>
</template>

<script>
export default {
  name: 'GOperationGroup',
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    showMaxNum: {
      type: Number,
      default: 5,
    },
    iconOnly: {
      type: Boolean,
      default: false,
    },
    moreIcon: {
      type: String,
      default: 'el-icon-more',
    },
    moreTrigger: {
      type: String,
      default: 'hover',
    },
  },
  computed: {
    filterListBtns() {
      const tempList = this.options.filter(i => (i.hidden ? !i.hidden(this.data) : true));
      const len = tempList.length;
      if (len > this.showMaxNum) {
        const justList = tempList.slice(0, this.showMaxNum - 1);
        justList[this.showMaxNum - 1] = {
          name: '更多',
          iconClass: 'icongengduo',
          expandBtns: [],
          type: 'expand',
        };
        justList[this.showMaxNum - 1].expandBtns.push(...tempList.slice(this.showMaxNum - 1, len));
        return justList;
      }
      return tempList;
    },
  },
  methods: {
    isDisabled(btn) {
      return btn.disabled && btn.disabled(this.data);
    },
    tooltipText(btn) {
      const disable = this.isDisabled(btn);
      return disable ? btn.reason || btn.name + '不可用' : this.iconOnly ? btn.name : '';
    },
  },
  render(h) {
    return h();
  },
};
</script>

<style lang="scss" scoped>
.btn-item__icon {
  font-size: 18px;
}
.btn-item-content {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 0 8px;
  .list-name--label {
    font-size: 12px;
  }
}
.el-link.el-link--default {
  color: var(--grey-11);
  .btn-item__icon {
    color: var(--grey-12);
  }
  &.is-disabled {
    color: var(--grey-10);
    .btn-item__icon {
      color: var(--grey-10);
    }
  }
}
.el-link.el-link--default:not(.is-disabled):hover {
  * {
    color: var(--blue-7);
  }
}
.more-btn {
  display: block;
  width: 18px;
  height: 18px;
  object-fit: cover;
}
</style>
<style lang="scss">
.el-popover--plain.popover-operator {
  min-width: 100px;
  font-size: 12px;
  padding: 4px 0;
  .expand-item {
    display: flex;
    align-items: center;
    i.reference__icon {
      font-size: 16px;
    }
    .expand-item-content {
      width: 100%;
      padding: 4px 16px;
      display: flex;
      align-items: center;
      cursor: pointer;
      &:hover {
        color: var(--blue-6);
        background: var(--grey-8);
      }
      &.disabled {
        cursor: not-allowed;
        color: var(--grey-10);
      }
    }
    .expand-item__text {
      margin-left: 8px;
    }
  }
  .popper__arrow {
    border-bottom-color: var(--grey-6);
  }
}
</style>
