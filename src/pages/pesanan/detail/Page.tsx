import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiUrl } from '../../../utils/helpers';
import { apiService } from '../../../services/api.services';
import ListEmpty from '../../../components/pesanan/ListEmpty';
import RenderItem from '../../../components/pesanan/detail/RenderItem';
import useAuth from '../../../hooks/useAuth';
import Header from '../../../components/Header';
import TransaksiJualHeader from '../../../interfaces/TransaksiJualHeader';
import TransaksiJualDetail from '../../../interfaces/TransaksiJualDetail';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import ListHeader from '../../../components/pesanan/detail/Header';
import Footer from '../../../components/pesanan/detail/Footer';

interface FetchOptions {
  isManualRefresh?: boolean;
}

export const contentContainerStyle = { paddingBottom: 112 };

export default ({ navigation, route }: { navigation: any; route: { params: { id_header: number; }}; }) => {
  const { user } = useAuth();
  
  // Menggunakan generic type pada state
  const [transaksiJualHeader, setTransaksiJualHeader] = useState<TransaksiJualHeader<TransaksiJualDetail>>();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchItem = useCallback(
    async (options: FetchOptions = {}) => {
      const { isManualRefresh = false } = options;

      // Atur status UI loading
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await apiService('get', apiUrl(`/api/transaksi-jual-header/${route.params.id_header}`), {
          params: {
            include: ["transaksi_jual_detail"],
          },
        });

        if (response?.canceled) {
          return;
        }

        if (response?.status >= 400) {
          throw new Error(
            response?.data?.message ?? 'Terjadi kesalahan saat memuat data barang.',
          );
        }

        setTransaksiJualHeader(response?.data?.data);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan saat memuat data barang.';

        setErrorMessage(message);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [route.params.id_header], // Ditambahkan user.id agar fetchItem diperbarui jika user berganti
  );

  const handleLoadMore = useCallback(() => {
    if (isLoading || isRefreshing) {
      return;
    }
  }, [
    isLoading,
    isRefreshing,
  ]);

  // Melakukan pengecekan auth & inisialisasi data secara aman
  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    fetchItem();
  }, [user, navigation, fetchItem]); // Mengisi dependency array secara lengkap

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <Header
        title={
          <>
            <Pressable onPress={() => navigation.goBack()}>
              <FontAwesome5Icon name="arrow-left" size={24} color="white" />
            </Pressable>
            <Text className="ml-2 text-lg font-semibold text-white">DETAIL PESANAN</Text>
          </>
        }
      />
      <View className="flex-1 px-3">
        {isLoading && !isRefreshing ? (
          <View className="flex-col gap-3 mb-4">
            <View className="mt-3"/>
            {[1, 2, 3].map(i => (
              <RenderItem key={i} loading />
            ))}
          </View>
        ) : errorMessage ? (
          <View className="flex-1 items-center justify-center rounded-2xl bg-white px-6 mt-4">
            <Text className="text-center text-base font-semibold text-rose-700">
              {errorMessage}
            </Text>
            <Pressable
              onPress={() => fetchItem({ isManualRefresh: true })}
              className="mt-4 rounded-xl bg-sky-700 px-5 py-3 active:bg-sky-800"
            >
              <Text className="font-semibold text-white">Coba Lagi</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={transaksiJualHeader?.transaksi_jual_detail}
            keyExtractor={item => item.idtab.toString()}
            renderItem={({ item }) => <RenderItem item={item} />}
            ListHeaderComponent={<ListHeader transaksiJualHeader={transaksiJualHeader!} />}
            ListEmptyComponent={<ListEmpty />}
            ListFooterComponent={<Footer transaksiJualHeader={transaksiJualHeader!} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={contentContainerStyle}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => fetchItem({ isManualRefresh: true })}
                tintColor="#047857"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};