import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  HomeTabs: undefined;
  Login: undefined;
};


export default () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'HomeTabs'>>();
  return (
    <SafeAreaView className="flex-1 bg-lime-50 px-4 pt-6 pb-28">
      <View className="rounded-3xl bg-white p-6 shadow-sm">
        <Text className="text-2xl font-bold text-emerald-900">Keranjang Belanja</Text>
        <Text className="mt-3 text-base text-slate-600">
          Keranjangmu masih kosong. Yuk tambahkan produk favorit kamu!
        </Text>

        <View className="mt-6 rounded-3xl bg-emerald-50 p-5">
          <Text className="text-lg font-semibold text-emerald-900">Tips Belanja</Text>
          <Text className="mt-2 text-sm text-slate-700">
            Gunakan fitur cari untuk menemukan produk dengan cepat. Kami akan menyimpan
            favoritmu agar mudah dibeli lagi.
          </Text>
        </View>

        <Pressable 
          onPress={() => navigation.replace('HomeTabs')} 
          className="mt-6 rounded-2xl bg-emerald-700 px-5 py-4 items-center active:bg-emerald-800"
        >
          <Text className="font-semibold text-white">Jelajah Produk</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
