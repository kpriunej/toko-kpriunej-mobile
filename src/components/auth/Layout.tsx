import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface Props {
  children: React.ReactNode;
}

export default ({ children }: Props) => {
  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-6 py-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>
            <View className="rounded-[32px] bg-sky-950 px-6 py-8 shadow-sm">
              <View className="items-center gap-3">
                <View className="h-16 w-16 overflow-hidden rounded-2xl bg-white/10 p-2">
                  <Image
                    source={require('../../../assets/icons/logo.png')}
                    className="h-full w-full"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-xs font-semibold uppercase tracking-[3px] text-sky-200">
                  TOKO ONLINE
                </Text>
              </View>
              <Text className="mt-6 text-base leading-6 text-center text-sky-100">
                KPRI Universitas Jember
              </Text>
            </View>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}