const FALLBACK_API_URL = 'https://toko.kpri-unej.com/api';

function trimTrailingSlash(url: string) {
  return url.replace(/\/+$/, '');
}

export function getApiUrl() {
  const runtimeEnv = (
    globalThis as {
      process?: {
        env?: Record<string, string | undefined>;
      };
    }
  ).process?.env;

  const envApiUrl = runtimeEnv?.API_URL;

  return trimTrailingSlash(envApiUrl ?? FALLBACK_API_URL);
}
