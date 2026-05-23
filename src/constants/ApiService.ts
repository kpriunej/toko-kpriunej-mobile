import Config from "react-native-config";

export const NETWORK_ERROR_MESSAGE = "We indicated an issue, no response from the server, please check your network connection or server is under maintenance, please try again later";
export const API_URL = Config.API_URL || "https://toko.kpri-unej.com";
export const X_APP_KEY = Config.X_APP_KEY || "suksesselalu";
export const headers = {
  "X-APP-KEY": X_APP_KEY,
  Accept: "application/json",
};