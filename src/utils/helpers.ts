import { Alert } from "react-native";
import { API_URL } from "../constants/ApiService";

/**
 * Show an error alert with a given message.
 * 
 * @param {string} message The message to display in the alert.
 * @returns {void}
 */
export const showErrorAlert = (message: string): void => {
  Alert.alert("Failed", message, [{ text: "OK", style: "default" }]);
};

/**
 * Show a success alert with a given message.
 * 
 * @param {string} message The message to display in the alert.
 * @return {void}
 */
export const showSuccessAlert = (message: string): void => {
  Alert.alert("Success", message, [{ text: "OK", style: "default" }]);
}

/**
 * Constructs a full API URL by appending the endpoint to the base API URL.
 * 
 * @param {string} endpoint The API endpoint to append.
 * @returns {string} The full API URL.
 */
export const apiUrl = (endpoint: string): string => {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.substring(1);
  }
  return `${API_URL}/${endpoint}`;
}

/**
 * Formats a numeric value using locale separators.
 *
 * @param value Value to format.
 * @param locale Locale code, default is `id-ID`.
 * @returns {string} Formatted string value or the original value if invalid.
 */
export const formatCurrency = (value: string | number | null | undefined, locale = "id-ID") : string => {
	const amount = Number(value);

	if (Number.isNaN(amount)) {
		return String(value ?? "");
	}

	return amount.toLocaleString(locale, {
		minimumFractionDigits: 0,
	});
}
