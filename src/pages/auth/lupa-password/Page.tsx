import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, Pressable, Text, TextInput, View } from "react-native"
import RootStackParamList from "../../../interfaces/RootStackParamList";
import { useState } from "react";
import Layout from "../../../components/auth/Layout";
import { apiService } from "../../../services/api.services";
import { apiUrl } from "../../../utils/helpers";

export default ({ navigation }: NativeStackScreenProps<RootStackParamList, 'LupaPassword'>) => {
  const [formInput, setFormInput] = useState({
    email: '',
  });

  const [errorMessage, setErrorMessage] = useState({
    email: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    const response = await apiService("post", apiUrl("/api/auth/reset-password/send-code"), {
      data: formInput
    });

    if (response.status === 200) {
      Alert.alert("Berhasil", "Kode verifikasi telah dikirim ke email Anda.");
      navigation.replace('VerifyCode', { email: formInput.email });
    } else if (response.status === 422) {
      setErrorMessage({ ...errorMessage, ...response.data.errors });
    } else {
      Alert.alert("Gagal", response.data.message || "Terjadi kesalahan. Silakan coba lagi.");
    }

    setIsLoading(false);
  };

  return (
    <Layout>
      <View className="-mt-6 rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
        <View>
          <Text className="text-sm font-semibold text-stone-800">Email</Text>
          <TextInput
            value={formInput.email}
            onChangeText={(text) => setFormInput({ ...formInput, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Masukkan email"
            placeholderTextColor="#94a3b8"
            className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-base text-stone-900"
          />
        </View>

        {errorMessage.email ? (
          <Text className="mt-4 text-sm font-medium text-rose-600">{errorMessage.email}</Text>
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
          <Pressable onPress={() => navigation.replace('Login', { verified: 'false' })}>
            <Text className="text-sm font-semibold text-sky-700">
              Ingat Password?
            </Text>
          </Pressable>
        </View>
      </View>
    </Layout>
  )
}