import { getApiUrl } from '../../../lib/env';

export type LoginRequest = {
  login: string;
  password: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  sso_id: string;
  email_verified_at: string | null;
  is_active: boolean;
  member_id: string | null;
  group_id: number;
  unit_kerja_id: number | null;
  no_hp: string | null;
  noinduk: string | null;
  jabatan: string | null;
  pangkat: string | null;
  golongan: string | null;
  last_login_at: string;
  last_activity_at: string | null;
  last_login_ip: string;
  last_login_device: string | null;
  user_agent: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  is_verified: boolean;
  role: string;
};

export type LoginResponse = {
  success?: boolean;
  message?: string;
  token?: string;
};

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${getApiUrl()}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-APP-KEY': process.env.X_APP_KEY ?? 'KPRIUNEJ_MOBILE_2026',
    },
    body: JSON.stringify({
      login: payload.login,
      password: payload.password,
    }),
  });

  const responseText = await response.text();
  let data: LoginResponse = {};

  if (responseText) {
    try {
      data = JSON.parse(responseText) as LoginResponse;
    } catch {
      data = {
        message: responseText,
      };
    }
  }

  if (!response.ok) {
    throw new Error(data.message ?? 'Login gagal. Periksa username dan password.');
  }

  return data;
}

export async function me(token: string): Promise<AuthUser> {
  const response = await fetch(`${getApiUrl()}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'X-APP-KEY': process.env.X_APP_KEY ?? 'KPRIUNEJ_MOBILE_2026',
    },
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil data pengguna. Sesi mungkin sudah tidak valid.');
  }

  const data = await response.json();
  return data.data as AuthUser;
}
