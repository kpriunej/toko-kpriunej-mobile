import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomePage from './pages/home/Page';
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="#fefce8"
        />
        <HomePage />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
