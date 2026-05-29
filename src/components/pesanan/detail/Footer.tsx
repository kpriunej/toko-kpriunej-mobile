import { Alert, Image, ImageStyle, TouchableOpacity, Text, View } from "react-native";
import TransaksiJualHeader from "../../../interfaces/TransaksiJualHeader";
import TransaksiJualDetail from "../../../interfaces/TransaksiJualDetail";
import { apiUrl, formatCurrency } from "../../../utils/helpers";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import Clipboard from '@react-native-clipboard/clipboard';
import { mandiri } from "../../../constants/Rekening";
import Countdown from "../../../utils/Countdown";
import { launchImageLibrary } from "react-native-image-picker"; 
import { apiService } from "../../../services/api.services";
import ImageView from "react-native-image-viewing";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";

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
  const { user } = useAuth();
  const tanggalBentukDate = new Date(transaksiJualHeader.created_at);
  const sisaWaktu = Countdown(new Date(tanggalBentukDate.setDate(tanggalBentukDate.getDate() + 1)));
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState({
    bukti_bayar: false,
    batalkan: false,
    proses: false,
    tolak: false,
    kirim: false
  });
  
  const uploadBuktiBayarKeAPI = async (imageUri: string, fileName: string, fileType: string) => {
    setIsLoading({...isLoading, bukti_bayar: true});
    const formData = new FormData();
    Object.keys(transaksiJualHeader).forEach((key) => {
      formData.append(key, transaksiJualHeader[key]);
    })
    
    formData.append("bukti_bayar", {
      uri: imageUri,
      name: fileName || `bukti_bayar_${transaksiJualHeader.id}.jpg`,
      type: fileType || "image/jpeg",
    } as any);

    formData.append("status", "Menunggu Konfirmasi");

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
    
    setIsLoading({...isLoading, bukti_bayar: false});
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

  const handleChangeStatus = async (title: string, status: string) => {
    Alert.alert(
      title,
      `Apakah kamu yakin ingin ${title}?`,
      [
        { text: "Batal", onPress: () => {} },
        {
          text: title,
          onPress: async () => {
            await changeStatus(title, status);
          },
        },
      ]
    )
  }

  const changeStatus = async (title: string, status: string) => {
    setIsLoading({...isLoading, batalkan: true});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {bukti_bayar, ...data} = transaksiJualHeader;

    const response = await apiService("post", apiUrl("/api/transaksi-jual-header"), {
      data: {
        ...data,
        status: status
      }
    });

    if (response.status === 200) {
      Alert.alert("Alhamdulillah", `Berhasil ${title}`);
      setTransaksiJualHeader({...transaksiJualHeader, ...response.data.data});
    } else {
      Alert.alert("Astaghfirullah", `Gagal ${title}`);
    }

    setIsLoading({...isLoading, batalkan: false}); 
  }

  const handleCopy = async () => {
    Clipboard.setString(mandiri);
    Alert.alert(
      "Berhasil",
      "Nomor rekening berhasil disalin",
      [{ text: "OK", onPress: () => {} }]
    );
  }

  const adminHandle = () => {
    if (transaksiJualHeader.status === "Menunggu Konfirmasi") {
      return (
        <View className="flex-row mt-4 gap-3">
          <TouchableOpacity
            onPress={() => handleChangeStatus("Proses Pesanan", "Diproses")} 
            className="flex-1 rounded-2xl bg-green-700 px-5 py-4 items-center"
          >
            <Text className="font-semibold text-white">
              {isLoading.proses ? "Sedang memproses..." : "Proses Pesanan"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChangeStatus("Tolak Pesanan", "Ditolak")} 
            className="flex-1 rounded-2xl bg-red-700 px-5 py-4 items-center"
          >
            <Text className="font-semibold text-white">
              {isLoading.tolak ? "Sedang memproses..." : "Tolak Pesanan"}
            </Text>
          </TouchableOpacity>
        </View>
      )
    } else if (transaksiJualHeader.status === "Diproses") {
      return (
        <>
          <TouchableOpacity
            onPress={() => handleChangeStatus("Kirim Pesanan", "Dikirim")} 
            className="mt-4 rounded-2xl bg-green-700 px-5 py-4 items-center"
          >
            <Text className="font-semibold text-white">
              {isLoading.kirim ? "Sedang memproses..." : "Kirim Pesanan"}
            </Text>
          </TouchableOpacity>
        </>
      )
    } else {
      return null;
    }
  }

  return (
    <>
      <View className="mb-4 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm shadow-sky-900/10">
        <View className="border-b border-sky-200">
          <Text className="text-lg font-bold text-sky-900 mb-4">
            Detail Pembayaran
          </Text>
        </View>
        {transaksiJualHeader.status === "Menunggu Pembayaran" && (
          <View className="border-b border-sky-200">
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-sky-900">
                Transfer ke
              </Text>
              <Text className="font-semibold text-red-900 animate-pulse text-xl">
                {sisaWaktu}
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
              <TouchableOpacity
                onPress={handleCopy}
                className="flex-row items-center gap-2"
              >
                <FontAwesome5Icon name="copy" size={20} color="black" />
                <Text className="font-semibold text-sky-900">Copy</Text>
              </TouchableOpacity>
            </View>
            <View className="mb-4"/>
          </View>
        )}
        <Text className="font-semibold text-sky-900 mt-4">
          Jumlah : Rp. {formatCurrency((Number(transaksiJualHeader.grandtotal) ?? 0))}
        </Text>
        <Text className="font-semibold text-sky-900 mt-1">
          Kode Unik : {transaksiJualHeader.nomor_faktur.slice(-3)}
        </Text>
        <Text className="text-xl font-semibold text-sky-900 mt-4">
          Total Pembayaran
        </Text>
        <Text className="text-2xl font-bold text-sky-900">
          Rp. {formatCurrency((Number(transaksiJualHeader.grandtotal) ?? 0) + (Number(transaksiJualHeader.nomor_faktur.slice(-3))))}
        </Text>
        
        {transaksiJualHeader.bukti_bayar ? (
          <TouchableOpacity
            onPress={() => setIsImageViewerOpen(true)}
            className="mt-4 rounded-2xl bg-sky-700 px-5 py-4 items-center"
          >
            <Text className="font-semibold text-white">
              Lihat Bukti Bayar
            </Text>
          </TouchableOpacity>
        ) : null}
        {["Menunggu Pembayaran"].includes(transaksiJualHeader.status) && (
          <>
            {transaksiJualHeader.status === "Menunggu Pembayaran" && (
              <TouchableOpacity 
                onPress={handleBuktiBayar} 
                className="mt-6 rounded-2xl bg-sky-700 px-5 py-4 items-center"
              >
                <Text className="font-semibold text-white">
                  {isLoading.bukti_bayar ? "Sedang memproses..." : "Unggah Bukti Bayar"}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={() => handleChangeStatus("Membatalkan Pesanan", "Dibatalkan")} 
              className="mt-4 rounded-2xl bg-red-700 px-5 py-4 items-center"
            >
              <Text className="font-semibold text-white">
                {isLoading.batalkan ? "Sedang memproses..." : "Batalkan Pesanan"}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {user?.role === "Admin" && adminHandle()}
      </View>
      <ImageView
        images={[
          {
            uri: transaksiJualHeader.bukti_bayar_url,
          },
        ] as any}
        imageIndex={0}
        visible={isImageViewerOpen}
        onRequestClose={() => setIsImageViewerOpen(false)}
      />
    </>
  );
};