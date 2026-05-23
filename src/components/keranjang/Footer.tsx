import { Pressable, Text, View } from "react-native";
import { formatCurrency } from "../../utils/helpers";

interface FooterProps {
  total: number;
  handleClearCart: () => void;
  handleCheckout: () => void;
  isLoading: boolean;
}

export default ({ total, handleClearCart, handleCheckout, isLoading }: FooterProps) => {
  return (
    <View className="border-t border-sky-200 bg-white px-4 py-4">
      <View className="mb-3 flex-row justify-between">
        <Text className="text-lg font-semibold text-slate-700">Total:</Text>
        <Text className="text-xl font-bold text-sky-900">{formatCurrency(total)}</Text>
      </View>

      <View className="flex-row gap-3">
        <Pressable
          onPress={handleClearCart}
          className="flex-1 rounded-xl border border-rose-300 bg-rose-50 py-3 active:bg-rose-100"
        >
          <Text className="text-center font-semibold text-rose-700">Hapus Semua</Text>
        </Pressable>

        <Pressable
          onPress={handleCheckout}
          className="flex-1 rounded-xl bg-sky-700 py-3 active:bg-sky-800"
          disabled={isLoading}
        >
          <Text className="text-center font-semibold text-white">
            {isLoading ? 'Sedang memproses...' : 'Checkout'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}