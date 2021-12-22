import Backup from "./Backup.vue";
import Motion from "./Motion.vue";
import Temperature from "./Temperature.vue";
import MapView from "./MapView.vue";

const widgetMap = {
  gps001: MapView,
  temperature001: Temperature,
  motiondetection001: Motion,
  backup001: Backup
};

export { widgetMap };
