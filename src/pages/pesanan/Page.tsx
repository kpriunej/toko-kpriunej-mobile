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
import TransaksiJualHeader from '../../interfaces/TransaksiJualHeader';
import RootStackParamList from '../../interfaces/RootStackParamList';
import TransaksiJualDetail from '../../interfaces/TransaksiJualDetail';
import ListHeader from '../../components/pesanan/ListHeader';
import SearchInput from '../../components/SearchInput';
import axios, { CancelTokenSource } from 'axios';

const isData = (value: unknown): value is TransaksiJualHeader<TransaksiJualDetail> => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return typeof candidate.id_header === 'number';
};

interface FetchOptions {
  isManualRefresh?: boolean;
  isLoadMore?: boolean;
  status?: string;
  q?: string;
  cancelToken?: CancelTokenSource['token'];
}

export const contentContainerStyle = { paddingBottom: 112 };

export default () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Pesanan'>>();
  const { user } = useAuth();
  
  // Menggunakan generic type pada state
  const [query, setQuery] = useState<string>('');
  const [items, setItems] = useState<PaginatedResponse<TransaksiJualHeader<TransaksiJualDetail>>>({ data: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loadingMorePageRef = useRef<number | null>(null);
  const searchDebounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchCancelTokenRef = useRef<CancelTokenSource | null>(null);
  const currentSearchQueryRef = useRef<string>('');

  const clearSearchDebounce = () => {
    if (searchDebounceTimeoutRef.current) {
      clearTimeout(searchDebounceTimeoutRef.current);
      searchDebounceTimeoutRef.current = null;
    }
  };

  const fetchItem = useCallback(
    async (page = 1, options: FetchOptions = {}) => {
      const { isManualRefresh = false, isLoadMore = false, status = "Semua", q, cancelToken } = options;
      const searchQuery = q !== undefined ? q : currentSearchQueryRef.current;


      // Pencegahan double-fetch
      if (isLoadMore && loadingMorePageRef.current === page) {
        return;
      }

      if (isLoadMore) {
        loadingMorePageRef.current = page;
      }

      // Atur status UI loading
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
        // Definisikan params secara eksplisit tanpa 'any'
        const params: Record<string, string | number | undefined> = { 
          page,
          per_page: 25,
          sort_by: "created_at",
          sort_type: "desc",
        };

        if (searchQuery) {
          params.q = `%${searchQuery}%`;
        }

        if (user && user?.role !== 'Admin') {
          params.id_user = user.id;
        }

        if (status !== "Semua") {
          params.status = status;
        }

        const response = await apiService('get', apiUrl('/api/transaksi-jual-header'), {
          params,
          cancelToken,
        });

        if (response?.canceled) {
          return;
        }

        if (response?.status >= 400) {
          throw new Error(
            response?.data?.message ?? 'Terjadi kesalahan saat memuat data barang.',
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

          // Duplication filtering
          const uniqueDataMap = new Map<number, TransaksiJualHeader<TransaksiJualDetail>>();
          mergedData.forEach((item: TransaksiJualHeader<TransaksiJualDetail>) => {
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
        // Selalu bersihkan ref ketika proses selesai (sukses maupun gagal)
        if (isLoadMore) {
          loadingMorePageRef.current = null;
        }
      }
    },
    [user], // Ditambahkan user.id agar fetchItem diperbarui jika user berganti
  );

  useEffect(() => {
    if (query === currentSearchQueryRef.current) {
      return;
    }

    clearSearchDebounce();
    searchDebounceTimeoutRef.current = setTimeout(() => {
      if (searchCancelTokenRef.current) {
        searchCancelTokenRef.current.cancel('New search started');
      }

      const source = axios.CancelToken.source();
      searchCancelTokenRef.current = source;
      currentSearchQueryRef.current = query;
      fetchItem(1, { q: query, cancelToken: source.token });
    }, 500);

    return clearSearchDebounce;
  }, [query, fetchItem]);

  useEffect(() => {
    fetchItem(1, { q: '' });

    return () => {
      clearSearchDebounce();
      if (searchCancelTokenRef.current) {
        searchCancelTokenRef.current.cancel('Component unmounted');
      }
    };
  }, [fetchItem]);

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
      q: currentSearchQueryRef.current,
    });
  }, [
    items.current_page,
    items.next_page_url,
    isLoading,
    isLoadingMore,
    isRefreshing,
    fetchItem,
  ]);

  // Melakukan pengecekan auth & inisialisasi data secara aman
  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    fetchItem(1);
  }, [user, navigation, fetchItem]); // Mengisi dependency array secara lengkap

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <Header title="RIWAYAT PESANAN">
        <SearchInput
          query={query}
          setQuery={setQuery}
          placeholder="Cari pesanan..."
          callback={() => {
            clearSearchDebounce();
            if (searchCancelTokenRef.current) {
              searchCancelTokenRef.current.cancel('Manual search started');
            }

            const source = axios.CancelToken.source();
            searchCancelTokenRef.current = source;
            currentSearchQueryRef.current = query;
            fetchItem(1, { q: query, cancelToken: source.token });
          }}
        />
      </Header>
      <View className="flex-1 px-3">
        {isLoading && !isRefreshing && !isLoadingMore ? (
          <View className="flex-col gap-3 mb-4">
            <View className="mt-3"/>
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
            ListHeaderComponent={<ListHeader fetchItem={fetchItem} />}
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
            contentContainerStyle={contentContainerStyle}
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