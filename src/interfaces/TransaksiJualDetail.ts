export default interface TransaksiJualDetail {
  idtab: number;
  // Data Faktur
  nomor_faktur?: string | null;
  tanggal_faktur?: string | null; // Menggunakan string untuk format date (YYYY-MM-DD)
  tanggal_jthtempo?: string | null;

  // Data Barang
  kode_barang?: string | null;
  nama_barang?: string | null;

  // Angka / Finansial / Stok
  quantity: number;
  satuan?: string | null;
  biji?: number | null;
  hpp?: number | null;
  harga?: number | null;
  discount?: number | null;
  discountrp?: number | null;
  jumlah?: number | null;
  total?: number | null;
  transport?: number | null;
  bayar?: number | null;

  // Data Pelanggan
  kode_pelanggan?: string | null;
  nama_pelanggan?: string | null;

  // Data Kasir & Shift
  kasir?: string | null;
  namakasir?: string | null;
  shift?: number | null;

  // Sistem & Transaksi
  komputer?: string | null;
  tipebayar?: string | null;
  jam?: string | null;

  // Flags & Harga Tambahan
  hargaasli?: number | null;
  flgharga?: number | null;

  // Voucher
  voucher?: number | null;
  kode_voucher?: string | null;

  // Foreign Keys / IDs
  id_tenant?: number | null;
  id_unit_kerja?: number | null;
  id_user?: number | null;

  // Tanggal Sistem
  tanggal_transaksi?: string | null;
}