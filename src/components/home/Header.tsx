import { useEffect, useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import style from "../../styles/home/style";

interface HeaderProps {
  params: { [key: string]: string };
  setParams: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const Header: React.FC<HeaderProps> = ({ params, setParams }) => {
  const [search, setSearch] = useState(params.q || '');
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearch(params.q || '');
  }, [params.q]);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handleSearchChange = (text: string) => {
    setSearch(text);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setParams(prev => ({ ...prev, q: text }));
    }, 500);
  };

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 relative">
        <TextInput
          value={search}
          onChangeText={handleSearchChange}
          autoCapitalize="none"
          placeholder="Cari barang..."
          placeholderTextColor="#94a3b8"
          className="rounded-2xl border border-stone-200 bg-stone-50 ps-4 pe-10 py-2 text-base text-stone-900"
        />
        {search === '' ? (
          <FontAwesome5Icon
            name="search"
            size={16}
            color="#94a3b8"
            style={style}
          />
        ) : (
          <Pressable
            onPress={() => handleSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 active:bg-stone-200"
          >
            <FontAwesome5Icon name="times" size={14} color="#94a3b8" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default Header;