export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

type ApiErrorBody = {
  message?: string;
  fieldErrors?: Record<string, string>;
};

export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string>;

  constructor(message: string, status: number, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(
      "Không thể kết nối backend. Hãy kiểm tra Spring Boot đang chạy ở cổng 8080.",
      0,
    );
  }

  if (!response.ok) {
    let body: ApiErrorBody = {};
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      body = {};
    }
    throw new ApiError(body.message ?? "Yêu cầu không thành công.", response.status, body.fieldErrors);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}
