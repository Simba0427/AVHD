import axios from "axios";
import { getUrl } from "./proxy";

const tokenKey = "avhd_dashboard_token";

const _getTotalCount = async (): Promise<any> => {
  const _token = localStorage.getItem(tokenKey);
  let output = null;
  try {
    const { data } = await axios.get(getUrl("services/2021-07/handler_groups"), {
      params: {
        search: { state: "active", limit: 0 }
      }
    });
    if (data._return_code === 200 && data._return_message === "OK") {
      output = data.handler_groups.length;
    }
  } catch ({ response }) {
    if (response) {
      output = null;
    }
  }
  return output;
};

const _getGroups = async (_state: string, _limit: number, _step: number): Promise<any> => {
  const _token = localStorage.getItem(tokenKey);
  let output = null;
  try {
    const { data } = await axios.get(getUrl("services/2021-07/handler_groups"), {
      params: {
        search: { state: _state, limit: _limit, start: _step }
      }
    });
    if (data._return_code === 200 && data._return_message === "OK") {
      output = data.handler_groups;
    }
  } catch ({ response }) {
    if (response) {
      output = null;
    }
  }
  return output;
};

const _deleteGroup = async (group_id: number): Promise<string> => {
  const _token = localStorage.getItem(tokenKey);
  let output = "";

  try {
    const { data } = await axios.delete(
      getUrl("services/2021-07/handler_groups/" + group_id.toString()),
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + _token
        }
      }
    );
    if (data._return_code === 200 && data._return_message === "OK") {
      output = "success";
    }
  } catch ({ response }) {
    if (response) {
      output = response.data?.["_return_message"] || "Error";
    }
  }

  return output;
};

const _addGroup = async (name: string, description: string): Promise<string> => {
  const _token = localStorage.getItem(tokenKey);
  let output = "";

  try {
    const { data } = await axios.post(
      getUrl("services/2021-07/handler_groups"),
      {
        name: name,
        description: description
      },
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + _token
        }
      }
    );
    if (data._return_code === 200 && data._return_message === "OK") {
      output = "success";
    }
  } catch ({ response }) {
    if (response) {
      output = response.data?.["_return_message"] || "Error";
    }
  }

  return output;
};

const _linkHandlerAndGroup = async (group_id: number, handler_id: number): Promise<string> => {
  const _token = localStorage.getItem(tokenKey);
  let output = "";

  try {
    const { data } = await axios.post(
      getUrl("services/2021-07/group_handler_linking"),
      {
        handler_group_id: group_id,
        handler_id: handler_id
      },
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + _token
        }
      }
    );
    if (data._return_code === 200 && data._return_message === "OK") {
      output = "success";
    }
  } catch ({ response }) {
    if (response) {
      output = response.data?.["_return_message"] || "Error";
    }
  }

  return output;
};

const _unLinkHandlerAndGroup = async (
  handler_group_id: number,
  handler_id: number
): Promise<string> => {
  const _token = localStorage.getItem(tokenKey);
  let output = "";

  try {
    const { data } = await axios.delete(
      getUrl(
        "services/2021-07/group_handler_linking/" +
          handler_group_id.toString() +
          "/" +
          handler_id.toString()
      ),
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + _token
        }
      }
    );
    if (data._return_code === 200 && data._return_message === "OK") {
      output = "success";
    }
  } catch ({ response }) {
    if (response) {
      output = response.data?.["_return_message"] || "Error";
    }
  }

  return output;
};

export {
  _getGroups,
  _deleteGroup,
  _addGroup,
  _getTotalCount,
  _linkHandlerAndGroup,
  _unLinkHandlerAndGroup
};
