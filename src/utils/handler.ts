import axios from "axios";
import { getUrl } from "./proxy";

const tokenKey = "avhd_dashboard_token";

const _getTotalCount = async (_group_id: any = -1): Promise<any> => {
  const _token = localStorage.getItem(tokenKey);
  let output = null;
  let params;
  if(_group_id != -1) {
    params = {
        search: {handler_group_id: _group_id, state: "active", limit: 0}
    };
  }
  else {
    params = {
        search: { state: "active", limit: 0 }
    };
  }
  try {
    const { data } = await axios.get(getUrl("services/2021-07/handlers"), {
      params: params
    });
    if (data._return_code === 200 && data._return_message === "OK") {
      output = data.handlers.length;
    }
  } catch ({ response }) {
    if (response) {
      output = null;
    }
  }
  return output;
};

const _getHandlers = async (_group_id: number, _state: string, _limit: number, _step: number = 0): Promise<any> => {
  const _token = localStorage.getItem(tokenKey);
  let output = null;
  let params;
  if(_group_id != -1) {
    params = {
        search: {handler_group_id: _group_id, state: "active", limit: 0}
    };
  }
  else {
    params = {
        search: { state: "active", limit: 0 }
    };
  }
  try {
    const { data } = await axios.get(getUrl("services/2021-07/handlers"), {
      params: params
    });
    if (data._return_code === 200 && data._return_message === "OK") {
      output = data.handlers;
    }
  } catch ({ response }) {
    if (response) {
      output = null;
    }
  }
  return output;
};

const _getHandlersByGroup = async (
  _group_id: string,
  _state: string,
  _limit: number = 0,
  _step: number = 0
): Promise<any> => {
  const _token = localStorage.getItem(tokenKey);
  let output = null;
  try {
    const { data } = await axios.get(getUrl("services/2021-07/handlers"), {
      params: {
        search: { handler_group_id: _group_id, state: _state, limit: _limit, start: _step }
      }
    });
    if (data._return_code === 901 && data._return_message === "No hits") {
      output = null;
    } else if (data._return_code === 200 && data._return_message === "OK") {
      output = data.handlers;
    }
  } catch ({ response }) {
    if (response) {
      output = null;
    }
  }
  
  return output;
};
const _deleteHandler = async (handler_id: number): Promise<string> => {
  const _token = localStorage.getItem(tokenKey);
  let output = "";

  try {
    const { data } = await axios.delete(
      getUrl("services/2021-07/handlers/" + handler_id.toString()),
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

const _addHandler = async (
  username: string,
  password: string,
  email: string,
  description: string
): Promise<string> => {
  const _token = localStorage.getItem(tokenKey);
  let output = "";
  password = "test_password";
  try {
    const { data } = await axios.post(
      getUrl("services/2021-07/handlers"),
      {
        username: username,
        password: password,
        email: email,
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

export { _getHandlers, _getHandlersByGroup, _getTotalCount, _deleteHandler, _addHandler };
