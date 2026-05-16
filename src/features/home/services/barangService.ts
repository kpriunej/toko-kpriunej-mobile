import { getApiUrl } from '../../../lib/env';

export type BarangItem = {
  idtab: number;
  kode_barang: string;
  nama_barang: string;
  type: string | null;
  nama_kemasan: string | null;
  hargajual1: number | null;
  saldo_stock: number | null;
  is_active: boolean;
};

export type BarangResponse = {
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  total: number;
  data: BarangItem[];
};

const runtimeEnv = (
  globalThis as {
    process?: {
      env?: Record<string, string | undefined>;
    };
  }
).process?.env;

const appKey = runtimeEnv?.X_APP_KEY ?? 'KPRIUNEJ_MOBILE_2026';

export async function getBarang(page = 1): Promise<BarangResponse> {
  const headers = {
    Accept: 'application/json',
    'X-APP-KEY': appKey,
  };

  const url = `${getApiUrl()}/barang?page=${page}`;

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  const rawText = await response.text();
  let parsed: BarangResponse | null = null;

  if (rawText) {
    try {
      parsed = JSON.parse(rawText) as BarangResponse;
    } catch {
      parsed = null;
    }
  }

  if (!response.ok || !parsed) {
    throw new Error('Gagal memuat data barang. Coba beberapa saat lagi.');
  }

  return parsed;
}