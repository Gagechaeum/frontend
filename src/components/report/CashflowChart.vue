<template>
  <div ref="el" class="h-[300px] w-full"></div>
</template>

<script setup>
import * as echarts from 'echarts';

const props = defineProps({
  policySeries: Array,
  loanSeries: Array,
});

const el = ref(null);
let chart = null;

const init = () => {
  if (!el.value) return;
  chart = echarts.init(el.value);
  chart.setOption({
    animation: false,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['대출 상환', '정책 수입'], top: 0 },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '40px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['3월', '4월', '5월', '6월', '7월', '8월'],
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: v => `${(v / 10000).toFixed(0)}만` },
    },
    series: [
      {
        name: '정책 수입',
        type: 'bar',
        data: props.policySeries,
        itemStyle: { color: '#2563EB' },
      },
      {
        name: '대출 상환',
        type: 'bar',
        data: props.loanSeries,
        itemStyle: { color: '#94A3B8' },
      },
    ],
  });
};

onMounted(() => {
  init();
  const onResize = () => chart?.resize();
  window.addEventListener('resize', onResize);
  onBeforeUnmount(() => window.removeEventListener('resize', onResize));
});
</script>
