import { useEffect, useState } from 'react';
import {
  Alert,
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
import Header from '../../../components/auth/Header';

type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Pendaftaran: undefined;
};

export default () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();
  const { user, setUser } = useAuth();

  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const initializeAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token && user) {
        navigation.replace('Main');
      }
    };

    initializeAuth();
  }, [navigation, user]);

  const handleLogin = async () => {
    if (!loginInput.trim() || !password.trim()) {
      setErrorMessage('Login dan password wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const response = await apiServicePost(apiUrl('/api/auth/login'), {
        login: loginInput.trim(),
        password,
      });

      if (!response.data.token) {
        throw new Error(response.data?.message || 'Response login tidak lengkap.');
      }

      const responseMe = await apiService('get', apiUrl('/api/auth/me'), {
        headers: {
          Authorization: `Bearer ${response.data.token}`,
        },
      });

      await AsyncStorage.setItem('token', response.data.token);

      Alert.alert('Login berhasil', response.data.message ?? 'Selamat datang kembali!');
      setUser(responseMe.data.data);
      navigation.replace('Main');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login gagal.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
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
                  <Text className="text-sm font-semibold text-stone-800">User</Text>
                  <TextInput
                    value={loginInput}
                    onChangeText={setLoginInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Masukkan email atau nomor telepon"
                    placeholderTextColor="#94a3b8"
                    className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-base text-stone-900"
                  />
                </View>

                <View className="mt-5">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-stone-800">Password</Text>
                    <Pressable onPress={() => setSecureTextEntry(current => !current)}>
                      <Text className="text-sm font-semibold text-sky-700">
                        {secureTextEntry ? 'Tampilkan' : 'Sembunyikan'}
                      </Text>
                    </Pressable>
                  </View>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    secureTextEntry={secureTextEntry}
                    placeholder="Masukkan password"
                    placeholderTextColor="#94a3b8"
                    className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-base text-stone-900"
                  />
                </View>

                <View className="mt-5 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Switch
                      value={rememberMe}
                      onValueChange={setRememberMe}
                      trackColor={{ false: '#d6d3d1', true: '#34d399' }}
                      thumbColor="#ffffff"
                    />
                    <Text className="text-sm text-stone-700">Ingat saya</Text>
                  </View>
                  <Pressable>
                    <Text className="text-sm font-semibold text-sky-700">
                      Lupa password?
                    </Text>
                  </Pressable>
                </View>

                {errorMessage ? (
                  <Text className="mt-4 text-sm font-medium text-rose-600">{errorMessage}</Text>
                ) : null}

                <Pressable
                  onPress={handleLogin}
                  disabled={isSubmitting}
                  className="mt-8 rounded-2xl bg-sky-700 px-4 py-4 active:bg-sky-800 disabled:opacity-60"
                >
                  <Text className="text-center text-base font-bold text-white">
                    {isSubmitting ? 'Memproses...' : 'Masuk'}
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
                  <Pressable onPress={() => navigation.replace('Pendaftaran')}>
                    <Text className="text-sm font-semibold text-sky-700">
                      Belum Punya Akun?
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
