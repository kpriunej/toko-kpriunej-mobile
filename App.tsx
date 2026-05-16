import { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './src/features/auth/screens/LoginScreen';
import {
  clearAuthSession,
  getAuthSession,
} from './src/features/auth/services/authSession';
import HomeScreen from './src/features/home/screens/HomeScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isShowingLogin, setIsShowingLogin] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const bootstrapSession = async () => {
      const currentSession = await getAuthSession();

      if (currentSession?.user?.name) {
        setUserName(currentSession.user.name);
      }
    };

    bootstrapSession();
  }, []);

  const handleLoginSuccess = (payload: { token: string; userName: string }) => {
    setUserName(payload.userName);
    setIsShowingLogin(false);
  };

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
      {isShowingLogin ? (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onBackToHome={() => setIsShowingLogin(false)}
        />
      ) : (
        <HomeScreen
          userName={userName}
          onLogin={() => setIsShowingLogin(true)}
          onLogout={handleLogout}
        />
      )}
    </SafeAreaProvider>
  );
}

export default App;
