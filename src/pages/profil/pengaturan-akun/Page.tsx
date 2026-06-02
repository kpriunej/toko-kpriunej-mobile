import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { useState } from 'react';
import { apiService } from '../../../services/api.services';
import { apiUrl } from '../../../utils/helpers';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RootStackParamList from '../../../interfaces/RootStackParamList';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

type Props = NativeStackScreenProps<RootStackParamList, 'PengaturanAkun'>;

export default ({ navigation }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    current_password: [''],
    password: [''],
    password_confirmation: [''],
  });
  const [formInput, setFormInput] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [secureTextEntry, setSecureTextEntry] = useState({
    current_password: true,
    password: true,
    password_confirmation: true,
  });

  const handleSubmit = async () => {
    setIsLoading(true);

    const response = await apiService("post", apiUrl("/api/auth/change-password"), {
      data: formInput
    });

    if (response.status === 200) {
      Alert.alert("Berhasil", "Password berhasil diubah.");
      setFormInput({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
    } else if (response.status === 422) {
      setErrorMessage({ ...errorMessage, ...response.data.errors });
    } else {
      Alert.alert("Gagal", response.data.message || "Terjadi kesalahan. Silakan coba lagi.");
    }

    setIsLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <Header
        title={
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View pointerEvents="none">
                <FontAwesome5Icon name="arrow-left" size={24} color="white" />
              </View>
            </TouchableOpacity>
            <Text className="ml-2 text-lg font-semibold text-white">PENGATURAN AKUN</Text>
          </>
        }
      />
      <View className="p-4">
        <View className="bg-white p-6 rounded-3xl">
          <Text className="text-lg font-bold text-sky-900">
            Ganti Password
          </Text>
          <Text className="text-xs text-slate-600">
            Ubah password akun Anda secara berkala untuk menjaga keamanan akun.
          </Text>

          <View className="mt-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-stone-800">Password Saat Ini</Text>
              <TouchableOpacity onPress={() => setSecureTextEntry(current => ({ ...current, current_password: !current.current_password }))}>
                <Text className="text-sm font-semibold text-sky-700">
                  {secureTextEntry.current_password ? 'Tampilkan' : 'Sembunyikan'}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              value={formInput?.current_password || ''}
              onChangeText={(text) => {
                setFormInput((prev) => ({ ...prev, current_password: text }));
                setErrorMessage((prev) => ({ ...prev, current_password: [''] }));
              }}
              autoCapitalize="none"
              secureTextEntry={secureTextEntry.current_password}
              placeholder="Masukkan password"
              placeholderTextColor="#94a3b8"
              className={`mt-3 rounded-2xl border ${errorMessage?.current_password?.[0] !== '' ? "border-red-200 bg-red-50" : "border-stone-200 bg-stone-50"} px-4 py-4 text-base text-stone-900`}
            />
            {errorMessage?.current_password?.[0] !== '' ? (
              <Text className="mt-1 text-xs font-medium text-rose-600">{errorMessage.current_password[0]}</Text>
            ) : null}
          </View>
          <View className="mt-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-stone-800">Password Baru</Text>
              <TouchableOpacity onPress={() => setSecureTextEntry(current => ({ ...current, password: !current.password }))}>
                <Text className="text-sm font-semibold text-sky-700">
                  {secureTextEntry.password ? 'Tampilkan' : 'Sembunyikan'}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              value={formInput?.password || ''}
              onChangeText={(text) => {
                setFormInput((prev) => ({ ...prev, password: text }));
                setErrorMessage((prev) => ({ ...prev, password: [''] }));
              }}
              autoCapitalize="none"
              secureTextEntry={secureTextEntry.password}
              placeholder="Masukkan password"
              placeholderTextColor="#94a3b8"
              className={`mt-3 rounded-2xl border ${errorMessage?.password?.[0] !== '' ? "border-red-200 bg-red-50" : "border-stone-200 bg-stone-50"} px-4 py-4 text-base text-stone-900`}
            />
            {errorMessage?.password?.[0] !== '' ? (
              <Text className="mt-1 text-xs font-medium text-rose-600">{errorMessage.password[0]}</Text>
            ) : null}
          </View>
          <View className="mt-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-stone-800">Konfirmasi Password Baru</Text>
              <TouchableOpacity onPress={() => setSecureTextEntry(current => ({ ...current, password_confirmation: !current.password_confirmation }))}>
                <Text className="text-sm font-semibold text-sky-700">
                  {secureTextEntry.password_confirmation ? 'Tampilkan' : 'Sembunyikan'}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              value={formInput?.password_confirmation || ''}
              onChangeText={(text) => {
                setFormInput((prev) => ({ ...prev, password_confirmation: text }));
                setErrorMessage((prev) => ({ ...prev, password_confirmation: [''] }));
              }}
              autoCapitalize="none"
              secureTextEntry={secureTextEntry.password_confirmation}
              placeholder="Masukkan konfirmasi password"
              placeholderTextColor="#94a3b8"
              className={`mt-3 rounded-2xl border ${errorMessage?.password_confirmation?.[0] !== '' ? "border-red-200 bg-red-50" : "border-stone-200 bg-stone-50"} px-4 py-4 text-base text-stone-900`}
            />
            {errorMessage?.password_confirmation?.[0] !== '' ? (
              <Text className="mt-1 text-xs font-medium text-rose-600">{errorMessage.password_confirmation[0]}</Text>
            ) : null}
          </View>
  
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            className="mt-8 rounded-2xl bg-sky-700 px-4 py-4"
          >
            <Text className="text-center text-base font-bold text-white">
              {isLoading ? 'Memproses...' : 'Ganti Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
