import { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './src/features/auth/screens/LoginScreen';
import {
  clearAuthSession,
  getAuthSession,
} from './src/features/auth/services/authSession';
import HomeScreen from './src/features/home/screens/HomeScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const bootstrapSession = async () => {
      const currentSession = await getAuthSession();

      if (currentSession?.user?.name) {
        setUserName(currentSession.user.name);
      }

      setIsBootstrapping(false);
    };

    bootstrapSession();
  }, []);

  const handleLogout = async () => {
    await clearAuthSession();
    setUserName(null);
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#fefce8"
      />
      {isBootstrapping ? (
        <View className="flex-1 items-center justify-center bg-amber-50">
          <ActivityIndicator size="large" color="#047857" />
        </View>
      ) : userName ? (
        <HomeScreen userName={userName} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={payload => setUserName(payload.userName)} />
      )}
    </SafeAreaProvider>
  );
}

export default App;
