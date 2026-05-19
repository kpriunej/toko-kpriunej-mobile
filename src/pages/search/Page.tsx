import { useCallback, useRef, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '../../services/api.services';
import { apiUrl } from '../../utils/helpers';
import Barang from '../../interfaces/Barang';
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
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PaginatedResponse<Barang>>({ data: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const loadingMorePageRef = useRef<number | null>(null);

  const handleSearch = useCallback(
    async (
      searchQuery: string,
      page = 1,
      options: { isLoadMore?: boolean } = {},
    ) => {
      const { isLoadMore = false } = options;

      if (!searchQuery.trim()) {
        setSearchResults({ data: [] });
        setErrorMessage(null);
        setHasSearched(false);
        return;
      }

      if (isLoadMore && loadingMorePageRef.current === page) {
        return;
      }

      if (isLoadMore) {
        loadingMorePageRef.current = page;
      }

      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      setLoadMoreError(null);

      try {
        const response = await apiService('get', apiUrl('/api/barang'), {
          params: { 
            q: searchQuery.trim(),
            per_page: 25, 
            page,
          },
        });

        if (response?.status >= 400) {
          throw new Error(
            response?.data?.message ?? 'Terjadi kesalahan saat mencari barang.',
          );
        }

        const payload = response?.data;
        const incomingDataRaw = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : [];
        const incomingData = incomingDataRaw.filter(isBarang);

        setSearchResults(previousResults => {
          const mergedResults = isLoadMore
            ? [...previousResults.data, ...incomingData]
            : incomingData;

          const uniqueResults = new Map<number, Barang>();

          for (const barang of mergedResults) {
            if (!uniqueResults.has(barang.idtab)) {
              uniqueResults.set(barang.idtab, barang);
            }
          }

          return { ...payload, data: Array.from(uniqueResults.values()) };
        });

        if (!isLoadMore) {
          setHasSearched(true);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan saat mencari barang.';

        if (isLoadMore) {
          setLoadMoreError(message);
        } else {
          setErrorMessage(message);
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);

        if (isLoadMore && loadingMorePageRef.current === page) {
          loadingMorePageRef.current = null;
        }
      }
    },
    [],
  );

  const handleLoadMore = useCallback(() => {
    if (
      isLoading ||
      isLoadingMore ||
      loadingMorePageRef.current !== null ||
      !searchResults.next_page_url
    ) {
      return;
    }

    handleSearch(query, Number(searchResults.current_page) + 1, { isLoadMore: true });
  }, [
    searchResults.current_page,
    handleSearch,
    searchResults.next_page_url,
    isLoading,
    isLoadingMore,
    query
  ]);

  return (
    <SafeAreaView className="flex-1 bg-lime-50 px-4 pt-4">
      <Text className="mb-4 text-2xl font-bold text-emerald-900">Cari Produk</Text>
      <View className="rounded-3xl bg-white px-4 py-4 shadow-sm mb-4">
        <View className="flex-row items-center gap-2">
          <TextInput
            className="flex-1 h-12 rounded-2xl border border-emerald-200 px-4 text-base text-slate-900"
            placeholder="Cari barang favorit kamu..."
            placeholderTextColor="#6b7280"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />
          <Pressable
            onPress={() => handleSearch(query, 1)}
            className="rounded-2xl bg-emerald-700 px-4 py-3 active:bg-emerald-800"
          >
            <Text className="text-white font-semibold">Cari</Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-1">
        {isLoading ? (
          <View className="flex-col gap-4">
            {[1, 2, 3].map(i => (
              <RenderItem key={i} loading />
            ))}
          </View>
        ) : errorMessage && searchResults.data.length === 0 ? (
          <View className="flex-1 items-center justify-center rounded-2xl bg-white px-6">
            <Text className="text-center text-base font-semibold text-rose-700">
              {errorMessage}
            </Text>
            <Pressable
              onPress={() => handleSearch(query, 1)}
              className="mt-4 rounded-xl bg-emerald-700 px-5 py-3 active:bg-emerald-800"
            >
              <Text className="font-semibold text-white">Coba Lagi</Text>
            </Pressable>
          </View>
        ) : !hasSearched ? (
          <View className="flex-1 items-center justify-center rounded-2xl bg-white px-6">
            <Text className="text-center text-base text-slate-600">
              Ketik kata kunci untuk mencari produk yang kamu inginkan.
            </Text>
          </View>
        ) : searchResults.data.length === 0 ? (
          <View className="flex-1 items-center justify-center rounded-2xl bg-white px-6">
            <Text className="text-center text-base font-semibold text-slate-700">
              Tidak ada produk yang cocok dengan pencarian "{query}".
            </Text>
            <Text className="mt-2 text-center text-sm text-slate-500">
              Coba gunakan kata kunci yang berbeda.
            </Text>
          </View>
        ) : (
          <>
            <Text className="mb-3 text-sm font-semibold text-slate-600">
              Ditemukan {searchResults.total} produk
            </Text>
            <FlatList
              data={searchResults.data}
              keyExtractor={item => item.idtab.toString()}
              renderItem={({ item }) => <RenderItem item={item} />}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                <View className="pb-3 pt-1">
                  {isLoadingMore ? (
                    <RenderItem loading />
                  ) : loadMoreError ? (
                    <View className="items-center py-2">
                      <Text className="text-center text-sm text-rose-700">
                        {loadMoreError}
                      </Text>
                      <Pressable
                        onPress={() =>
                          handleSearch(query, Number(searchResults.current_page) + 1, { isLoadMore: true })
                        }
                        className="mt-2 rounded-xl bg-emerald-700 px-4 py-2 active:bg-emerald-800"
                      >
                        <Text className="text-sm font-semibold text-white">
                          Coba Lagi
                        </Text>
                      </Pressable>
                    </View>
                  ) : !searchResults.next_page_url && searchResults.data.length > 0 ? (
                    <Text className="text-center text-xs text-emerald-700">
                      Semua data sudah ditampilkan
                    </Text>
                  ) : null}
                </View>
              }
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.4}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};
