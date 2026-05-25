import { Pressable, Text, View } from "react-native";
import TransaksiJualHeader from "../../../interfaces/TransaksiJualHeader";
import TransaksiJualDetail from "../../../interfaces/TransaksiJualDetail";
import { formatCurrency } from "../../../utils/helpers";

interface FooterProps {
  transaksiJualHeader: TransaksiJualHeader<TransaksiJualDetail>;
}

export default ({ transaksiJualHeader }: FooterProps) => {
  const handleBuktiBayar = async () => {
  };
  return (
    <>
      <View className="mb-4 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm shadow-sky-900/10">
        <View className="border-b border-sky-200">
          <Text className="text-lg font-bold text-sky-900 mb-4">
            Detail Pembayaran
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-sky-900">
            Total Pembayaran
          </Text>
          <Text className="font-bold text-sky-900">
            Rp. {formatCurrency(transaksiJualHeader.grandtotal)}
          </Text>
        </View>
        {transaksiJualHeader.status === "Menunggu Pembayaran" && (
          <Pressable 
            onPress={handleBuktiBayar} 
            className="mt-6 rounded-2xl bg-sky-700 px-5 py-4 items-center active:bg-sky-800"
          >
            <Text className="font-semibold text-white">
              {transaksiJualHeader.status === "Menunggu Pembayaran" ? "Upload Bukti Bayar" : "Lihat Bukti Bayar"}
            </Text>
          </Pressable>
        )}
      </View>
    </>
  );
};