import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '../../../services/api.services';
import { apiUrl } from '../../../utils/helpers';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../../../components/auth/Header';

type RootStackParamList = {
  Main: undefined;
  Login: undefined;
};

export default () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();

  const [user, setUser] = useState({ 
    email: '',
    no_hp: '',
    name: '',
    password: '',
    password_confirmation: ''
  });
  const [secureTextEntry, setSecureTextEntry] = useState({
    password: true,
    password_confirmation: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    name: [''],
    email: [''],
    no_hp: [''],
    password: [''],
    password_confirmation: [''],
  });

  const handleRegistration = async () => {
    setIsSubmitting(true);
    
    const response = await apiService('POST',apiUrl('/api/auth/register'), {
      data: {
        name: user.name,
        email: user.email,
        no_hp: user.no_hp,
        password: user.password,
        password_confirmation: user.password_confirmation,
      }
    });
    if (response.status === 200) {
      Alert.alert('Alhamdullilah', response.data.message || 'Pendaftaran berhasil. Silakan verifikasi email anda agar dapat login dengan akun Anda.', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);
      navigation.replace('Login');
    } else if (response.data?.errors) {
      setErrorMessage((prev) => ({...prev, ...response.data.errors}));
    } else {
      Alert.alert('Error', response.data?.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-6 py-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-between">
            <View>
              <Header />
              <View className="-mt-6 rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
                <View>
                  <Text className="text-sm font-semibold text-stone-800">Nama</Text>
                  <TextInput
                    value={user?.name || ''}
                    onChangeText={(text) => {
                      setUser((prev) => ({ ...prev, name: text }))
                      setErrorMessage((prev) => ({ ...prev, name: [''] }));
                    }}
                    keyboardType="default"
                    autoCapitalize="words"
                    placeholder="Masukkan nama lengkap"
                    placeholderTextColor="#94a3b8"
                    className={`mt-3 rounded-2xl border ${errorMessage?.name?.[0] !== '' ? "border-red-200 bg-red-50" : "border-stone-200 bg-stone-50"} px-4 py-4 text-base text-stone-900`}
                  />
                  {errorMessage?.name?.[0] !== '' ? (
                    <Text className="mt-1 text-xs font-medium text-rose-600">{errorMessage.name[0]}</Text>
                  ) : null}
                </View>
                <View className="mt-5">
                  <Text className="text-sm font-semibold text-stone-800">Email</Text>
                  <TextInput
                    value={user?.email || ''}
                    onChangeText={(text) => {
                      setUser((prev) => ({ ...prev, email: text }));
                      setErrorMessage((prev) => ({ ...prev, email: [''] }));
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Masukkan email"
                    placeholderTextColor="#94a3b8"
                    className={`mt-3 rounded-2xl border ${errorMessage?.email?.[0] !== '' ? "border-red-200 bg-red-50" : "border-stone-200 bg-stone-50"} px-4 py-4 text-base text-stone-900`}
                  />
                  {errorMessage?.email?.[0] !== '' ? (
                    <Text className="mt-1 text-xs font-medium text-rose-600">{errorMessage.email[0]}</Text>
                  ) : null}
                </View>
                <View className="mt-5">
                  <Text className="text-sm font-semibold text-stone-800">Nomor Telepon</Text>
                  <TextInput
                    value={user?.no_hp || ''}
                    onChangeText={(text) => {
                      setUser((prev) => ({ ...prev, no_hp: text }));
                      setErrorMessage((prev) => ({ ...prev, no_hp: [''] }));
                    }}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    placeholder="Masukkan nomor telepon"
                    placeholderTextColor="#94a3b8"
                    className={`mt-3 rounded-2xl border ${errorMessage?.no_hp?.[0] !== '' ? "border-red-200 bg-red-50" : "border-stone-200 bg-stone-50"} px-4 py-4 text-base text-stone-900`}
                  />
                  {errorMessage?.no_hp?.[0] !== '' ? (
                    <Text className="mt-1 text-xs font-medium text-rose-600">{errorMessage.no_hp[0]}</Text>
                  ) : null}
                </View>
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
                    value={user?.password || ''}
                    onChangeText={(text) => {
                      setUser((prev) => ({ ...prev, password: text }));
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
                    value={user?.password_confirmation || ''}
                    onChangeText={(text) => {
                      setUser((prev) => ({ ...prev, password_confirmation: text }));
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
                  onPress={handleRegistration}
                  disabled={isSubmitting}
                  className="mt-8 rounded-2xl bg-sky-700 px-4 py-4 active:bg-sky-800 disabled:opacity-60"
                >
                  <Text className="text-center text-base font-bold text-white">
                    {isSubmitting ? 'Memproses...' : 'Daftar'}
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
                  <Pressable onPress={() => navigation.replace('Login')}>
                    <Text className="text-sm font-semibold text-sky-700">
                      Sudah Punya Akun?
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
