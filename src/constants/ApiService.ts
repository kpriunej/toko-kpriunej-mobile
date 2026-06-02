import Config from "react-native-config";

export const NETWORK_ERROR_MESSAGE = "We indicated an issue, no response from the server, please check your network connection or server is under maintenance, please try again later";
export const API_URL = Config.API_URL || "https://toko.kpri-unej.com";
export const X_API_KEY = Config.X_API_KEY || "suksesselalu1999!";
export const headers = {
  "X-API-KEY": X_API_KEY,
  Accept: "application/json",
};