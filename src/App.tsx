import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './pages/auth/login/Page';
import PendaftaranScreen from './pages/auth/pendaftaran/Page';
import DetailPesananScreen from './pages/pesanan/detail/Page';
import MainTabBar from './navigations/main/TabBar';
import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import AuthSession from './services/AuthSession';
import RootStackParamList from './interfaces/RootStackParamList'; 

const Stack = createNativeStackNavigator<RootStackParamList>();
const linking = {
  prefixes: ['tokokpriunej://'],
  config: {
    screens: {
      Login: 'login',
    },
  },
};

export default () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AuthSession>
          <NavigationContainer linking={linking}>
            <Stack.Navigator>
              <Stack.Screen 
                name="Main"
                component={MainTabBar}
                options={{
                  headerShown: false
                }}
              />
              <Stack.Screen 
                name="DetailPesanan"
                component={DetailPesananScreen}
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
        </AuthSession>
      </SafeAreaProvider>
    </Provider>
  );
}