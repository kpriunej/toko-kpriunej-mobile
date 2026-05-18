import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainPage from './pages/Main';
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
        <MainPage />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
