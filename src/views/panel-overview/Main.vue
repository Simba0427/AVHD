<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 xxl:col-span-9">
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 mt-8">
          <div class="flex items-center h-10 intro-y">
            <h2 class="mr-5 text-lg font-medium truncate">Panel 1</h2>
          </div>
          <div v-if="loaded" class="grid grid-cols-12 gap-6 mt-5">
            <Widget v-for="unit in units" :key="unit._unit_token" :unit="unit" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Widget from "@/components/widget/Main.vue";
import { defineComponent, watch } from "vue";
import { useUnits } from "@/utils/widgets";

export default defineComponent({
  components: {
    Widget
  },
  setup() {
    const [units, loaded] = useUnits();

    return {
      loaded,
      units
    };
  }
});
</script>
