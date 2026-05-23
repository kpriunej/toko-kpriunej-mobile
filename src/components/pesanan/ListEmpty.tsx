import { Text, View } from "react-native";

export default () => (
  <View className="mt-10 items-center rounded-2xl border border-dashed border-sky-200 bg-white px-6 py-8">
    <Text className="text-base font-semibold text-sky-900">
      Belum ada data riwayat pesanan
    </Text>
    <Text className="mt-2 text-center text-sm text-sky-700">
      Coba tarik layar ke bawah untuk memuat ulang data.
    </Text>
  </View>
);
