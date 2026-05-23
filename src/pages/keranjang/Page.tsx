import { Pressable, Text, View, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { apiUrl } from '../../utils/helpers';
import CartItem from '../../interfaces/CartItem';
import { getCart, updateCartItemQuantity, clearCart } from '../../services/cartService';
import { apiService } from '../../services/api.services';
import useAuth from '../../hooks/useAuth';
import Header from '../../components/Header';
import RenderItem from '../../components/keranjang/RenderItem';
import Footer from '../../components/keranjang/Footer';

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
      <SafeAreaView className="flex-1 bg-sky-50">
        <Header title="Keranjang Belanja" />
        <View className="p-4">
          <View className="p-6 bg-white rounded-3xl">
            <Text className="text-base text-slate-600">
              Keranjangmu masih kosong. Yuk tambahkan produk favorit kamu!
            </Text>

            <View className="mt-6 rounded-3xl bg-sky-50 p-5">
              <Text className="text-lg font-semibold text-sky-900">Tips Belanja</Text>
              <Text className="mt-2 text-sm text-slate-700">
                Gunakan fitur cari untuk menemukan produk dengan cepat. Kami akan menyimpan
                favoritmu agar mudah dibeli lagi.
              </Text>
            </View>
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
      <Header title={
        <View className="flex-1">
          <Text className="mr-2 text-xl font-semibold text-white">Keranjang Belanja</Text>
          <Text className="text-sm font-semibold text-white">Total Item: {totalItems}</Text>
        </View>
      } />
      <View className="flex-1 px-3">
        <FlatList
          data={cart}
          keyExtractor={(item) => item.idtab.toString()}
          ListHeaderComponent={<View className="mt-4" />}
          renderItem={({ item }) => <RenderItem item={item} handleQuantityChange={handleQuantityChange}/>}
          scrollEnabled
          className="flex-1 px-0"
        />
      </View>
      <Footer
        total={total}
        handleClearCart={handleClearCart}
        handleCheckout={handleCheckout}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
};
