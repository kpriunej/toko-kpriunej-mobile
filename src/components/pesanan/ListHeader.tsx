import { ScrollView, StyleProp, ViewStyle } from "react-native";
import FilterStatus from "./FilterStatus";

interface Props {
  fetchItem: (page: number, options?: any) => void
}

export const contentContainerStyle: StyleProp<ViewStyle> = { 
  flexDirection: 'row', // Ini pengganti flex-row agar berjejer ke samping
  alignItems: 'center', // Ini KUNCI-nya supaya tombol tidak molor ke bawah
  gap: 3,
  paddingTop: 12,
  paddingBottom: 12 // Tambah sedikit padding bawah agar shadow/border tidak terpotong
};

export default ({ fetchItem }: Props) => {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle}
    >
      <FilterStatus fetchItem={fetchItem} status="Semua" />
      <FilterStatus fetchItem={fetchItem} status="Menunggu Pembayaran" />
      <FilterStatus fetchItem={fetchItem} status="Menunggu Konfirmasi" />
      <FilterStatus fetchItem={fetchItem} status="Diproses" />
      <FilterStatus fetchItem={fetchItem} status="Dikirim" />
      <FilterStatus fetchItem={fetchItem} status="Selesai" />
      <FilterStatus fetchItem={fetchItem} status="Dibatalkan" />
    </ScrollView>
  );
}