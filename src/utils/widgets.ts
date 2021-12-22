import { Ref, ref } from "vue";
import axios from "axios";
import { getAccessToken } from "./auth";
import { getUrl } from "./proxy";

interface Unit {
  name: string;
  _unit_id: string;
  _project_id: string;
  _unit_token: string;
  _topic: string;
  _ext_id: string;
  _state: string;
  _lastmodified: string;
  _created: string;
  _layout_dashboard: {
    unit: { label: string };
    unit_state: {
      [key: string]: {
        label: string;
        presentation: {
          decimals: number;
          multiplier: number;
        };
        format: string;
      };
    };
  };
}
type UnitState<CustomState> = {
  _unit_state_id: string;
  _unit_id: string;
  _state: string;
  _created: string;
} & CustomState;
interface UnitsGetResponse {
  units: Unit[];
  _return_code: number;
  _return_message: string;
}
interface UnitStateGetResponse<CustomState> {
  _unit_states: UnitState<CustomState>[];
  _return_code: number;
  _return_message: string;
}
interface GetUnitStateOptions {
  date_from?: string;
  date_to?: string;
  limit?: number;
}
interface UseUnitStateOptions {
  update?: boolean;
  request?: GetUnitStateOptions;
}

const getUnits = async (): Promise<Unit[] | string> => {
  const accessToken = getAccessToken();

  let output: Unit[] | string = [];

  if (!accessToken) {
    return "Not authenticated";
  }

  try {
    const { data } = await axios.get<UnitsGetResponse>(
      getUrl(
        `services/2021-05/units?search=${encodeURIComponent(
          JSON.stringify({
            project_id: "1000034",
            state: "active",
            limit: 1000
          })
        )}`
      ),
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      }
    );

    if (data._return_code === 200 && data._return_message === "OK") {
      output = data.units || [];
    } else {
      output = data._return_message || "Error";
    }
  } catch ({ response }) {
    if (response) {
      output = response.data?.["_return_message"] || "Error";
    }
  }

  return output;
};
const getUnitState = async <CustomState extends object>(
  token: string,
  options?: GetUnitStateOptions
): Promise<Array<UnitState<CustomState>> | string | null> => {
  const accessToken = getAccessToken();

  let output: Array<UnitState<CustomState>> | string | null = null;

  if (!accessToken) {
    return "Not authenticated";
  }

  try {
    const { data } = await axios.get<UnitStateGetResponse<CustomState>>(
      getUrl(
        `services/2021-05/units/${token}/states?search=${encodeURI(
          JSON.stringify({ limit: 1, ...options })
        )}`
      ),
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      }
    );

    if (data._return_code === 200 && data._return_message === "OK") {
      output = data._unit_states || null;
    } else {
      output = data._return_message || "Error";
    }
  } catch ({ response }) {
    if (response) {
      output = response.data?.["_return_message"] || "Error";
    }
  }

  return output;
};
const useUnits = (): [Ref<Unit[]>, Ref<boolean>] => {
  const units = ref<Unit[]>([]);
  const loaded = ref(false);

  getUnits().then((loadedUnits) => {
    if (typeof loadedUnits !== "string") {
      units.value = loadedUnits;
    }

    loaded.value = true;
  });

  return [units, loaded];
};
const useUnitState = <CustomState extends object>(
  token: string,
  options?: UseUnitStateOptions
): [Ref<Array<UnitState<CustomState>> | undefined>, Ref<boolean>] => {
  const unitState = ref<Array<UnitState<CustomState>>>();
  const loaded = ref(false);
  const update = (): void => {
    getUnitState<CustomState>(token, options?.request).then((loadedUnitState) => {
      if (loadedUnitState && typeof loadedUnitState !== "string") {
        unitState.value = loadedUnitState;
      }

      loaded.value = true;
    });
  };

  if (typeof options?.update === "boolean" ? options.update : true) {
    setInterval(update, 5000);
  }
  update();

  return [unitState, loaded];
};

export { Unit, UnitState, getUnitState, useUnits, useUnitState };
