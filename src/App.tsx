import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './pages/Main';
import LoginScreen from './pages/auth/login/Page';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Provider store={store}>

      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen 
              name="Home"
              component={MainScreen}
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
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
