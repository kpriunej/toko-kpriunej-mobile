import { Pressable, Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import CartItem from '../../interfaces/CartItem';
import { getCart, updateCartItemQuantity, clearCart } from '../../services/cartService';
import Header from '../../components/Header';
import RenderItem from '../../components/keranjang/RenderItem';
import Footer from '../../components/keranjang/Footer';
import RootStackParamList from '../../interfaces/RootStackParamList';

export default () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Keranjang'>>();

  const [cart, setCart] = useState<CartItem[]>([]);

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

  if (cart.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-sky-50">
        <Header title="KERANJANG BELANJA" />
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
          <Text className="mr-2 text-xl font-semibold text-white">KERANJANG BELANJA</Text>
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
        cart={cart}
        loadCart={loadCart}
        clearCart={clearCart}
      />
    </SafeAreaView>
  );
};
