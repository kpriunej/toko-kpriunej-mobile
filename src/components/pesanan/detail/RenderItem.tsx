import { Text, View } from "react-native"
import { formatCurrency } from "../../../utils/helpers"
import TransaksiJualDetail from "../../../interfaces/TransaksiJualDetail"

interface RenderCardProps {
  item?: TransaksiJualDetail;
  loading? : boolean;
}

export default ({ item, loading }: RenderCardProps) => {
  if (loading) {
    return (
      <View className="mb-3 animate-pulse rounded-2xl border border-sky-100 bg-white p-4 shadow-sm shadow-sky-900/10">
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
  if (!item) {
    return null;
  }
  return (
    <View className="mb-4 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm shadow-sky-900/10">
      <View className="flex-row justify-between items-end">
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            {item.kode_barang}
          </Text>
          <Text className="mt-1 text-base font-bold text-sky-950">
            {item.nama_barang}
          </Text>
          <Text className="mt-1 text-sm font-semibold text-amber-900">
            {Number(item.quantity)} x {formatCurrency(item.harga ?? 0)}/{item.satuan ? item.satuan.substring(3) : '-'}
          </Text>
        </View>

        <View className="ml-2 items-end">
          <Text className="text font-semibold text-sky-900">
            Rp. {formatCurrency((item.harga ?? 0) * item.quantity)}
          </Text>
        </View>
      </View>
    </View>
  )
}