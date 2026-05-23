import { Image, Text, View } from "react-native";

interface HeaderProps {
  title: string | React.ReactNode
};

export default ({ title }: HeaderProps) => {
  return (
    <View className="bg-sky-700 px-4 py-3 shadow-sm rounded-b-3xl">
      <View className="flex-row items-center justify-between">
        {typeof title === 'string' ? (
          <Text className="text-lg font-semibold text-white">{title}</Text>
        ) : (
          title
        )}
        <Image
          source={require('../../assets/icons/logo.png')}
          className="h-10 w-10 rounded-full bg-white"
        />
      </View>
    </View>
  );
}