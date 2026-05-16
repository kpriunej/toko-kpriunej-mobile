import Config from "react-native-config";

export const NETWORK_ERROR_MESSAGE = "We indicated an issue, no response from the server, please check your network connection or server is under maintenance, please try again later";

export const headers = {
  "X-APP-KEY": Config.X_APP_KEY,
  Accept: "application/json",
};