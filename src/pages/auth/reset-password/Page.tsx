import { useState } from 'react';
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { apiService } from '../../../services/api.services';
import { apiUrl } from '../../../utils/helpers';
import RootStackParamList from '../../../interfaces/RootStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Layout from '../../../components/auth/Layout';

export default ({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'ResetPassword'>) => {
  const { email, token } = route.params;
  const [formInput, setFormInput] = useState({ 
    email: email,
    token: token,
    password: '',
    password_confirmation: ''
  });
  const [secureTextEntry, setSecureTextEntry] = useState({
    password: true,
    password_confirmation: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    email: [''],
    token: [''],
    password: [''],
    password_confirmation: [''],
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    
    const response = await apiService('POST',apiUrl('/api/auth/reset-password'), {
      data: {
        email: formInput.email,
        token: formInput.token,
        password: formInput.password,
        password_confirmation: formInput.password_confirmation,
      }
    });
    if (response.status === 200) {
      Alert.alert('Alhamdullilah', response.data.message || 'Reset password berhasil. Silakan login dengan akun Anda.', [
        { text: 'OK', onPress: () => navigation.replace('Login', { verified: 'false' }) },
      ]);
      navigation.replace('Login', { verified: 'false' });
    } else if (response.data?.errors) {
      setErrorMessage((prev) => ({...prev, ...response.data.errors}));
    } else {
      Alert.alert('Error', response.data?.message || 'Terjadi kesalahan saat mereset password. Silakan coba lagi.');
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <View className="-mt-6 rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
        <View className="mt-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-stone-800">Password</Text>
            <Pressable onPress={() => setSecureTextEntry(current => ({ ...current, password: !current.password }))}>
              <Text className="text-sm font-semibold text-sky-700">
                {secureTextEntry.password ? 'Tampilkan' : 'Sembunyikan'}
              </Text>
            </Pressable>
          </View>
          <TextInput
            value={formInput.password || ''}
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
        <View className="mt-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-stone-800">Konfirmasi Password</Text>
            <Pressable onPress={() => setSecureTextEntry(current => ({ ...current, password_confirmation: !current.password_confirmation }))}>
              <Text className="text-sm font-semibold text-sky-700">
                {secureTextEntry.password_confirmation ? 'Tampilkan' : 'Sembunyikan'}
              </Text>
            </Pressable>
          </View>
          <TextInput
            value={formInput.password_confirmation || ''}
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

        <Pressable
          onPress={handleSubmit}
          disabled={isLoading}
          className="mt-8 rounded-2xl bg-sky-700 px-4 py-4 active:bg-sky-800 disabled:opacity-60"
        >
          <Text className="text-center text-base font-bold text-white">
            {isLoading ? 'Memproses...' : 'Reset Password'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.replace('Main')}
          className="mt-4 rounded-2xl border border-stone-200 px-4 py-4 active:bg-stone-50"
        >
          <Text className="text-center text-base font-semibold text-stone-700">
            Beranda
          </Text>
        </Pressable>

        <View
          className="mt-5 flex-row items-center justify-center"
        >
          <Pressable onPress={() => navigation.replace('Login', { verified: 'false' })}>
            <Text className="text-sm font-semibold text-sky-700">
              Sudah Punya Akun?
            </Text>
          </Pressable>
        </View>
      </View>
    </Layout>
  );
}
