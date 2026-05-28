import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  fetchItem: (page: number, options?: any) => void;
  status: string;
}
export default ({ fetchItem, status }: Props) => {

  return (
    <TouchableOpacity
      onPress={() => fetchItem(1, { status: status })}
      className="rounded-xl border border-sky-300 bg-white py-1 px-2"
    >
      <View pointerEvents="none">
        <Text className="text-sm font-semibold text-sky-700">
          {status}
        </Text>
      </View>
    </TouchableOpacity>
  );
}