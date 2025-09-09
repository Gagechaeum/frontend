<template>
  <!-- 차트 컨테이너: relative + 고정 높이 -->
  <div ref="wrap" class="relative w-full" style="height: 280px">
    <!-- 데이터 없음 오버레이 (z-10로 캔버스 위에 표시) -->
    <div
      v-show="isEmpty"
      class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-sm text-gray-400"
    >
      아직 데이터가 없습니다
    </div>
  </div>
</template>

<script setup>
/* eslint-env browser */
/* global requestAnimationFrame, window, ResizeObserver */

import {
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
  computed,
} from 'vue';
import * as echarts from 'echarts';

/* ===== Props ===== */
const props = defineProps({
  labels: { type: Array, default: () => [] }, // ['3월','4월', ...]
  policy: { type: Array, default: () => [] }, // [0,0,...]
  loan: { type: Array, default: () => [] }, // [0,0,...]
});

/* ===== Refs ===== */
const wrap = ref(null);
let chart = null;
let ro = null;

/* ===== Empty 판단 ===== */
const isEmpty = computed(() => {
  const hasData = Array.isArray(props.labels) && props.labels.length > 0;
  const allZero = arr => !arr?.length || arr.every(v => Number(v || 0) === 0);
  return !hasData || (allZero(props.policy) && allZero(props.loan));
});

/* ===== Chart Option ===== */
function buildOption() {
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 24, right: 16, top: 16, bottom: 24, containLabel: true },
    xAxis: { type: 'category', data: props.labels },
    yAxis: { type: 'value' },
    series: [
      { type: 'bar', name: '정책 수입', data: props.policy },
      { type: 'bar', name: '대출 상환', data: props.loan },
    ],
    backgroundColor: 'transparent',
    animation: false,
  };
}

/* ===== 컨테이너 크기 준비 대기 ===== */
function ensureSizeReady(el) {
  return new Promise(resolve => {
    const check = () => {
      if (!el) {
        requestAnimationFrame(check);
        return;
      }
      const { clientWidth: w, clientHeight: h } = el;
      if (w > 0 && h > 0) resolve();
      else requestAnimationFrame(check);
    };
    check();
  });
}

/* ===== Init & Resize ===== */
async function initChart() {
  const el = wrap.value;
  if (!el) return;

  await nextTick();
  await ensureSizeReady(el);

  if (chart) chart.dispose();
  chart = echarts.init(el);
  chart.setOption(buildOption());

  ro = new ResizeObserver(() => {
    try {
      chart && chart.resize();
    } catch (err) {
      void err;
    }
  });
  ro.observe(el);

  window.addEventListener('resize', handleWindowResize, { passive: true });
}

function handleWindowResize() {
  try {
    chart && chart.resize();
  } catch (err) {
    void err;
  }
}

/* ===== Lifecycle ===== */
onMounted(initChart);

watch(
  () => [props.labels, props.policy, props.loan],
  () => {
    if (chart) chart.setOption(buildOption(), true);
  },
  { deep: true }
);

onBeforeUnmount(() => {
  try {
    ro && ro.disconnect();
  } catch (err) {
    void err;
  }
  window.removeEventListener('resize', handleWindowResize);
  if (chart) {
    chart.dispose();
    chart = null;
  }
});
</script>

<style scoped>
/* 필요 시 스타일 추가 */
</style>
