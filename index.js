/**
 * @format
 */

import 'react-native-reanimated';
import './global.css';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { Text, TextInput } from 'react-native';

// Mengunci font scaling untuk komponen Text
if (Text.defaultProps) {
  Text.defaultProps.allowFontScaling = false;
} else {
  Text.defaultProps = { allowFontScaling: false };
}

// Mengunci font scaling untuk komponen TextInput (inputan teks)
if (TextInput.defaultProps) {
  TextInput.defaultProps.allowFontScaling = false;
} else {
  TextInput.defaultProps = { allowFontScaling: false };
}
AppRegistry.registerComponent(appName, () => App);
