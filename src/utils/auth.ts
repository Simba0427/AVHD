import axios from "axios";
import { getUrl } from "./proxy";

interface AuthenticateResponse {
  _state?: string;
  _api_user_id?: string;
  _created?: string;
  _timeout?: string;
  _session_salt?: string;
  _token?: string;
  _return_code: number;
  _return_message: string;
}

const tokenKey = "avhd_dashboard_token";
const timeoutKey = "avhd_dashboard_timeout";
const login = async (username: string, password: string): Promise<string> => {
  const formData = new FormData();

  let output = "";

  formData.append("username", username.trim());
  formData.append("password", password.trim());

  try {
    const { data } = await axios.post<AuthenticateResponse>(
      getUrl("services/2021-05/tokens"),
      formData,
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "multipart/form-data"
        }
      }
    );

    if (data._return_code === 200 && data._return_message === "OK") {
      const fullData = data as Required<AuthenticateResponse>;
      localStorage.setItem(tokenKey, fullData._token);
      localStorage.setItem(timeoutKey, fullData._timeout);
    }
  } catch ({ response }) {
    if (response) {
      output = response.data?.["_return_message"] || "Error";
    }
  }

  return output;
};
const logout = (): void => {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(timeoutKey);
  window.location.reload();
};
const getAccessToken = (): string | null => {
  const token = localStorage.getItem(tokenKey);
  const timeout = localStorage.getItem(timeoutKey);

  if (token && timeout) {
    const timeoutTime = new Date(timeout).getTime();
    const currentTime = new Date().getTime();

    if (currentTime >= timeoutTime) {
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(timeoutKey);

      return null;
    }

    return token;
  }

  return null;
};
const isAuthenticated = (): boolean => {
  return Boolean(getAccessToken());
};

export { login, logout, getAccessToken, isAuthenticated };
