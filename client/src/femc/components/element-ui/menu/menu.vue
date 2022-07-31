<template>
  <div class="g-menu" :class="{ '--collapse': menuCollapse }">
    <slot name="top" />
    <el-scrollbar class="g-menu__wrap">
      <slot v-if="$slots.container" name="container" />
      <menu-box
        v-else
        v-bind="{ ...$props, ...$attrs, defaultActive: defaultActive }"
        v-on="$listeners"
      />
    </el-scrollbar>
    <slot name="bottom" />
    <div class="g-menu__toggle">
      <component
        :is="menuCollapse ? 'unfold' : 'fold'"
        class="gt-menu-icon"
        :style="{ right: menuCollapse ? '22px' : '12px' }"
        @click.native="handleToggleCollapse"
      />
    </div>
  </div>
</template>

<script>
import Fold from './icon/fold.vue';
import Unfold from './icon/unfold.vue';

const props = {
  menus: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Object,
    default: () => ({
      label: 'label',
      routerName: 'name',
    }),
  },
  collapse: {
    type: Boolean,
    default: () => false,
  },
  codeToAtag: {
    type: Boolean,
    default: () => false,
  },
};

export default {
  name: 'GMenu',
  components: {
    Fold,
    Unfold,
    MenuBox: {
      props,
      render() {
        const { routerName, label } = this.options;

        const renderSubMenu = menus =>
          menus.map(menu => {
            const { index, icon, children, svgicon, name, badge, route, code } = menu;
            if (children?.length)
              return (
                <el-submenu key={name} index={index || menu[routerName]}>
                  <template slot="title">
                    {icon && <i class={`gt-menu-icon ${icon}`} />}
                    {svgicon && <svg-icon class="gt-menu-icon" icon-name={svgicon} />}
                    <span>{menu[label]}</span>
                  </template>
                  {renderSubMenu(children)}
                </el-submenu>
              );

            const renderBadge = badge => {
              if (!badge) return;
              const defaultBadge = {
                value: 0,
                max: 99,
                isDot: false,
                hidden: false,
                type: 'primary',
              };
              const mergeBadge = { ...defaultBadge, ...badge };
              mergeBadge.hidden = badge.hidden || !mergeBadge.value;
              return <el-badge class="g-menu__message-badge" {...{ attrs: mergeBadge }} />;
            };
            return (
              <el-menu-item
                index={index || menu[routerName]}
                route={route || { name: menu[routerName] }}
              >
                {icon && <i class={`gt-menu-icon ${icon}`} />}
                {svgicon && <svg-icon class="gt-menu-icon" icon-name={svgicon} />}
                <template slot="title">
                  {code && this.codeToAtag ? (
                    <router-link class="g-menu_item" to={`/redirect/${code}`}>
                      {menu[label]}
                    </router-link>
                  ) : (
                    menu[label]
                  )}
                  {renderBadge(badge)}
                </template>
              </el-menu-item>
            );
          });

        return (
          <el-menu
            router={true}
            collapse={this.collapse}
            default-active={this.defaultActive}
            collapse-transition={false}
            {...{ attrs: this.$attrs }}
            {...{ on: this.$listeners }}
          >
            {renderSubMenu(this.menus)}
          </el-menu>
        );
      },
    },
  },
  props,
  data() {
    return { menuCollapse: false };
  },
  computed: {
    defaultActive() {
      // 根据menus动态匹配
      const name = this.matchRouter(this.menus, this.$route.name || '');
      return name || this.$route.name;
    },
    mergedOptions() {
      const defaultOptions = { label: 'label', routerName: 'name' };
      return { ...defaultOptions, ...this.options };
    },
  },
  watch: {
    collapse: {
      immediate: true,
      handler(newVal) {
        this.menuCollapse = newVal;
      },
    },
    menuCollapse(newVal) {
      this.$emit('update:collapse', newVal);
    },
  },
  methods: {
    handleToggleCollapse() {
      this.menuCollapse = !this.menuCollapse;
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'));
      });
    },
    matchRouter(tree, name) {
      let routerName = '';
      const deepMath = tree => {
        for (let i = 0; i < tree.length; i++) {
          if (routerName) break;
          const item = tree[i];
          if (item.children && item.children.length) deepMath(item.children);
          const index = name.indexOf(item.name);
          if (~index && !routerName) routerName = item.name;
        }
      };

      deepMath(tree);
      return routerName;
    },
  },
};
</script>

<style lang="scss" scoped>
.g-menu {
  height: 100%;
  background: var(--grey-4, #2e3857);
  box-shadow: none;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease-in-out;
  width: 176px;
  flex-shrink: 0;
  border-right: 1px solid var(--grey-7);

  &.--collapse {
    width: 65px;
  }

  &__wrap {
    flex: 1;
    overflow: hidden;

    ::v-deep {
      .el-badge__content {
        border-width: 0;
        border-radius: 5px;
        text-indent: 0;
        line-height: var(--badge-height);
      }

      .g-menu__message-badge {
        padding-bottom: 3px;
      }
      .g-menu_item {
        width: 100%;
        color: inherit;
        text-decoration: none;
      }
    }
  }

  &__toggle {
    font-size: 20px;
    z-index: 2;
    height: 38px;
    line-height: 38px;
    border-top: 1px solid var(--grey-6, #343e61);
    position: relative;

    .gt-menu-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      width: 18px;
      height: 18px;
      color: var(--grey-10, #5f7099);
    }
  }
}
</style>
