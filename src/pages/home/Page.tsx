import axios, { CancelTokenSource } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { apiUrl } from '../../utils/helpers';
import { apiService } from '../../services/api.services';
import Barang from '../../interfaces/Barang';
import ListFooter from '../../components/home/ListFooter';
import ListEmpty from '../../components/home/ListEmpty';
import RenderItem from '../../components/home/RenderItem';
import { PaginatedResponse } from '../../interfaces';

const isBarang = (value: unknown): value is Barang => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<Barang>;
  return typeof candidate.idtab === 'number';
};

export default () => {
  const [query, setQuery] = useState<string>('');
  const [items, setItems] = useState<PaginatedResponse<Barang>>({ data: [] });
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

  const fetchBarang = useCallback(
    async (
      page = 1,
      options: {
        isManualRefresh?: boolean;
        isLoadMore?: boolean;
        q?: string;
        cancelToken?: CancelTokenSource['token'];
      } = {},
    ) => {
      const { isManualRefresh = false, isLoadMore = false, q, cancelToken } = options;
      const searchQuery = q !== undefined ? q : currentSearchQueryRef.current;

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
        const response = await apiService('get', apiUrl('/api/barang'), {
          params: { 
            page,
            per_page: 25,
            q: searchQuery
          },
          cancelToken,
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
        const incomingData = incomingDataRaw.filter(isBarang);

        setItems(previousItems => {
          const mergedData =
            page === 1 ? incomingData : [...previousItems.data, ...incomingData];

          // Remove duplicates based on idtab
          const uniqueDataMap = new Map<number, Barang>();
          mergedData.forEach((item: Barang) => {
            uniqueDataMap.set(item.idtab, item);
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
    [],
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
      fetchBarang(1, { q: query, cancelToken: source.token });
    }, 300);

    return clearSearchDebounce;
  }, [query, fetchBarang]);

  useEffect(() => {
    FontAwesome5.loadFont?.();
    fetchBarang(1, { q: '' });

    return () => {
      clearSearchDebounce();
      if (searchCancelTokenRef.current) {
        searchCancelTokenRef.current.cancel('Component unmounted');
      }
    };
  }, [fetchBarang]);

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

    fetchBarang(Number(items.current_page) + 1, {
      isLoadMore: true,
      q: currentSearchQueryRef.current,
    });
  }, [
    items.current_page,
    fetchBarang,
    items.next_page_url,
    isLoading,
    isLoadingMore,
    isRefreshing,
  ]);

  return (
    <SafeAreaView className="flex-1 bg-lime-50">
      <View className="bg-emerald-700 px-4 py-3 shadow-sm">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg text-center font-bold text-white">TOKO ONLINE KPRI UNEJ</Text>
          <Image
            source={require('../../../assets/icons/logo.jpg')}
            className="h-10 w-10 rounded-full bg-white"
          />
        </View>
        <View className="flex-row items-center gap-2 mt-2 relative">
          <TextInput
            className="flex-1 h-10 py-0 rounded-2xl border border-emerald-200 px-4 text-base text-slate-900 bg-white"
            placeholder="Cari barang favorit kamu..."
            placeholderTextColor="#6b7280"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />
          <FontAwesome5
            name="search"
            size={18}
            color="#047857"
            onPress={() => {
              clearSearchDebounce();
              if (searchCancelTokenRef.current) {
                searchCancelTokenRef.current.cancel('Manual search started');
              }

              const source = axios.CancelToken.source();
              searchCancelTokenRef.current = source;
              currentSearchQueryRef.current = query;
              fetchBarang(1, { q: query, cancelToken: source.token });
            }}
            className="absolute right-5"
          />
        </View>
      </View>
      <View className="flex-1 px-3">
        {isLoading ? (
          <View className="flex-col gap-4 mb-4">
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
              onPress={() => fetchBarang(1)}
              className="mt-4 rounded-xl bg-emerald-700 px-5 py-3 active:bg-emerald-800"
            >
              <Text className="font-semibold text-white">Coba Lagi</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={items.data}
            keyExtractor={item => item.idtab.toString()}
            renderItem={({ item }) => <RenderItem item={item} />}
            ListHeaderComponent={<View className="mt-4" />}
            ListEmptyComponent={<ListEmpty />}
            ListFooterComponent={
              <ListFooter
                isLoadingMore={isLoadingMore}
                loadMoreError={loadMoreError}
                hasNextPage={items.next_page_url !== null}
                items={items.data}
                fetchBarang={fetchBarang}
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
                onRefresh={() => fetchBarang(1, { isManualRefresh: true })}
                tintColor="#047857"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};
