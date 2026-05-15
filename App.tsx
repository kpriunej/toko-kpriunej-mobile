import { StatusBar, Text, View, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-slate-950 px-6 py-10">
      <View className="mt-6 rounded-3xl border border-slate-700 bg-slate-900 p-6">
        <Text className="text-2xl font-semibold text-white">TOKO KPRI UNEJ</Text>
        <Text className="mt-2 text-slate-300">
          Tailwind className sekarang bisa dipakai di React Native.
        </Text>
        <Text className="mt-4 rounded-xl bg-slate-800 p-3 text-xs text-slate-300">
          Safe Area Insets: {JSON.stringify(safeAreaInsets)}
        </Text>
      </View>
    </View>
  );
}

export default App;
