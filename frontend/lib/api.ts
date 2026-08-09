const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Setting = {
  latitude: number;
  longitude: number;
  notify_hour: number;
  notify_minute: number;
  rain_threshold: number;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.detail ?? "通信中にエラーが発生しました";
    throw new Error(
      typeof message === "string" ? message : JSON.stringify(message)
    );
  }
  return response.json();
}

export async function register(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse<{ id: number; username: string }>(response);
}

export async function login(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse<{ access_token: string; token_type: string }>(
    response
  );
}

export async function getSettings(token: string) {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<Setting>(response);
}

export async function updateSettings(token: string, setting: Setting) {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(setting),
  });
  return handleResponse<{ message: string }>(response);
}

export async function issueLinkCode(token: string) {
  const response = await fetch(`${API_BASE_URL}/link-code`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<{ link_code: string; message: string }>(response);
}
