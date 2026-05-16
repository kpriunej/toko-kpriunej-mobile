import { useState } from 'react';
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

import { login, me } from '../services/authService';
import { saveAuthSession } from '../services/authSession';

type LoginScreenProps = {
  onLoginSuccess?: (payload: { token: string; userName: string }) => void;
  onBackToHome?: () => void;
};

export default function LoginScreen({ onLoginSuccess, onBackToHome }: LoginScreenProps) {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!loginInput.trim() || !password.trim()) {
      setErrorMessage('Login dan password wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const response = await login({
        login: loginInput.trim(),
        password,
      });

      if (!response.token) {
        throw new Error('Response login tidak lengkap.');
      }

      const responseMe = await me(response.token);

      await saveAuthSession({
        token: response.token,
        user: responseMe,
      });

      Alert.alert('Login berhasil', response.message ?? 'Selamat datang kembali!');
      onLoginSuccess?.({ token: response.token, userName: responseMe.name });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login gagal.';
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
                  <Text className="text-sm font-semibold text-stone-800">User</Text>
                  <TextInput
                    value={loginInput}
                    onChangeText={setLoginInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Masukkan username atau email"
                    placeholderTextColor="#94a3b8"
                    className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-base text-stone-900"
                  />
                </View>

                <View className="mt-5">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-stone-800">Password</Text>
                    <Pressable onPress={() => setSecureTextEntry(current => !current)}>
                      <Text className="text-sm font-semibold text-emerald-700">
                        {secureTextEntry ? 'Tampilkan' : 'Sembunyikan'}
                      </Text>
                    </Pressable>
                  </View>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
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
                    <Text className="text-sm font-semibold text-emerald-700">
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
                  className="mt-8 rounded-2xl bg-emerald-700 px-4 py-4 active:bg-emerald-800 disabled:opacity-60"
                >
                  <Text className="text-center text-base font-bold text-white">
                    {isSubmitting ? 'Memproses...' : 'Masuk'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={onBackToHome}
                  className="mt-4 rounded-2xl border border-stone-200 px-4 py-4 active:bg-stone-50"
                >
                  <Text className="text-center text-base font-semibold text-stone-700">
                    Beranda
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
