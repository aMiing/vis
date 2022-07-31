<template>
  <svg
    class="g-icon g-icon-loading"
    viewBox="0 0 44 44"
    :style="{ fontSize: size }"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <title>操作加载</title>
    <defs>
      <linearGradient :id="id" x1="105.638325%" y1="54.9658148%" x2="-2.21367711%" y2="87.6388378%">
        <stop :stop-color="color" offset="0%"></stop>
        <stop :stop-color="color" stop-opacity="0" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g id="操作加载" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <rect id="矩形" x="0" y="0" width="44" height="44"></rect>
      <path
        id="路径"
        d="M25.8248602,7.82231466 C17.9407315,5.6737483 9.83682042,10.4323453 7.72425461,18.4509276 C6.56110588,22.8659662 7.45421465,27.3459128 9.81441707,30.8473067 C10.6288663,32.055809 10.3260168,33.7067567 9.13798706,34.5351484 C7.94995731,35.3632749 6.32664005,35.0553137 5.5121647,33.8470767 C2.3271381,29.1218222 1.11177164,23.0525997 2.68585256,17.0778611 C5.54400928,6.22919249 16.5081427,-0.208909682 27.1749035,2.69798654 C37.841586,5.60488807 44.1719026,16.7560005 41.3137146,27.6046691 C40.94076,29.019699 39.5107532,29.8594967 38.1193459,29.4801819 C36.7281993,29.1011323 35.9024832,27.6467386 36.2751769,26.2316026 C38.3877167,18.2130203 33.7090932,9.97090754 25.8248602,7.82231466 Z"
        :fill="`url(#${id})`"
        fill-rule="nonzero"
      ></path>
    </g>
  </svg>
</template>

<script>
import { getProps } from './props';

export default {
  name: 'GIconButtonLoading',
  props: getProps('white'),
  data() {
    return {
      id: Math.random(),
    };
  },
};
</script>
