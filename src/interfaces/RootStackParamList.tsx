type RootStackParamList = {
  Login: { verified?: string }; 
  LupaPassword: undefined;
  VerifyCode: { email: string };
  ResetPassword: { email: string, token: string };
  Pendaftaran: undefined;
  Main: undefined;
  Keranjang: undefined;
  Pesanan: undefined;
  Profil: undefined;
  ProfilSaya: undefined;
  AlamatPengiriman: undefined;
  PengaturanAkun: undefined;
  Pembayaran: undefined;
  DetailPesanan: { id_header: number };
}

export default RootStackParamList