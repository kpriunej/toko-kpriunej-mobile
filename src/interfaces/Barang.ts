export default interface Barang {
  idtab: number;
  kode_barang: string;
  nama_barang: string;
  type: string | null;
  nama_kemasan: string | null;
  hargajual1: number | null;
  saldo_stock: number | null;
  is_active: boolean;
}