import { Pressable, Text, View } from "react-native"
import { formatCurrency } from "../../utils/helpers"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"
import CartItem from "../../interfaces/CartItem"

interface RenderCardProps {
  item: CartItem
  handleQuantityChange: (id: number, quantity: number) => void
}

export default ({ item, handleQuantityChange }: RenderCardProps) => {
  return (
    <View className="mb-4 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm shadow-sky-900/10">
      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            {item.kode_barang}
          </Text>
          <Text className="mt-1 text-base font-bold text-sky-950">
            {item.nama_barang}
          </Text>
          <Text className="mt-1 text-sm font-semibold text-amber-900">
            {formatCurrency(item.hargajual1 ?? 0)}/{item.nama_kemasan ? item.nama_kemasan.substring(3) : '-'}
          </Text>
        </View>

        <View className="ml-2 items-end">
          <Text className="text-lg font-bold text-sky-900">
            {formatCurrency((item.hargajual1 ?? 0) * item.quantity)}
          </Text>
        </View>
      </View>

      <View className="mt-3 flex-row items-center justify-between rounded-lg bg-gray-100 p-2">
        <Pressable
          onPress={() => handleQuantityChange(item.idtab, item.quantity - 1)}
          className="h-8 w-8 items-center justify-center rounded bg-sky-600 active:bg-sky-700"
        >
          <FontAwesome5Icon name="minus" size={12} color="#fff" />
        </Pressable>

        <Text className="text-sm font-bold text-sky-900">{item.quantity}</Text>

        <Pressable
          onPress={() => handleQuantityChange(item.idtab, item.quantity + 1)}
          className="h-8 w-8 items-center justify-center rounded bg-sky-600 active:bg-sky-700"
        >
          <FontAwesome5Icon name="plus" size={12} color="#fff" />
        </Pressable>
      </View>
    </View>
  )
}