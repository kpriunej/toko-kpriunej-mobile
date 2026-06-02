import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './pages/auth/login/Page';
import LupaPasswordPage from './pages/auth/lupa-password/Page';
import VerifyCodePage from './pages/auth/verify-code/Page';
import ResetPasswordPage from './pages/auth/reset-password/Page';
import PendaftaranPage from './pages/auth/pendaftaran/Page';
import DetailPesananPage from './pages/pesanan/detail/Page';
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
                component={DetailPesananPage}
                options={{
                  headerShown: false
                }}
              />
              <Stack.Screen 
                name="Login"
                component={LoginPage}
                options={{
                  headerShown: false
                }}
              />
              <Stack.Screen 
                name="LupaPassword"
                component={LupaPasswordPage}
                options={{
                  headerShown: false
                }}
              />
              <Stack.Screen 
                name="VerifyCode"
                component={VerifyCodePage}
                options={{
                  headerShown: false
                }}
              />
              <Stack.Screen 
                name="ResetPassword"
                component={ResetPasswordPage}
                options={{
                  headerShown: false
                }}
              />
              <Stack.Screen 
                name="Pendaftaran"
                component={PendaftaranPage}
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