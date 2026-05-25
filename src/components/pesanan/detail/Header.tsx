import { Text, View } from "react-native";
import TransaksiJualHeader from "../../../interfaces/TransaksiJualHeader";
import TransaksiJualDetail from "../../../interfaces/TransaksiJualDetail";
import moment from "moment";

interface HeaderProps {
  transaksiJualHeader: TransaksiJualHeader<TransaksiJualDetail>;
}

export default ({ transaksiJualHeader }: HeaderProps) => {
  return (
    <View className="flex-row items-center justify-between my-4">
      <Text className="text-sm font-semibold text-sky-900">
        #INV-{transaksiJualHeader?.nomor_faktur}
      </Text>
      <Text className="text-sm font-semibold text-sky-900">
        {moment(transaksiJualHeader?.tanggal_transaksi).format('DD MMMM YYYY')}
      </Text>
    </View>
  );
};