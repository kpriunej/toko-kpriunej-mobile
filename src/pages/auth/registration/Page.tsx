import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService, apiServicePost } from '../../../services/api.services';
import { apiUrl } from '../../../utils/helpers';
import useAuth from '../../../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  HomeTabs: undefined;
  Login: undefined;
};

export default () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();

  const [user, setUser] = useState({ 
    email: '',
    no_hp: '',
    name: '',
    password: '',
    confirm_password: ''
  });
  const [secureTextEntry, setSecureTextEntry] = useState({
    password: true,
    confirm_password: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegistration = async () => {
    if (!user.name.trim() || !user.email.trim() || !user.password.trim() || !user.confirm_password.trim()) {
      setErrorMessage('Semua field wajib diisi.');
      return;
    }

    if (user.password !== user.confirm_password) {
      setErrorMessage('Password dan konfirmasi password tidak cocok.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const response = await apiServicePost(apiUrl('/api/auth/register'), {
        name: user.name,
        email: user.email,
        no_hp: user.no_hp,
        password: user.password,
        confirm_password: user.confirm_password,
      });

      Alert.alert('Sukses', 'Pendaftaran berhasil. Silakan login dengan akun Anda.', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Pendaftaran gagal.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
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
              <View className="rounded-[32px] bg-emerald-950 px-6 py-8 shadow-sm">
                <View className="items-center gap-3">
                  <View className="h-16 w-16 overflow-hidden rounded-2xl bg-white/10 p-2">
                    <Image
                      source={require('../../../../assets/icons/logo.jpg')}
                      className="h-full w-full"
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="text-xs font-semibold uppercase tracking-[3px] text-emerald-200">
                    TOKO ONLINE
                  </Text>
                </View>
                <Text className="mt-6 text-base leading-6 text-center text-emerald-100">
                  KPRI Universitas Jember
                </Text>
              </View>

              <View className="-mt-6 rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
                <View>
                  <Text className="text-sm font-semibold text-stone-800">Nama</Text>
                  <TextInput
                    value={user?.name || ''}
                    onChangeText={(text) => setUser((prev) => ({ ...prev, name: text }))}
                    keyboardType="default"
                    autoCapitalize="words"
                    placeholder="Masukkan nama lengkap"
                    placeholderTextColor="#94a3b8"
                    className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-base text-stone-900"
                  />
                </View>
                <View className="mt-5">
                  <Text className="text-sm font-semibold text-stone-800">Email</Text>
                  <TextInput
                    value={user?.email || ''}
                    onChangeText={(text) => setUser((prev) => ({ ...prev, email: text }))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Masukkan email"
                    placeholderTextColor="#94a3b8"
                    className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-base text-stone-900"
                  />
                </View>
                <View className="mt-5">
                  <Text className="text-sm font-semibold text-stone-800">Nomor Telepon</Text>
                  <TextInput
                    value={user?.no_hp || ''}
                    onChangeText={(text) => setUser((prev) => ({ ...prev, no_hp: text }))}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    placeholder="Masukkan nomor telepon"
                    placeholderTextColor="#94a3b8"
                    className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-base text-stone-900"
                  />
                </View>
                <View className="mt-5">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-stone-800">Password</Text>
                    <Pressable onPress={() => setSecureTextEntry(current => ({ ...current, password: !current.password }))}>
                      <Text className="text-sm font-semibold text-emerald-700">
                        {secureTextEntry.password ? 'Tampilkan' : 'Sembunyikan'}
                      </Text>
                    </Pressable>
                  </View>
                  <TextInput
                    value={user?.password || ''}
                    onChangeText={(text) => setUser((prev) => ({ ...prev, password: text }))}
                    autoCapitalize="none"
                    secureTextEntry={secureTextEntry.password}
                    placeholder="Masukkan password"
                    placeholderTextColor="#94a3b8"
                    className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-base text-stone-900"
                  />
                </View>
                <View className="mt-5">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-stone-800">Konfirmasi Password</Text>
                    <Pressable onPress={() => setSecureTextEntry(current => ({ ...current, confirm_password: !current.confirm_password }))}>
                      <Text className="text-sm font-semibold text-emerald-700">
                        {secureTextEntry.confirm_password ? 'Tampilkan' : 'Sembunyikan'}
                      </Text>
                    </Pressable>
                  </View>
                  <TextInput
                    value={user?.confirm_password || ''}
                    onChangeText={(text) => setUser((prev) => ({ ...prev, confirm_password: text }))}
                    autoCapitalize="none"
                    secureTextEntry={secureTextEntry.confirm_password}
                    placeholder="Masukkan konfirmasi password"
                    placeholderTextColor="#94a3b8"
                    className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-base text-stone-900"
                  />
                </View>


                {errorMessage ? (
                  <Text className="mt-4 text-sm font-medium text-rose-600">{errorMessage}</Text>
                ) : null}

                <Pressable
                  onPress={handleRegistration}
                  disabled={isSubmitting}
                  className="mt-8 rounded-2xl bg-emerald-700 px-4 py-4 active:bg-emerald-800 disabled:opacity-60"
                >
                  <Text className="text-center text-base font-bold text-white">
                    {isSubmitting ? 'Memproses...' : 'Daftar'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => navigation.replace('HomeTabs')}
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
                    <Text className="text-sm font-semibold text-emerald-700">
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
