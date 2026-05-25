import { Text, View } from "react-native";
import TransaksiJualHeader from "../../../interfaces/TransaksiJualHeader";
import TransaksiJualDetail from "../../../interfaces/TransaksiJualDetail";

interface HeaderProps {
  transaksiJualHeader: TransaksiJualHeader<TransaksiJualDetail>;
}

export default ({ transaksiJualHeader }: HeaderProps) => {
  return (
    <View className="flex-row items-center justify-between my-4">
      <Text className="bg-white px-2 py-1 rounded-xl text-sm font-semibold text-sky-900">
        #INV-{transaksiJualHeader?.nomor_faktur}
      </Text>

      <View className={`rounded-xl px-3 py-1 bg-sky-100 
        ${transaksiJualHeader.status === "Menunggu Pembayaran" ? "bg-yellow-100" : "bg-green-100"}
      `}>
        <Text className={`text-xs font-semibold
          ${transaksiJualHeader.status === "Menunggu Pembayaran" ? "text-yellow-500" : "text-green-700"}
        `}>
          {transaksiJualHeader.status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
};