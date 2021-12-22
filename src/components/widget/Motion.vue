<template>
  <div class="flex flex-col flex-1 h-full max-h-full pb-5">
    <div class="absolute flex items-center w-5 h-5 top-5 right-5">
      <div class="dropdown">
        <a class="block w-5 h-5 dropdown-toggle" href="javascript:;" aria-expanded="false">
          <MoreVerticalIcon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </a>
        <div class="w-28 dropdown-menu">
          <div class="p-2 dropdown-menu__content box dark:bg-dark-1">
            <div class="grid grid-cols-2 grid-rows-2">
              <button
                v-for="timeSpan in allowedTimeSpans"
                :class="{
                  'bg-primary-1 rounded-md hover:bg-primary-2 text-white':
                    timeSpan === activeTimeSpan,
                  'bg-white rounded-md dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2':
                    timeSpan !== activeTimeSpan
                }"
                class="flex items-center justify-center p-2 transition duration-300 ease-in-out"
                @click="setActiveTimeSpan(timeSpan)"
              >
                {{ timeSpan }}min
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col flex-1 h-full overflow-hidden">
      <div class="mt-2 text-2xl font-medium">Every {{ activeTimeSpan }}min</div>
      <div class="flex-1 mt-2">
        <div class="flex items-center justify-center flex-1 h-full">
          <LoadingIcon v-if="loading" icon="bars" class="w-16 h-16" color="#204090" />
          <Chart v-else type="bar" :data="data" :options="options" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PropType, defineComponent, computed, onMounted, ref, onUnmounted } from "vue";
import { getUnitState, Unit, UnitState } from "@/utils/widgets";
import Chart from "@/components/chart/Main.vue";
import * as dayjs from "dayjs";
import { ChartData, ChartOptions } from "chart.js";
import { useStore } from "@/store";

interface MotionState {
  battery: number;
  linkquality: number;
  occupancy: boolean;
}
interface MotionUpdate {
  timestamp: string;
  value: boolean;
}
interface SocketData<S extends object = object> {
  _unit_token: string;
  payload: UnitState<S>;
}

const connect = (token: string, onMessage: (state: MotionUpdate) => void): Promise<() => void> => {
  return new Promise((resolve) => {
    const socket = new WebSocket("wss://wss.avhd.cloud");

    socket.addEventListener("message", (message) => {
      try {
        const parsed = JSON.parse(message.data) as SocketData<MotionState>;

        if (parsed._unit_token === token) {
          onMessage({
            timestamp: parsed.payload._created,
            value: Boolean(parsed.payload.occupancy)
          });
        }
      } catch {}
    });

    socket.addEventListener("open", () => {
      resolve(() => socket.close());
    });
  });
};
const loadInitialData = async (
  token: string,
  timeSpan: number,
  barCount: number
): Promise<Array<MotionUpdate>> => {
  const initialTo = dayjs();
  const from = initialTo.subtract(timeSpan * barCount, "m");
  const states: Array<UnitState<MotionState>> = [];

  let to = initialTo.toISOString();
  let done = false;
  while (!done) {
    const batch = await getUnitState<MotionState>(token, {
      date_from: from.toISOString(),
      date_to: to,
      limit: 10
    });

    if (Array.isArray(batch)) {
      states.push(...batch);
      if (batch.length >= 10) {
        to = batch[batch.length - 1]._created;
      } else {
        done = true;
      }
    } else {
      done = true;
    }
  }

  return states.map((state) => ({
    timestamp: state._created,
    value: Boolean(state.occupancy)
  }));
};

export default defineComponent({
  components: {
    Chart
  },
  props: {
    unit: {
      required: true,
      type: Object as PropType<Unit>
    }
  },
  setup(props) {
    const store = useStore();
    const darkMode = computed(() => store.state.main.darkMode);
    const loading = ref(true);
    const disconnectSocket = ref(() => {});
    const activeTimeSpan = ref(1);
    const allowedTimeSpans = [1, 5, 15, 60];
    const barCount = 20;
    const bars = ref<Array<{ value: boolean; timestamps: string[] }>>(
      new Array(barCount).fill({ value: false, timestamps: [] })
    );
    const updateIntervalHandle = ref(0);
    const initialSetup = async () => {
      const states = await loadInitialData(props.unit._unit_token, activeTimeSpan.value, barCount);

      bars.value = bars.value.map((_, index) => {
        const to = dayjs().subtract(activeTimeSpan.value * index, "m");
        const from = dayjs().subtract(activeTimeSpan.value * (index + 1), "m");
        const filteredStates = states.filter((state) => {
          const timestamp = new Date(state.timestamp).getTime();

          return timestamp <= +to && timestamp >= +from;
        });

        return {
          value: filteredStates.some((state) => state.value),
          timestamps: filteredStates.map((state) => state.timestamp)
        };
      });
    };
    const setupBarUpdates = () => {
      clearInterval(updateIntervalHandle.value);
      updateIntervalHandle.value = window.setInterval(() => {
        bars.value = [
          { value: false, timestamps: [] },
          ...bars.value.slice(0, bars.value.length - 1)
        ];
      }, activeTimeSpan.value * 60 * 1000);
    };
    const setActiveTimeSpan = (timeSpan: number) => {
      loading.value = true;
      activeTimeSpan.value = timeSpan;

      initialSetup();
      setupBarUpdates();
      loading.value = false;
    };
    const data = computed<ChartData>(() => ({
      labels: bars.value.map((bar) => bar.value),
      datasets: [
        {
          label: props.unit._layout_dashboard.unit_state.occupancy.label,
          barPercentage: 0.5,
          barThickness: 12,
          maxBarThickness: 16,
          minBarLength: 2,
          data: bars.value.map((value) => 1),
          backgroundColor: bars.value.map(({ value, timestamps }) => {
            if (value) {
              return "#204090";
            }
            return darkMode.value ? "#293144" : "#CBD5E0";
          })
        }
      ]
    }));
    const options = computed<ChartOptions>(() => ({
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            title([item]) {
              return item.dataset.label;
            },
            label({ label }) {
              return `${label}`;
            },
            footer([{ dataIndex }]) {
              const base = dayjs();
              const from = base.subtract(activeTimeSpan.value * (dataIndex + 1), "m").toString();
              const to = base.subtract(activeTimeSpan.value * dataIndex, "m").toString();
              const { value, timestamps } = bars.value[dataIndex];

              return `From: ${from}\nTo: ${to}${
                value && timestamps.length > 0 ? `\nTimestamps:` : ""
              }${value ? timestamps.map((timestamp) => `\n${dayjs(timestamp).toString()}`) : ""}`;
            }
          }
        }
      },
      scales: { x: { display: false }, y: { display: false } }
    }));

    onMounted(async () => {
      await initialSetup();
      setupBarUpdates();
      loading.value = false;
      disconnectSocket.value = await connect(props.unit._unit_token, (update) => {
        const { value, timestamps } = bars.value[0];
        bars.value[0] = {
          value: value || update.value,
          timestamps: [...timestamps, update.timestamp]
        };
      });
    });
    onUnmounted(() => {
      clearInterval(updateIntervalHandle.value);
      disconnectSocket.value();
    });

    return {
      activeTimeSpan,
      allowedTimeSpans,
      data,
      options,
      loading,
      setActiveTimeSpan
    };
  }
});
</script>
