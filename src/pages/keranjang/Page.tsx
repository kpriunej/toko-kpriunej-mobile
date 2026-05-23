import { Pressable, Text, View, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useState } from 'react';
import { apiUrl, formatCurrency } from '../../utils/helpers';
import CartItem from '../../interfaces/CartItem';
import { getCart, updateCartItemQuantity, clearCart } from '../../services/cartService';
import { apiService } from '../../services/api.services';
import useAuth from '../../hooks/useAuth';

type RootStackParamList = {
  Keranjang: undefined;
  Login: undefined;
  Main: undefined;
  Pembayaran: undefined;
};

export default () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Keranjang'>>();
  const { user } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.hargajual1 ?? 0) * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useFocusEffect(() => {
    loadCart();
  });

  const loadCart = async () => {
    const data = await getCart();
    setCart(data);
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    await updateCartItemQuantity(itemId, newQuantity);
    await loadCart();
  };

  const handleCheckout = () => {
    if (user) {
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
              const response = await apiService('POST', apiUrl('/api/transaksi-jual-header'), {
                data: {
                  subtotal: total,
                  grandtotal: total,
                },
              });
              if (response.status === 200) {
                const uploadPromises = [];
                for (const item of cart) {
                  uploadPromises.push(
                    apiService('POST', apiUrl('/api/transaksi-jual-detail'), {
                      data: {
                        nomor_faktur: response.data.data.nomor_faktur,
                        tanggal_faktur: response.data.data.tanggal_transaksi,
                        tanggal_jthtempo: response.data.data.tanggal_jthtempo,
                        kode_barang: item.kode_barang,
                        nama_barang: item.nama_barang,
                        quantity: item.quantity,
                        harga: Number(item.hargajual1),
                        jumlah: Number(item.hargajual1) * item.quantity,
                        total: Number(item.hargajual1) * item.quantity,
                        kode_pelanggan: response.data.data.kode_pelanggan.toString(),
                        nama_pelanggan: response.data.data.nama_pelanggan,
                        id_user: response.data.data.id_user,
                        tanggal_transaksi: response.data.data.tanggal_transaksi
                      },
                    }),
                  );
                }
                const uploadResults = await Promise.all(uploadPromises);
  
                if (uploadResults.some((result) => result.status >= 400)) {
                  Alert.alert('Error', 'Terjadi kesalahan saat melakukan pembayaran. Silakan coba lagi.');
                  setIsLoading(false);
                  return;
                }

                await clearCart();
  
                Alert.alert('Alamdulillah', 'Pembayaran berhasil', [
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
    } else {
      navigation.navigate('Login');
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Hapus Semua Item',
      'Apakah kamu yakin ingin menghapus semua item dari keranjang?',
      [
        { text: 'Batal', onPress: () => {}, style: 'cancel' },
        {
          text: 'Hapus',
          onPress: async () => {
            await clearCart();
            await loadCart();
          },
          style: 'destructive',
        },
      ],
    );
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-sky-50 px-4 pt-6 pb-28">
        <View className="rounded-3xl bg-white p-6 shadow-sm">
          <Text className="text-2xl font-bold text-sky-900">Keranjang Belanja</Text>
          <Text className="mt-3 text-base text-slate-600">
            Keranjangmu masih kosong. Yuk tambahkan produk favorit kamu!
          </Text>

          <View className="mt-6 rounded-3xl bg-sky-50 p-5">
            <Text className="text-lg font-semibold text-sky-900">Tips Belanja</Text>
            <Text className="mt-2 text-sm text-slate-700">
              Gunakan fitur cari untuk menemukan produk dengan cepat. Kami akan menyimpan
              favoritmu agar mudah dibeli lagi.
            </Text>
          </View>

          <Pressable 
            onPress={() => navigation.replace('Main')} 
            className="mt-6 rounded-2xl bg-sky-700 px-5 py-4 items-center active:bg-sky-800"
          >
            <Text className="font-semibold text-white">Jelajah Produk</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <View className="flex-1">
        <View className="border-b border-sky-200 bg-white px-4 py-4">
          <Text className="text-2xl font-bold text-sky-900">Keranjang Belanja</Text>
          <Text className="mt-1 text-sm text-slate-600">{totalItems} item</Text>
        </View>

        <FlatList
          data={cart}
          keyExtractor={(item) => item.idtab.toString()}
          renderItem={({ item }) => (
            <View className="border-b border-sky-100 bg-white px-4 py-3">
              <View className="flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                    {item.kode_barang}
                  </Text>
                  <Text className="mt-1 text-base font-bold text-sky-950">
                    {item.nama_barang}
                  </Text>
                  <Text className="mt-1 text-sm font-semibold text-amber-900">
                    {formatCurrency(item.hargajual1 ?? 0)}/{item.nama_kemasan ? item.nama_kemasan.substring(3) : '-'}
                  </Text>
                </View>

                <View className="ml-2 items-end">
                  <Text className="text-lg font-bold text-sky-900">
                    {formatCurrency((item.hargajual1 ?? 0) * item.quantity)}
                  </Text>
                </View>
              </View>

              <View className="mt-3 flex-row items-center justify-between rounded-lg bg-gray-100 p-2">
                <Pressable
                  onPress={() => handleQuantityChange(item.idtab, item.quantity - 1)}
                  className="h-8 w-8 items-center justify-center rounded bg-sky-600 active:bg-sky-700"
                >
                  <FontAwesome5 name="minus" size={12} color="#fff" />
                </Pressable>

                <Text className="text-sm font-bold text-sky-900">{item.quantity}</Text>

                <Pressable
                  onPress={() => handleQuantityChange(item.idtab, item.quantity + 1)}
                  className="h-8 w-8 items-center justify-center rounded bg-sky-600 active:bg-sky-700"
                >
                  <FontAwesome5 name="plus" size={12} color="#fff" />
                </Pressable>
              </View>
            </View>
          )}
          scrollEnabled
          className="flex-1 px-0"
        />

        <View className="border-t border-sky-200 bg-white px-4 py-4">
          <View className="mb-3 flex-row justify-between">
            <Text className="text-lg font-semibold text-slate-700">Total:</Text>
            <Text className="text-xl font-bold text-sky-900">{formatCurrency(total)}</Text>
          </View>

          <View className="flex-row gap-3">
            <Pressable
              onPress={handleClearCart}
              className="flex-1 rounded-xl border border-rose-300 bg-rose-50 py-3 active:bg-rose-100"
            >
              <Text className="text-center font-semibold text-rose-700">Hapus Semua</Text>
            </Pressable>

            <Pressable
              onPress={handleCheckout}
              className="flex-1 rounded-xl bg-sky-700 py-3 active:bg-sky-800"
              disabled={isLoading}
            >
              <Text className="text-center font-semibold text-white">
                {isLoading ? 'Sedang memproses...' : 'Checkout'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
