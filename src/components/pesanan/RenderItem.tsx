import { Pressable, Text, View } from "react-native";
import { formatCurrency } from "../../utils/helpers";
import moment from "moment";
import TransaksiJualHeader from "../../interfaces/TransaksiJualHeader";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootStackParamList from "../../interfaces/RootStackParamList";
import TransaksiJualDetail from "../../interfaces/TransaksiJualDetail";

interface RenderCardProps {
  item?: TransaksiJualHeader<TransaksiJualDetail>;
  loading?: boolean;
}

const RenderItem: React.FC<RenderCardProps> = ({ item, loading }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Pesanan'>>();
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
    <Pressable
      onPress={() => navigation.navigate('DetailPesanan', { id_header: item.id_header })} 
      className="mb-4 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm shadow-sky-900/10">
      <View className="mb-2 flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            {moment(item.tanggal_transaksi).format('DD MMMM YYYY')}
          </Text>
          <Text className="mt-1 text-lg font-bold text-sky-950">
            #INV-{item.nomor_faktur}
          </Text>
        </View>

        <View className={`rounded-xl px-3 py-1 bg-sky-100 
          ${item.status === "Menunggu Pembayaran" ? "bg-yellow-100" : "bg-green-100"}
        `}>
          <Text className={`text-xs font-semibold
            ${item.status === "Menunggu Pembayaran" ? "text-yellow-500" : "text-green-700"}
          `}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View className="flex-row items-end justify-between">
        <View className="rounded-xl bg-sky-50 px-3 py-2">
          <Text className="text-xs text-amber-700">Grand Total</Text>
          <Text className="text-lg font-bold text-amber-900">
            Rp. {formatCurrency(item.grandtotal ?? 0)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default RenderItem;
