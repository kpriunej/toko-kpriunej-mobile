import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './pages/auth/login/Page';
import PendaftaranScreen from './pages/auth/pendaftaran/Page';
import MainTabBar from './navigations/main/TabBar';
import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';

const Stack = createNativeStackNavigator();

function App() {
  useEffect(() => {
    // Sembunyikan splash screen setelah komponen selesai dimuat
    // Kamu juga bisa membungkusnya di dalam fungsi fetch data jika ada API yang harus dipanggil dulu
    SplashScreen.hide();
  }, []);
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen 
              name="Main"
              component={MainTabBar}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="Pendaftaran"
              component={PendaftaranScreen}
              options={{
                headerShown: false
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
