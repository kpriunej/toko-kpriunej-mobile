import { Alert, Image, ImageStyle, Pressable, Text, View } from "react-native";
import TransaksiJualHeader from "../../../interfaces/TransaksiJualHeader";
import TransaksiJualDetail from "../../../interfaces/TransaksiJualDetail";
import { apiUrl, formatCurrency } from "../../../utils/helpers";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import Clipboard from '@react-native-clipboard/clipboard';
import { mandiri } from "../../../constants/Rekening";
import Countdown from "../../../utils/Countdown";
import { launchImageLibrary } from "react-native-image-picker"; 
import { apiService } from "../../../services/api.services";

interface FooterProps {
  transaksiJualHeader: TransaksiJualHeader<TransaksiJualDetail>;
  setTransaksiJualHeader: (transaksiJualHeader: TransaksiJualHeader<TransaksiJualDetail>) => void;
}

export const iconBank: ImageStyle = {
  width: 100,
  height: 40,
  resizeMode: "contain",
};

export default ({ transaksiJualHeader, setTransaksiJualHeader }: FooterProps) => {
  const tanggalBentukDate = new Date(transaksiJualHeader.created_at);
  const sisaWaktu = Countdown(new Date(tanggalBentukDate.setDate(tanggalBentukDate.getDate() + 1)));
  
  const uploadBuktiBayarKeAPI = async (imageUri: string, fileName: string, fileType: string) => {
    const formData = new FormData();
    Object.keys(transaksiJualHeader).forEach((key) => {
      formData.append(key, transaksiJualHeader[key]);
    })
    
    formData.append("bukti_bayar", {
      uri: imageUri,
      name: fileName || `bukti_bayar_${transaksiJualHeader.id}.jpg`,
      type: fileType || "image/jpeg",
    } as any);

    formData.append("status", "Dalam Proses");

    const response = await apiService("post", apiUrl("/api/transaksi-jual-header"), {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });

    if (response.status === 200) {
      Alert.alert("Sukses", "Bukti pembayaran berhasil diunggah!");
      
      if (response.data.data) {
        setTransaksiJualHeader({...transaksiJualHeader, ...response.data.data});
      }
    } else {
      Alert.alert("Gagal", "Bukti pembayaran gagal diunggah!");
    }
  };

  const handleBuktiBayar = async () => {
    const options: any = {
      mediaType: "photo" as const,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User membatalkan pilih gambar");
      } else if (response.errorMessage) {
        Alert.alert("Error", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        
        // Validasi jika URI ditemukan, jalankan fungsi upload
        if (asset.uri) {
          uploadBuktiBayarKeAPI(asset.uri, asset.fileName || '', asset.type || '');
        }
      }
    });
  };

  const handleCopy = async () => {
    Clipboard.setString(mandiri);
    Alert.alert(
      "Berhasil",
      "Nomor rekening berhasil disalin",
      [{ text: "OK", onPress: () => {} }]
    );
  }

  return (
    <>
      <View className="mb-4 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm shadow-sky-900/10">
        <View className="border-b border-sky-200">
          <Text className="text-lg font-bold text-sky-900 mb-4">
            Detail Pembayaran
          </Text>
        </View>
        <View className="flex-row items-center justify-between mt-4">
          <Text className="font-semibold text-sky-900">
            Transfer ke
          </Text>
          <Text className="font-semibold text-red-900 animate-pulse text-xl">
            {Countdown(sisaWaktu)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mt-4">
          <Image
            source={require("../../../../assets/icons/Mandiri.png")}
            style={iconBank}
          />
        </View>
        <View className="flex-row items-center justify-between mt-4">
          <Text className="text-xl font-semibold text-sky-900 tracking-widest">
            {mandiri}
          </Text>
          <Pressable
            onPress={handleCopy}
            className="flex-row items-center gap-2"
          >
            <FontAwesome5Icon name="copy" size={20} color="black" />
            <Text className="font-semibold text-sky-900">Copy</Text>
          </Pressable>
        </View>
        <View className="flex-row items-center justify-between mt-4 border-t border-sky-200">
          <Text className="text-xl font-semibold text-sky-900 mt-4">
            Total Pembayaran
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-sky-900">
            Rp. {formatCurrency(transaksiJualHeader.grandtotal)}
          </Text>
        </View>
        
        <Pressable 
          onPress={handleBuktiBayar} 
          className="mt-6 rounded-2xl bg-sky-700 px-5 py-4 items-center active:bg-sky-800"
        >
          <Text className="font-semibold text-white">
            {transaksiJualHeader.status === "Menunggu Pembayaran" ? "Unggah Bukti Bayar" : "Lihat Bukti Bayar"}
          </Text>
        </Pressable>
      </View>
    </>
  );
};