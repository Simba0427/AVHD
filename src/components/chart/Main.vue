<template>
  <canvas ref="chartRef"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, PropType } from "vue";
import { helper as $h } from "@/utils/helper";
import Chart, { ChartData, ChartOptions, ChartType } from "chart.js/auto";

export default defineComponent({
  props: {
    type: {
      type: String as PropType<ChartType>,
      required: true,
      default: "line"
    },
    data: {
      type: Object as PropType<ChartData>,
      required: true
    },
    options: {
      type: Object as PropType<ChartOptions>
    }
  },
  setup(props) {
    const chartRef = ref<HTMLCanvasElement | null>();
    const init = () => {
      const chart = new Chart(chartRef.value, {
        type: props.type,
        data: $h.toRaw(props.data),
        options: props.options
      });
      window.addEventListener("resize", () => {
        console.log("resize");
        chart.resize();
      });

      watch(props, () => {
        chart.data = $h.toRaw(props.data);
        chart.options = props.options;
        chart.update("none");
      });
    };

    onMounted(() => {
      init();
    });

    return {
      chartRef
    };
  }
});
</script>
