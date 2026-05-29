
interface StatusDetail {
  color: string;
  background: string;
}

const statusDetail: Record<string, StatusDetail> = {
  "Menunggu Pembayaran": {
    color: "text-yellow-600",
    background: "bg-yellow-100",
  },
  "Menunggu Konfirmasi": {
    color: "text-sky-600",
    background: "bg-sky-100",
  },
  "Diproses": {
    color: "text-indigo-600",
    background: "bg-indigo-100",
  },
  "Dikirim": {
    color: "text-blue-600",
    background: "bg-blue-100",
  },
  "Selesai": {
    color: "text-green-600",
    background: "bg-green-100",
  },
  "Dibatalkan": {
    color: "text-rose-600",
    background: "bg-rose-100",
  },
  "Ditolak": {
    color: "text-rose-600",
    background: "bg-rose-100",
  },
  "EXPIRED": {
    color: "text-white",
    background: "bg-gray-600",
  },
}

export default statusDetail;