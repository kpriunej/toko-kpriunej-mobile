import { getApiUrl } from '../../../lib/env';

export type LoginRequest = {
  login: string;
  password: string;
};

export type AuthUser = {
  id: number;
  member_id: string | null;
  name: string;
  email: string;
  no_hp: string | null;
  role: string;
};

export type LoginResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  user?: AuthUser;
  data?: unknown;
};

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${getApiUrl()}/mobile/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
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
