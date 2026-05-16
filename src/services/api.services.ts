import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { headers, NETWORK_ERROR_MESSAGE } from "../constants/ApiService";
import { showErrorAlert } from "../utils/helpers";

const apiClient = axios.create({
  headers: headers,
});

const formatErrorMessage = (errorData: any, fallbackMessage = "Response error") => {
  const validationErrors = Object.values(errorData?.errors || {})
    .flat()
    .filter(Boolean);

  if (validationErrors.length > 0) {
    return [errorData?.message, ...validationErrors].filter(Boolean).join("\n");
  }

  return errorData?.message || fallbackMessage;
};

/**
 * Function to call an API using Axios
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {string} url - API endpoint
 * @param {object} [options] - Additional options for the request
 * @param {object} [options.headers] - Custom headers
 * @param {object} [options.params] - Query parameters
 * @param {object} [options.data] - Request body (for POST, PUT, etc.)
 * @returns {Promise<any>} - Response from the API
 */
export const apiService = async (method: string, url: string, options: any = {}): Promise<any> => {
  const { headers = {}, params = {}, data = {}, signal = null, cancelToken = null } = options;
  const token = await AsyncStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  try {
    const response = await axios({
      method,
      url: url,
      headers: { ...apiClient.defaults.headers, ...headers },
      params,
      data,
      signal,
      cancelToken,
    });
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }

    if (error.request) {
      console.log(error.request);
      showErrorAlert(NETWORK_ERROR_MESSAGE);
    } else {
      showErrorAlert(`Call API configuration error ${error.message}`);
    }

    return error;
  }
};

/**
 * Helper function for making POST API calls in React Native.
 *
 * @param {string} url API endpoint URL.
 * @param {object} data Request payload to send in the POST body.
 * @param {object} [options] Additional options for the request (e.g., headers).
 * @returns {Promise<object>} API response or error object.
 */
export const apiServicePost = async (url: string, data: any, options: any = {}): Promise<any> => {
  const response = await apiService("POST", url, { ...options, data });

  if (response?.status >= 400) {
    showErrorAlert(formatErrorMessage(response.data));
  }

  return response;
};

/**
 * Helper function for making DELETE API calls in React Native.
 *
 * @param {string} url API endpoint URL.
 * @param {object} [options] Additional options for the request (e.g., headers).
 * @param {number} [type=0] Optional type parameter for future use (currently unused).
 * @returns {Promise<object>} API response or error object.
 */
export const apiServiceDelete = async (url: string, options: any = {}, _type = 0): Promise<any> => {
  const response = await apiService("DELETE", url, options);

  if (response?.status >= 400) {
    showErrorAlert(formatErrorMessage(response.data));
  }

  return response;
};