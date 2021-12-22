<template>
  <div class="col-span-12 sm:col-span-6 lg:col-span-4 intro-y">
    <div>
      <div class="box aspect-h-1 aspect-w-1">
        <div class="absolute top-0 left-0 w-full h-full p-5">
          <h3 class="font-medium truncate">{{ label }}</h3>
          <component :is="widgetMap[name]" :unit="unit"></component>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue-demi";
import { Unit, useUnitState } from "@/utils/widgets";
import { computed } from "vue";
import { widgetMap } from "./map";

export default defineComponent({
  props: {
    unit: {
      required: true,
      type: Object as PropType<Unit>
    }
  },
  setup(props) {
    const labelNameMatcher = /\{(.+?)\}/;
    const label = computed(() => {
      const results = labelNameMatcher.exec(props.unit._layout_dashboard.unit.label);

      if (results && props.unit[results[1]]) {
        return props.unit[results[1]];
      }
      return null;
    });
    return {
      name: props.unit.name,
      label,
      widgetMap
    };
  }
});
</script>
