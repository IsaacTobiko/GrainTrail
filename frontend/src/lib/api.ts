const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.detail === "string"
        ? data.detail
        : "Please check your details";
    throw new ApiError(message, res.status);
  }
  return data as T;
}

export function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function get<T>(path: string, token: string): Promise<T> {
  return request<T>(path, { headers: { Authorization: `Bearer ${token}` } });
}
