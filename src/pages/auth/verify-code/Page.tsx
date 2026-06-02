import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, Pressable, Text, TextInput, View } from "react-native"
import RootStackParamList from "../../../interfaces/RootStackParamList";
import { useEffect, useState } from "react";
import Layout from "../../../components/auth/Layout";
import { apiService } from "../../../services/api.services";
import { apiUrl } from "../../../utils/helpers";

export default ({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'VerifyCode'>) => {
  const { email } = route.params;
  const [timer, setTimer] = useState(60);
  const [formInput, setFormInput] = useState({
    email: email,
    token: '',
  });

  const [errorMessage, setErrorMessage] = useState({
    email: '',
    token: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    const response = await apiService("post", apiUrl("/api/auth/reset-password/verify-code"), {
      data: formInput
    });

    if (response.status === 200) {
      Alert.alert("Berhasil", "Kode verifikasi berhasil diverifikasi. Silakan buat password baru Anda.");
      navigation.replace('ResetPassword', { email: formInput.email, token: formInput.token });
    } else if (response.status === 422) {
      setErrorMessage({ ...errorMessage, ...response.data.errors });
    } else {
      Alert.alert("Gagal", response.data.message || "Terjadi kesalahan. Silakan coba lagi.");
    }

    setIsLoading(false);
  };

  const handleResend = async () => {
    setIsLoading(true);

    const response = await apiService("post", apiUrl("/api/auth/reset-password/send-code"), {
      data: { email: formInput.email }
    });

    if (response.status === 200) {
      Alert.alert("Berhasil", "Kode verifikasi telah dikirim ulang ke email Anda.");
    } else {
      Alert.alert("Gagal", response.data.message || "Terjadi kesalahan. Silakan coba lagi.");
    }

    setTimer(60);
    setIsLoading(false);
  };

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    }
  }, [timer]);

  return (
    <Layout>
      <View className="-mt-6 rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
        <View>
          <Text className="text-sm font-semibold text-stone-800">Code</Text>
          <TextInput
            value={formInput.token}
            onChangeText={(text) => setFormInput({ ...formInput, token: text })}
            keyboardType="phone-pad"
            autoCapitalize="none"
            placeholder="Masukkan Code"
            placeholderTextColor="#94a3b8"
            className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-base text-stone-900"
          />
        </View>

        {errorMessage.token ? (
          <Text className="mt-4 text-sm font-medium text-rose-600">{errorMessage.token}</Text>
        ) : null}

        <Pressable
          onPress={handleSubmit}
          disabled={isLoading}
          className="mt-8 rounded-2xl bg-sky-700 px-4 py-4 active:bg-sky-800 disabled:opacity-60"
        >
          <Text className="text-center text-base font-bold text-white">
            {isLoading ? 'Memproses...' : 'Submit'}
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
          <Pressable 
            onPress={handleResend}
            disabled={timer > 0 || isLoading}
            className="flex-row items-center"
          >
            <Text className={`text-sm font-semibold text-sky-700 ${timer > 0 || isLoading ? 'opacity-60' : ''}`}>
              Kirim Ulang Code?
            </Text>
            {timer > 0 && (
              <Text className={`ml-2 text-sm font-semibold text-sky-700 ${timer > 0 || isLoading ? 'opacity-60' : ''}`}>
                ({timer})
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </Layout>
  )
}