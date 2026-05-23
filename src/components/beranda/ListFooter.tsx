import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import RenderItem from './RenderItem';

interface ListFooterProps {
  isLoadingMore: boolean;
  loadMoreError: string | null;
  hasNextPage: boolean;
  items: unknown[];
  fetchBarang: (page: number, options?: { isManualRefresh?: boolean; isLoadMore?: boolean }) => Promise<void>;
  currentPage: number;
}

const ListFooter: React.FC<ListFooterProps> = ({ 
  isLoadingMore,
  loadMoreError,
  hasNextPage,
  items,
  fetchBarang,
  currentPage 
}) => (
  <View className="pb-3 pt-1">
    {isLoadingMore ? (
      <RenderItem loading />
    ) : loadMoreError ? (
      <View className="items-center py-2">
        <Text className="text-center text-sm text-rose-700">
          {loadMoreError}
        </Text>
        <Pressable
          onPress={() => fetchBarang(currentPage + 1, { isLoadMore: true })}
          className="mt-2 rounded-xl bg-sky-700 px-4 py-2 active:bg-sky-800"
        >
          <Text className="text-sm font-semibold text-white">Coba Lagi</Text>
        </Pressable>
      </View>
    ) : !hasNextPage && items.length > 0 ? (
      <Text className="text-center text-xs text-emerald-700">
        Semua data sudah ditampilkan
      </Text>
    ) : null}
  </View>
);

export default ListFooter;