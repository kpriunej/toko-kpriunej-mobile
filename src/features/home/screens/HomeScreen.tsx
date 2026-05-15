import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type HomeScreenProps = {
  userName: string;
  onLogout: () => void;
};

export default function HomeScreen({ userName, onLogout }: HomeScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-emerald-50">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-3xl font-bold text-emerald-900">Beranda</Text>
        <Text className="mt-4 text-center text-lg text-emerald-800">
          Selamat datang, {userName}
        </Text>

        <Pressable
          onPress={onLogout}
          className="mt-10 rounded-2xl bg-emerald-700 px-6 py-4 active:bg-emerald-800"
        >
          <Text className="text-base font-semibold text-white">Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
