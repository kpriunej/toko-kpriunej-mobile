import { Text, View } from "react-native";
import TransaksiJualHeader from "../../../interfaces/TransaksiJualHeader";
import TransaksiJualDetail from "../../../interfaces/TransaksiJualDetail";
import statusDetail from "../StatusDetail";

interface HeaderProps {
  transaksiJualHeader: TransaksiJualHeader<TransaksiJualDetail>;
}

export default ({ transaksiJualHeader }: HeaderProps) => {
  return (
    <View className="flex-row items-center justify-between my-4">
      <Text className="bg-white px-2 py-1 rounded-xl text-sm font-semibold text-sky-900">
        #INV-{transaksiJualHeader?.nomor_faktur}
      </Text>

      <View className={`rounded-xl px-3 py-1 ${statusDetail[transaksiJualHeader.status]?.background ?? 'bg-sky-100'}`}>
        <Text className={`text-xs font-semibold ${statusDetail[transaksiJualHeader.status]?.color ?? 'text-sky-600'}`}>
          {transaksiJualHeader.status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
};