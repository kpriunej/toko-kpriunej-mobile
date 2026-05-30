import { Text, View } from 'react-native';

export default () => (
  <View className="mt-3">
    <View className="p-4 rounded-3xl bg-[#0069a8] mb-3">
      <Text className="text-lg font-semibold text-slate-800 text-white">
        Selamat Datang! 👋
      </Text>
      <Text className="text-white text-sm">
        Silahkan berbelanja di toko online kami.
      </Text>
    </View>
    <Text className="text-lg font-semibold text-slate-800 mb-3">
      🎁 Promo Special
    </Text>
    <View className="flex-row flex-wrap justify-between">
      <View className="w-[48%] bg-white rounded-xl p-3 mb-3 shadow-sm">
        <Text className="text-2xl mb-2">🏷</Text>
        <Text className="text-lg font-semibold text-slate-800">Diskon 20%</Text>
        <Text className="text-xs text-slate-500">Untuk semua produk sembako</Text>
      </View>

      <View className="w-[48%] bg-white rounded-xl p-3 mb-3 shadow-sm">
        <Text className="text-2xl mb-2">🚚</Text>
        <Text className="text-lg font-semibold text-slate-800">Gratis Ongkir</Text>
        <Text className="text-xs text-slate-500">Minimal Belanja 100k</Text>
      </View>

      <View className="w-[48%] bg-white rounded-xl p-3 mb-3 shadow-sm">
        <Text className="text-2xl mb-2">🎉</Text>
        <Text className="text-lg font-semibold text-slate-800">Cashback 10%</Text>
        <Text className="text-xs text-slate-500">Setiap pembelian member</Text>
      </View>

      <View className="w-[48%] bg-white rounded-xl p-3 mb-3 shadow-sm">
        <Text className="text-2xl mb-2">⭐</Text>
        <Text className="text-lg font-semibold text-slate-800">Point Ganda</Text>
        <Text className="text-xs text-slate-500">Hari Jumat & Sabtu</Text>
      </View>

    </View>
  </View>
);