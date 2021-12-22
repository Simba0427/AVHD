<template>
  <div v-if="loaded" class="flex flex-col h-full pb-5">
    <p class="py-2 text-center">
      <span class="font-medium">{{ cpuData.label }}:</span> {{ cpuData.value }} ({{ cpuData.unit }})
    </p>
    <div class="flex-1 h-0">
      <Chart type="pie" :data="memoryData" :options="options('left')" />
    </div>
    <div class="flex-1 h-0 pb-2">
      <Chart type="pie" :data="diskData" :options="options('right')" />
    </div>
  </div>
</template>
<script lang="ts">
import { PropType, defineComponent, computed } from "vue";
import { Unit, useUnitState } from "@/utils/widgets";
import Chart from "../chart/Main.vue";
import { useStore } from "@/store";
import { presentValue } from "@/utils/general";
import { ChartData, ChartOptions } from "chart.js";

interface BackupState {
  cpu_load: number;
  disk_available: number;
  disk_total: number;
  disk_used: number;
  memory_available: number;
  memory_total: number;
  memory_used: number;
}

export default defineComponent({
  components: { Chart },
  props: {
    unit: {
      required: true,
      type: Object as PropType<Unit>
    }
  },
  setup(props) {
    const store = useStore();
    const [states, loaded] = useUnitState<BackupState>(props.unit._unit_token);
    const darkMode = computed(() => store.state.main.darkMode);
    const diskData = computed<ChartData>(() => {
      const layout = props.unit._layout_dashboard.unit_state;
      const diskUsedPresentation = layout.disk_used.presentation;
      const diskAvailablePresentation = layout.disk_available.presentation;
      const [state] = states.value;

      return {
        labels: ["disk_used", "disk_available"],
        datasets: [
          {
            data: [
              Number(
                presentValue(
                  state.disk_used,
                  diskUsedPresentation.decimals,
                  diskUsedPresentation.multiplier
                )
              ),
              Number(
                presentValue(
                  state.disk_available,
                  diskAvailablePresentation.decimals,
                  diskAvailablePresentation.multiplier
                )
              )
            ],
            backgroundColor: ["#204090", darkMode.value ? "#293144" : "#CBD5E0"],
            hoverBackgroundColor: ["#204090", darkMode.value ? "#293144" : "#CBD5E0"],
            borderWidth: 5,
            borderColor: darkMode.value ? "#303953" : "#fff"
          }
        ]
      };
    });
    const memoryData = computed<ChartData>(() => {
      const layout = props.unit._layout_dashboard.unit_state;
      const memoryUsedPresentation = layout.memory_used.presentation;
      const memoryAvailablePresentation = layout.memory_available.presentation;
      const [state] = states.value;

      return {
        labels: ["memory_used", "memory_available"],
        datasets: [
          {
            data: [
              Number(
                presentValue(
                  state.memory_used,
                  memoryUsedPresentation.decimals,
                  memoryUsedPresentation.multiplier
                )
              ),
              Number(
                presentValue(
                  state.memory_available,
                  memoryAvailablePresentation.decimals,
                  memoryAvailablePresentation.multiplier
                )
              )
            ],
            backgroundColor: ["#204090", darkMode.value ? "#293144" : "#CBD5E0"],
            hoverBackgroundColor: ["#204090", darkMode.value ? "#293144" : "#CBD5E0"],
            borderWidth: 5,
            borderColor: darkMode.value ? "#303953" : "#fff"
          }
        ]
      };
    });
    const cpuData = computed(() => {
      const layout = props.unit._layout_dashboard.unit_state;
      const cpuLoadPresentation = layout.cpu_load.presentation;
      const [state] = states.value;

      return {
        label: layout.cpu_load.label,
        value: presentValue(
          state.cpu_load,
          cpuLoadPresentation.decimals,
          cpuLoadPresentation.multiplier
        ),
        unit: layout.cpu_load.format
      };
    });
    const options = (position: "left" | "right"): ChartOptions => {
      const layout = props.unit._layout_dashboard.unit_state;

      return {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position,
            labels: {
              color: darkMode.value ? "rgb(226, 232, 240)" : "rgb(45, 55, 72)",
              filter(item) {
                item.text = layout[item.text].label;

                return true;
              }
            }
          },
          tooltip: {
            callbacks: {
              label({ label, formattedValue }) {
                return `${layout[label].label} ${formattedValue} ${layout[label].format}`;
              }
            }
          }
        }
      };
    };

    return {
      cpuData,
      diskData,
      memoryData,
      loaded,
      options
    };
  }
});
</script>
