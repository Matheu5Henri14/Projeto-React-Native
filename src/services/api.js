import { Platform } from 'react-native';

const defaultBaseUrl =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3333/api'
    : 'http://localhost:3333/api';

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || defaultBaseUrl
).replace(/\/$/, '');

export async function apiRequest(
  path,
  { method = 'GET', body, token } = {}
) {
  const headers = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      ...(body !== undefined
        ? { body: JSON.stringify(body) }
        : {}),
    });
  } catch (error) {
    const networkError = new Error(
      `Não foi possível conectar à API em ${API_BASE_URL}. ` +
      'Verifique se o backend está ativo e se o endereço da API está correto.'
    );
    networkError.status = 0;
    throw networkError;
  }

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const apiError = new Error(
      payload.error || `A API retornou o erro ${response.status}.`
    );
    apiError.status = response.status;
    throw apiError;
  }

  return payload;
}