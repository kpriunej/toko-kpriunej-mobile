import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RootStackParamList from '../../../interfaces/RootStackParamList';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfilSaya'>;

export default ({ navigation }: Props) => {
  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <Header
        title={
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View pointerEvents="none">
                <FontAwesome5Icon name="arrow-left" size={24} color="white" />
              </View>
            </TouchableOpacity>
            <Text className="ml-2 text-lg font-semibold text-white">PROFIL SAYA</Text>
          </>
        }
      />
    </SafeAreaView>
  );
};
