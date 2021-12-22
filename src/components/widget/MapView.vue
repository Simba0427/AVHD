<template>
  <div class="col-span-12 sm:col-span-6 lg:col-span-4 intro-y">
    <div>
      <div class="box aspect-h-1 aspect-w-1">
        <div class="absolute top-0 left-0 w-full h-full p-5">
          <h3 class="font-medium truncate">{{occupancyData.label}}</h3>
          <div  ref="mapDiv" style="width:100%;height: 98%;" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, computed,watch,onMounted,ref } from "vue";
import { Unit, useUnitState,UnitState } from "@/utils/widgets";

import {Loader, LoaderOptions} from 'google-maps';
const options: LoaderOptions = {/* todo */};
const loader = new Loader(process.env.VUE_APP_GOOGLE_MAPS_API_KEY, options);
const myLatLng = { lat: -25.363, lng: 131.044 };
let marksTitle = "Hello device";

interface MotionState {
  label: string;
  latitude: number;
  longitude: number;
}

export default defineComponent({
  props: {
    state: {
      required: true,
      type: Object as PropType<UnitState<MotionState>>,
      default: {
        label: 'test',
        latitude: myLatLng.lat,
        longitude: myLatLng.lng
      }
    },
    unit: {
      required: true,
      type: Object as PropType<Unit>
    }
  },
  async mounted(){
  },
  setup(props) {
    const { state } = props;
    const [stateWatch, loaded] = useUnitState<MotionState>(props.unit._unit_token);

    const occupancyData = computed(() => {
      const layout = props.unit._layout_dashboard.unit_state;

      if(state.latitude) {
        myLatLng.lat = state.latitude;
        myLatLng.lng = state.longitude;
      }

      if(state.label) {
        marksTitle = state.label;
      }

      return {
        label: layout.label,
        value: state,
      };
    });
    const currPos = computed(()=>({
      lat: state.latitude,
      lng: state.longitude
    }));

    const mapDiv = ref(null)
    const map = ref(null)

    onMounted(async () => {
      await loader.load();

      map.value = new google.maps.Map(mapDiv.value,{
        center: currPos.value,
        zoom:15
      })

      new google.maps.Marker({
        position: currPos.value,
        map:map.value,
        title: "hello world",
      });
    });
    const refreshComponent = ref(0);
    let marker = null;

    watch(stateWatch,(newValue, oldValue) => {
      if(marker) marker.setMap(null);
      const motionState = {
        latitude: 29.01,
        longitude: 81.01
      }
      const proxy2 = new Proxy(newValue, {});
      const updateLatLng = JSON.parse(
        JSON.stringify(newValue)
      );
      currPos.value.lat = updateLatLng[0].latitude;
      currPos.value.lng = updateLatLng[0].longitude;

      if (window.google) {
        const markers = new window.google.maps.Marker({
          position: currPos.value,
          map: map.value,
          title: "update hello world",
        });
        markers.setMap(map.value);

        map.value.setCenter(
          new google.maps.LatLng(
            currPos.value.lat,
            currPos.value.lng
          )
        );
      }

      refreshComponent.value++;
    })

    return {
      occupancyData,
      mapDiv,
      loaded,
      currPos,
      refreshComponent
    };
  }
});
</script>

<style scoped>
  #map {
    height: 98%;
  }
  html,
  body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
</style>
