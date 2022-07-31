<template>
  <svg aria-hidden="true" class="icon-svg">
    <use :xlink:href="`#${iconName}`"></use>
  </svg>
</template>
<script>

export default {
  name: 'IconSvg',
  props: {
    iconName: {
      type: String,
      default: ''
    }
  }
}
</script>
<style>
.icon-svg {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
</style>
