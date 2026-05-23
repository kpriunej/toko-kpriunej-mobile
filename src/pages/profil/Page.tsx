import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Profil: undefined;
  Login: undefined;
};

export default () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Profil'>>();
  const { user, handleLogout } = useAuth();
  const isLoggedIn = Boolean(user);
  const onLogoutPress = async () => {
    await AsyncStorage.removeItem('token');
    handleLogout();
  };

  return (
    <SafeAreaView className="flex-1 bg-sky-50 px-4 pt-6 pb-28">
      <View className="rounded-3xl bg-white p-6 shadow-sm">
        <Text className="text-2xl font-bold text-sky-900">
          {isLoggedIn ? `Halo, ${user?.name}` : 'Halo, Tamu'}
        </Text>
        <Text className="mt-2 text-base text-slate-600">
          {isLoggedIn
            ? 'Selamat datang kembali. Lihat ringkasan akun dan kelola pesananmu di sini.'
            : 'Masuk untuk mendapatkan pengalaman belanja yang lebih cepat dan personal.'}
        </Text>

        <View className="mt-6 rounded-3xl bg-sky-50 p-5 shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="font-semibold text-slate-700">Status Akun</Text>
            <Text className="text-sky-800">
              {isLoggedIn ? 'Terautentikasi' : 'Guest'}
            </Text>
          </View>
          <View className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
            <Text className="text-sm text-slate-700">
              {isLoggedIn
                ? `Nama: ${user?.name ?? 'Tidak tersedia'}`
                : 'Kamu belum masuk. Tekan tombol login untuk mengakses semua fitur.'}
            </Text>
          </View>
        </View>

        <View className="mt-6 space-y-3">
          {isLoggedIn ? (
            ['Profil Saya', 'Riwayat Pesanan', 'Pengaturan'].map(item => (
              <Pressable
                key={item}
                className="rounded-2xl bg-white px-4 py-4 shadow-sm"
              >
                <Text className="text-base font-medium text-slate-800">{item}</Text>
              </Pressable>
            ))
          ) : (
            <View className="rounded-2xl bg-white px-4 py-4 shadow-sm">
              <Text className="text-base text-slate-700">
                Masuk sekarang untuk melihat profil lengkap, riwayat pesanan, dan daftar
                favoritmu.
              </Text>
            </View>
          )}
        </View>

        <Pressable
          onPress={isLoggedIn ? onLogoutPress : () => {
            navigation.replace('Login');
          }}
          className={`mt-6 rounded-2xl ${isLoggedIn ? 'bg-red-700' : 'bg-sky-700'} px-4 py-4 items-center active:bg-sky-800`}
        >
          <Text className="text-base font-bold text-white">
            {isLoggedIn ? 'Logout' : 'Login'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
