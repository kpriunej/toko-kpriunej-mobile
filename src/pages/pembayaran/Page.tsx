import { Pressable, Text, View, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useState } from 'react';
import { apiUrl, formatCurrency } from '../../utils/helpers';
import CartItem from '../../interfaces/CartItem';
import { getCart } from '../../services/cartService';
import useAuth from '../../hooks/useAuth';
import { apiService } from '../../services/api.services';

type RootStackParamList = {
  Pembayaran: undefined;
  Login: undefined;
  Main: undefined;
};

export default () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Pembayaran'>>();
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(() => {
    loadCart();
  });

  const loadCart = async () => {
    const data = await getCart();
    setCart(data);
  };

  const handleBayar = async () => {
    Alert.alert(
      'Konfirmasi Pembayaran',
      'Apakah Anda yakin ingin melakukan pembayaran?',
      [
        {
          text: 'Tidak',
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: async () => {
            setIsLoading(true);
            const response = await apiService('POST', apiUrl('/api/pembayaran'), {
              data: {
                total: total,
                user_id: user?.id,
              },
            });
            if (response.status === 200) {
              Alert.alert('Pembayaran Berhasil', response.data.message, [
                { text: 'OK', onPress: () => navigation.replace('Main') },
              ])
            } else {
              Alert.alert('Error', response.data?.message || 'Terjadi kesalahan saat melakukan pembayaran. Silakan coba lagi.');
            }
            setIsLoading(false);
          },
        },
      ],
    );
  };

  const total = cart.reduce((sum, item) => sum + (item.hargajual1 ?? 0) * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <View className="flex-1">
        <View className="flex-row items-center gap-4 border-b border-emerald-200 bg-white px-4 py-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="flex-row items-center gap-4"
          >
            <FontAwesome5 name="arrow-left" size={18} color="emerald" />
          </Pressable>
          <View>
            <Text className="text-2xl font-bold text-emerald-900">Pembayaran</Text>
            <Text className="text-sm text-slate-600">{totalItems} item</Text>
          </View>
        </View>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.idtab.toString()}
          renderItem={({ item }) => (
            <View className="border-b border-emerald-100 bg-white px-4 py-3">
              <View className="flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                    {item.kode_barang}
                  </Text>
                  <Text className="mt-1 text-base font-bold text-emerald-950">
                    {item.nama_barang}
                  </Text>
                  <Text className="mt-1 text-sm font-semibold text-amber-900">
                    {item.quantity} x {formatCurrency(item.hargajual1 ?? 0)}/{item.nama_kemasan ? item.nama_kemasan.substring(3) : '-'}
                  </Text>
                </View>

                <View className="ml-2 items-end align-self-center">
                  <Text className="text-lg font-bold text-emerald-900">
                    {formatCurrency((item.hargajual1 ?? 0) * item.quantity)}
                  </Text>
                </View>
              </View>
            </View>
          )}
          scrollEnabled
          className="flex-1 px-0"
        />

        <View className="border-t border-emerald-200 bg-white px-4 py-4">
          <View className="mb-3 flex-row justify-between">
            <Text className="text-lg font-semibold text-slate-700">Total:</Text>
            <Text className="text-xl font-bold text-emerald-900">{formatCurrency(total)}</Text>
          </View>
          
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleBayar}
              className="flex-1 rounded-xl bg-sky-700 py-3 active:bg-sky-800"
              disabled={isLoading}
            >
              <Text className="text-center font-semibold text-white">
                {isLoading ? 'Sedang memproses...' : 'Bayar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
