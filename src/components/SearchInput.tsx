import { TextInput, View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

interface Props {
  query: string;
  setQuery: (query: string) => void;
  placeholder?: string;
  callback: () => void;
}

export default ({ query, setQuery, placeholder = "Cari barang favorit kamu...", callback}: Props) => {
  return (
    <View className="flex-row items-center gap-2 mt-2 relative">
      <TextInput
        className="flex-1 h-10 py-0 rounded-2xl border border-sky-200 px-4 text-base text-slate-900 bg-white"
        placeholder={placeholder}
        placeholderTextColor="#6b7280"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
      />
      <FontAwesome5Icon
        name="search"
        size={18}
        color="#047857"
        onPress={callback}
        className="absolute right-5"
      />
    </View>
  );
}