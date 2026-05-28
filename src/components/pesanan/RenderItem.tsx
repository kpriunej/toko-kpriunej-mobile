import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";
import { formatCurrency } from "../../utils/helpers";
import moment from "moment";
import TransaksiJualHeader from "../../interfaces/TransaksiJualHeader";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootStackParamList from "../../interfaces/RootStackParamList";
import TransaksiJualDetail from "../../interfaces/TransaksiJualDetail";
import statusDetail from "./StatusDetail";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import Countdown from "../../utils/Countdown";
import { mandiri } from "../../constants/Rekening";
import Clipboard from "@react-native-clipboard/clipboard";

interface RenderCardProps {
  item?: TransaksiJualHeader<TransaksiJualDetail>;
  loading?: boolean;
}

const RenderItem: React.FC<RenderCardProps> = ({ item, loading }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Pesanan'>>();

  const handleCopy = async () => {
    Clipboard.setString(mandiri);
    Alert.alert(
      "Berhasil",
      "Nomor rekening berhasil disalin",
      [{ text: "OK", onPress: () => {} }]
    );
  }
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
    <TouchableOpacity
      onPress={() => navigation.navigate('DetailPesanan', { id_header: item.id_header })} 
      className="mb-3 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm shadow-sky-900/10"
    >
      <View className="mb-3 flex-row items-center justify-between gap-3">
        <View className="bg-sky-50 px-3 py-1 rounded-xl">
          <Text className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            {moment(item.created_at).format('DD MMMM YYYY HH:mm:ss')}
          </Text>
        </View>
        <View className={`rounded-xl px-3 py-1 ${statusDetail[item.status]?.background ?? 'bg-sky-100'}`}>
          <Text className={`text-xs font-semibold ${statusDetail[item.status]?.color ?? 'text-sky-600'}`}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text className="mb-3 text-lg font-bold text-sky-950">
        #INV-{item.nomor_faktur}
      </Text>
      <View className="flex-row items-center justify-between">
        {item.status === "Menunggu Pembayaran" && (
          <View className="rounded-xl bg-sky-50 px-3 py-2">
            <Text className="text-xs text-amber-700">Transfer ke Mandiri</Text>
            <TouchableOpacity
              onPress={handleCopy}
              className="flex-row items-center gap-2"
            >
              <View pointerEvents="none">
                <Text className="text-lg font-bold text-amber-900 tracking-widest">
                  {mandiri}
                </Text>
              </View>
              <FontAwesome5Icon name="copy" size={14} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        )}
        <View className="rounded-xl bg-sky-50 px-3 py-2">
          <Text className="text-xs text-amber-700">Grand Total</Text>
          <Text className="text-lg font-bold text-amber-900">
            Rp. {formatCurrency((Number(item.grandtotal) ?? 0) + (Number(item.nomor_faktur.slice(-3))))}
          </Text>
        </View>
      </View>

      {item.status === "Menunggu Pembayaran" && (
        <View className="flex-row items-center mt-3 gap-2">
          <FontAwesome5Icon name="exclamation-triangle" size={12} color="orange" />
          <Text className="text-sm font-semibold text-rose-600 animate-pulse">
            Sisa Waktu Bayar: {Countdown(new Date(new Date(item.created_at).setDate(new Date(item.created_at).getDate() + 1)))}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default RenderItem;
