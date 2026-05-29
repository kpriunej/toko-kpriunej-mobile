export default interface TransaksiJualHeader<TransaksiJualDetail> {
  id_header: number;
  created_at: string;
  status: string;
  grandtotal: number;
  tanggal_transaksi: string;
  nomor_faktur: string;
  transaksi_jual_detail?: TransaksiJualDetail[];
  nama_pelanggan?: string;
  [key: string]: unknown;
}