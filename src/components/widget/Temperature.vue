<template>
  <div v-if="loaded" class="flex flex-col justify-center h-full pb-5">
    <div class="text-center">
      <p class="py-2 font-medium">{{ temperatureData.label }}</p>
      <p class="text-6xl">{{ temperatureData.value }} {{ temperatureData.unit }}</p>
    </div>
    <div class="flex justify-center">
      <div class="flex flex-col flex-1 text-center">
        <p class="py-2 font-medium">{{ pressureData.label }}</p>
        <p class="text-2xl">{{ pressureData.value }} {{ pressureData.unit }}</p>
      </div>
      <div class="flex flex-col flex-1 text-center">
        <p class="py-2 font-medium">{{ humidityData.label }}</p>
        <p class="text-2xl">{{ humidityData.value }} {{ humidityData.unit }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PropType, defineComponent, computed } from "vue";
import { Unit, UnitState, useUnitState } from "@/utils/widgets";
import { presentValue } from "@/utils/general";

interface TemperatureState {
  battery: number;
  humidity: number;
  linkquality: number;
  pressure: number;
  temperature: number;
  voltage: number;
}

export default defineComponent({
  props: {
    unit: {
      required: true,
      type: Object as PropType<Unit>
    }
  },
  setup(props) {
    const [states, loaded] = useUnitState<TemperatureState>(props.unit._unit_token);
    const temperatureData = computed(() => {
      const layout = props.unit._layout_dashboard.unit_state.temperature;
      const { decimals, multiplier } = layout.presentation;
      const [state] = states.value;

      return {
        label: layout.label,
        value: presentValue(state.temperature, decimals, multiplier),
        unit: layout.format
      };
    });
    const humidityData = computed(() => {
      const layout = props.unit._layout_dashboard.unit_state.humidity;
      const { decimals, multiplier } = layout.presentation;
      const [state] = states.value;

      return {
        label: layout.label,
        value: presentValue(state.humidity, decimals, multiplier),
        unit: layout.format
      };
    });
    const pressureData = computed(() => {
      const layout = props.unit._layout_dashboard.unit_state.pressure;
      const { decimals, multiplier } = layout.presentation;
      const [state] = states.value;

      return {
        label: layout.label,
        value: presentValue(state.pressure, decimals, multiplier),
        unit: layout.format
      };
    });

    return { temperatureData, humidityData, pressureData, loaded };
  }
});
</script>
