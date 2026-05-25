import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../components/Header';
import RootStackParamList from '../../interfaces/RootStackParamList';

export default () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Profil'>>();
  const { user, handleLogout } = useAuth();
  const isLoggedIn = Boolean(user);
  const onLogoutPress = async () => {
    await AsyncStorage.removeItem('token');
    handleLogout();
  };

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <Header title="PROFIL" />
      
      <View className="p-4">
        <View className="bg-white p-6 rounded-3xl">
          <Text className="text-2xl font-bold text-sky-900">
            {isLoggedIn ? `Halo, ${user?.name}` : 'Halo, Tamu'}
          </Text>

          {!isLoggedIn ? (
            <Text className="mt-2 text-base text-slate-600">
              Masuk untuk mendapatkan pengalaman belanja yang lebih cepat dan personal.
            </Text>
          ) : (
            <View>
              <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
                <Text className="text-sm text-slate-700">
                  Nama: {user?.name ?? 'Tidak tersedia'}
                </Text>
                <Text className="text-sm text-slate-700">
                  Email: {user?.email ?? 'Tidak tersedia'}
                </Text>
                <Text className="text-sm text-slate-700">
                  Nomor Telepon: {user?.no_hp ?? 'Tidak tersedia'}`
                </Text>
              </View>
              <View className='flex-col gap-3 mb'>
                {['Profil Saya', 'Riwayat Pesanan', 'Pengaturan'].map(item => (
                  <Pressable
                    key={item}
                    className="rounded-2xl bg-white px-4 py-4 shadow"
                  >
                    <Text className="text-base font-medium text-slate-800">{item}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

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
      </View>
    </SafeAreaView>
  );
};
