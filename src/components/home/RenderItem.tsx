import { Text, View } from "react-native";
import { formatCurrency } from "../../utils/helpers";
import Barang from "../../interfaces/Barang";

interface RenderCardProps {
  item?: Barang;
  loading?: boolean;
}

const RenderItem: React.FC<RenderCardProps> = ({ item, loading }) => {
  const stockValue = item?.saldo_stock ?? 0;
  const stockText = stockValue > 0 ? `${stockValue} tersedia` : 'Stok kosong';
  const stockPillClass =
    stockValue > 0
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-rose-100 text-rose-700';
  if (loading) {
    return (
      <View className="mb-4 animate-pulse rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm shadow-emerald-900/10">
        <View className="mb-2 flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <View className="h-4 w-1/3 rounded bg-gray-300 animate-pulse" />
            <View className="mt-1 h-6 w-1/2 rounded bg-gray-300 animate-pulse" />
          </View>

          <View className="h-6 w-24 rounded bg-gray-300 animate-pulse" />
        </View>

        <View className="mt-2 flex-row items-center justify-between">
          <View>
            <View className="h-4 w-16 rounded bg-gray-300 animate-pulse" />
            <View className="mt-1 h-5 w-20 rounded bg-gray-300 animate-pulse" />
          </View>

          <View>
            <View className="h-4 w-16 rounded bg-gray-300 animate-pulse" />
            <View className="mt-1 h-5 w-20 rounded bg-gray-300 animate-pulse" />
          </View>
        </View>

        <View className="mt-4 h-16 rounded bg-gray-300 animate-pulse" />
      </View>
    );
  }

  return (
    <View className="mb-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm shadow-emerald-900/10">
      <View className="mb-2 flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            {item?.kode_barang}
          </Text>
          <Text className="mt-1 text-lg font-bold text-emerald-950">
            {item?.nama_barang}
          </Text>
        </View>

        <View className={`rounded-xl px-3 py-1 ${stockPillClass}`}>
          <Text className="text-xs font-semibold">{stockText}</Text>
        </View>
      </View>

      <View className="mt-2 flex-row items-center justify-between">
        <View>
          <Text className="text-xs text-emerald-700">Tipe</Text>
          <Text className="text-sm font-medium text-emerald-900">
            {item?.type ?? '-'}
          </Text>
        </View>

        <View>
          <Text className="text-right text-xs text-emerald-700">Kemasan</Text>
          <Text className="text-right text-sm font-medium text-emerald-900">
            {item?.nama_kemasan ?? '-'}
          </Text>
        </View>
      </View>

      <View className="mt-4 rounded-xl bg-amber-50 px-3 py-2">
        <Text className="text-xs text-amber-700">Harga Jual</Text>
        <Text className="text-lg font-bold text-amber-900">
          {formatCurrency(item?.hargajual1 ?? 0)}
        </Text>
      </View>
    </View>
  );
};

export default RenderItem;
