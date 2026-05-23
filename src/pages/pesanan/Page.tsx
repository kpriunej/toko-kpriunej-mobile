import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiUrl } from '../../utils/helpers';
import { apiService } from '../../services/api.services';
import ListFooter from '../../components/pesanan/ListFooter';
import ListEmpty from '../../components/pesanan/ListEmpty';
import RenderItem from '../../components/pesanan/RenderItem';
import { PaginatedResponse } from '../../interfaces';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuth from '../../hooks/useAuth';
import Header from '../../components/Header';

const isData = (value: unknown) => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<any>;
  return typeof candidate.id_header === 'number';
};

type RootStackParamList = {
  Pesanan: undefined;
  Login: undefined;
  Main: undefined;
  Pembayaran: undefined;
};

export default () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Pesanan'>>();
  const { user } = useAuth();
  
  const [items, setItems] = useState<PaginatedResponse<any>>({ data: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loadingMorePageRef = useRef<number | null>(null);

  const fetchItem = useCallback(
    async (
      page = 1,
      options: {
        isManualRefresh?: boolean;
        isLoadMore?: boolean;
      } = {},
    ) => {

      const { isManualRefresh = false, isLoadMore = false } = options;

      if (isLoadMore && loadingMorePageRef.current === page) {
        return;
      }

      if (isLoadMore) {
        loadingMorePageRef.current = page;
      }

      if (isManualRefresh) {
        setIsRefreshing(true);
      } else if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      if (!isLoadMore) {
        setErrorMessage(null);
      }
      setLoadMoreError(null);

      try {
        const params: any = { 
          page,
          per_page: 25,
          sort_by: "created_at",
          sort_type: "desc",
          id_user: user.id
        };
        const response = await apiService('get', apiUrl('/api/transaksi-jual-header'), {
          params,
        });

        if (response?.canceled) {
          return;
        }

        if (response?.status >= 400) {
          throw new Error(
            response?.data?.message ??
              'Terjadi kesalahan saat memuat data barang.',
          );
        }

        const payload = response?.data;
        const incomingDataRaw = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : [];
        const incomingData = incomingDataRaw.filter(isData);

        setItems(previousItems => {
          const mergedData =
            page === 1 ? incomingData : [...previousItems.data, ...incomingData];

          // Remove duplicates based on id_header
          const uniqueDataMap = new Map<number, any>();
          mergedData.forEach((item: any) => {
            uniqueDataMap.set(item.id_header, item);
          });

          return {
            ...payload,
            data: Array.from(uniqueDataMap.values()),
          };
        });

      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan saat memuat data barang.';

        if (isLoadMore) {
          setLoadMoreError(message);
        } else {
          setErrorMessage(message);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);

        if (isLoadMore && loadingMorePageRef.current === page) {
          loadingMorePageRef.current = null;
        }
      }
    },
    [navigation, user],
  );

  const handleLoadMore = useCallback(() => {
    if (
      isLoading ||
      isRefreshing ||
      isLoadingMore ||
      loadingMorePageRef.current !== null ||
      !items.next_page_url
    ) {
      return;
    }

    fetchItem(Number(items.current_page) + 1, {
      isLoadMore: true,
    });
  }, [
    items.current_page,
    fetchItem,
    items.next_page_url,
    isLoading,
    isLoadingMore,
    isRefreshing,
  ]);

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    fetchItem(1);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <Header title="Riwayat Pesanan" />
      <View className="flex-1 px-3">
        {isLoading ? (
          <View className="flex-col gap-3 mb-4">
            {[1, 2, 3].map(i => (
              <RenderItem key={i} loading />
            ))}
          </View>
        ) : errorMessage && items.data.length === 0 ? (
          <View className="flex-1 items-center justify-center rounded-2xl bg-white px-6 mt-4">
            <Text className="text-center text-base font-semibold text-rose-700">
              {errorMessage}
            </Text>
            <Pressable
              onPress={() => fetchItem(1)}
              className="mt-4 rounded-xl bg-sky-700 px-5 py-3 active:bg-sky-800"
            >
              <Text className="font-semibold text-white">Coba Lagi</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={items.data}
            keyExtractor={item => item.id_header.toString()}
            renderItem={({ item }) => <RenderItem item={item} />}
            ListHeaderComponent={<View className="mt-3" />}
            ListEmptyComponent={<ListEmpty />}
            ListFooterComponent={
              <ListFooter
                isLoadingMore={isLoadingMore}
                loadMoreError={loadMoreError}
                hasNextPage={items.next_page_url !== null}
                items={items.data}
                fetchItem={fetchItem}
                currentPage={Number(items.current_page)}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-28"
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => fetchItem(1, { isManualRefresh: true })}
                tintColor="#047857"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};
