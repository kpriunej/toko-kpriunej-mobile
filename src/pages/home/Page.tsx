import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { apiUrl, formatCurrency } from '../../utils/helpers';
import { apiService } from '../../services/api.services';
import Barang from '../../interfaces/Barang';
import useAuth from '../../hooks/useAuth';

const isBarang = (value: unknown): value is Barang => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<Barang>;
  return typeof candidate.idtab === 'number';
};

export default () => {
  const { user } = useAuth();

  const [items, setItems] = useState<Barang[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loadingMorePageRef = useRef<number | null>(null);

  const fetchBarang = useCallback(
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
        const response = await apiService("get", apiUrl('/api/barang'), {
          params: { page },
        });

        if (response?.status >= 400) {
          throw new Error(response?.data?.message ?? 'Terjadi kesalahan saat memuat data barang.');
        }

        const payload = response?.data;
        const incomingDataRaw = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];
        const incomingData = incomingDataRaw.filter(isBarang);

        setItems(previousItems => {
          const mergedItems = isLoadMore
            ? [...previousItems, ...incomingData]
            : incomingData;

          const uniqueItems = new Map<number, Barang>();

          for (const barang of mergedItems) {
            if (!uniqueItems.has(barang.idtab)) {
              uniqueItems.set(barang.idtab, barang);
            }
          }

          return Array.from(uniqueItems.values());
        });
        const resolvedCurrentPage = Number(payload?.current_page ?? page);
        const resolvedTotal = Number(payload?.total ?? incomingData.length);
        const lastPage = Number(payload?.last_page ?? page);

        setCurrentPage(Number.isNaN(resolvedCurrentPage) ? page : resolvedCurrentPage);
        setTotalItems(Number.isNaN(resolvedTotal) ? incomingData.length : resolvedTotal);

        const nextAvailable =
          Boolean(payload?.next_page_url) ||
          resolvedCurrentPage < (Number.isNaN(lastPage) ? page : lastPage);
        setHasNextPage(nextAvailable);
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
    FontAwesome5.loadFont?.();
    fetchBarang(1);
  }, [fetchBarang]);

  const handleLoadMore = useCallback(() => {
    if (
      isLoading ||
      isRefreshing ||
      isLoadingMore ||
      loadingMorePageRef.current !== null ||
      !hasNextPage
    ) {
      return;
    }

    fetchBarang(currentPage + 1, { isLoadMore: true });
  }, [currentPage, fetchBarang, hasNextPage, isLoading, isLoadingMore, isRefreshing]);

  const renderCard = ({ item }: { item: Barang }) => {
    const stockValue = item.saldo_stock ?? 0;
    const stockText = stockValue > 0 ? `${stockValue} tersedia` : 'Stok kosong';
    const stockPillClass = stockValue > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700';

    return (
      <View className="mb-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm shadow-emerald-900/10">
        <View className="mb-2 flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              {item.kode_barang}
            </Text>
            <Text className="mt-1 text-lg font-bold text-emerald-950">{item.nama_barang}</Text>
          </View>

          <View className={`rounded-xl px-3 py-1 ${stockPillClass}`}>
            <Text className="text-xs font-semibold">{stockText}</Text>
          </View>
        </View>

        <View className="mt-2 flex-row items-center justify-between">
          <View>
            <Text className="text-xs text-emerald-700">Tipe</Text>
            <Text className="text-sm font-medium text-emerald-900">{item.type ?? '-'}</Text>
          </View>

          <View>
            <Text className="text-right text-xs text-emerald-700">Kemasan</Text>
            <Text className="text-right text-sm font-medium text-emerald-900">
              {item.nama_kemasan ?? '-'}
            </Text>
          </View>
        </View>

        <View className="mt-4 rounded-xl bg-amber-50 px-3 py-2">
          <Text className="text-xs text-amber-700">Harga Jual</Text>
          <Text className="text-lg font-bold text-amber-900">
            {formatCurrency(item.hargajual1 ?? 0)}
          </Text>
        </View>
      </View>
    );
  };

  const listHeader = (
    <View className="mb-4 rounded-3xl bg-emerald-700 px-5 py-5">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-sm text-emerald-100">Selamat datang, {user?.name || 'Guest'}</Text>
          <Text className="mt-1 text-2xl font-bold text-white">Daftar Barang</Text>
        </View>

        <Pressable className="h-11 w-11 items-center justify-center rounded-2xl bg-white/20 active:bg-white/30">
          <FontAwesome5 name="shopping-cart" size={18} color="#ffffff" solid />
        </Pressable>
      </View>

      <Text className="mt-2 text-sm text-emerald-100">
        Halaman {currentPage} • Total {totalItems.toLocaleString('id-ID')} barang
      </Text>
    </View>
  );

  const emptyState = (
    <View className="mt-10 items-center rounded-2xl border border-dashed border-emerald-200 bg-white px-6 py-8">
      <Text className="text-base font-semibold text-emerald-900">Belum ada data barang</Text>
      <Text className="mt-2 text-center text-sm text-emerald-700">
        Coba tarik layar ke bawah untuk memuat ulang data.
      </Text>
    </View>
  );

  const listFooter = (
    <View className="pb-3 pt-1">
      {isLoadingMore ? (
        <View className="items-center py-3">
          <ActivityIndicator size="small" color="#047857" />
          <Text className="mt-2 text-xs text-emerald-700">Memuat halaman berikutnya...</Text>
        </View>
      ) : loadMoreError ? (
        <View className="items-center py-2">
          <Text className="text-center text-sm text-rose-700">{loadMoreError}</Text>
          <Pressable
            onPress={() => fetchBarang(currentPage + 1, { isLoadMore: true })}
            className="mt-2 rounded-xl bg-emerald-700 px-4 py-2 active:bg-emerald-800"
          >
            <Text className="text-sm font-semibold text-white">Coba Lagi</Text>
          </Pressable>
        </View>
      ) : !hasNextPage && items.length > 0 ? (
        <Text className="text-center text-xs text-emerald-700">Semua data sudah ditampilkan</Text>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-lime-50">
      <View className="flex-1 px-4 pt-3">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#047857" />
            <Text className="mt-3 text-sm text-emerald-800">Memuat data barang...</Text>
          </View>
        ) : errorMessage && items.length === 0 ? (
          <View className="flex-1 items-center justify-center rounded-2xl bg-white px-6">
            <Text className="text-center text-base font-semibold text-rose-700">{errorMessage}</Text>
            <Pressable
              onPress={() => fetchBarang(1)}
              className="mt-4 rounded-xl bg-emerald-700 px-5 py-3 active:bg-emerald-800"
            >
              <Text className="font-semibold text-white">Coba Lagi</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={item => item.idtab.toString()}
            renderItem={renderCard}
            ListHeaderComponent={listHeader}
            ListEmptyComponent={emptyState}
            ListFooterComponent={listFooter}
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
}
