import { Alert, Pressable, Text, View } from "react-native";
import { apiUrl, formatCurrency } from "../../utils/helpers";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { apiService } from "../../services/api.services";
import CartItem from "../../interfaces/CartItem";
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootStackParamList from "../../interfaces/RootStackParamList";

interface FooterProps {
  total: number;
  cart: CartItem[];
  loadCart: () => Promise<void>;
  clearCart: () => Promise<void>;
}

export default ({ total, cart, loadCart, clearCart }: FooterProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Keranjang'>>();
  
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCheckout = () => {
    if (user) {
      Alert.alert(
        'Konfirmasi Pesanan',
        'Apakah Anda yakin ingin melakukan pesanan?',
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
                  Alert.alert('Error', 'Terjadi kesalahan saat melakukan pesanan. Silakan coba lagi.');
                  setIsLoading(false);
                  return;
                }

                await clearCart();
  
                Alert.alert('Alamdulillah', 'Pesanan berhasil dibuat!', [
                  { text: 'OK', onPress: () => navigation.navigate('DetailPesanan', {id_header: response.data.data.id_header}) },
                ])
              } else {
                Alert.alert('Error', response.data?.message || 'Terjadi kesalahan saat melakukan pesanan. Silakan coba lagi.');
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

  
  return (
    <View className="border-t border-sky-200 bg-white px-4 py-4">
      <View className="mb-3 flex-row justify-between">
        <Text className="text-lg font-semibold text-slate-700">Total:</Text>
        <Text className="text-xl font-bold text-sky-900">{formatCurrency(total)}</Text>
      </View>
      <View>
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
  );
}