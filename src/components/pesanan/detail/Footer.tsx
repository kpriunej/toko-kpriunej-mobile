import { Text, View } from "react-native";
import TransaksiJualHeader from "../../../interfaces/TransaksiJualHeader";
import TransaksiJualDetail from "../../../interfaces/TransaksiJualDetail";
import { formatCurrency } from "../../../utils/helpers";

interface FooterProps {
  transaksiJualHeader: TransaksiJualHeader<TransaksiJualDetail>;
}

export default ({ transaksiJualHeader }: FooterProps) => {
  return (
    <View className="mb-4 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm shadow-sky-900/10">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-sky-900">
          Total Harga
        </Text>
        <Text className="text-lg font-semibold text-sky-900">
          Rp. {formatCurrency(transaksiJualHeader.grandtotal)}
        </Text>
      </View>
    </View>
  );
};