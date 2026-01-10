const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  // Esto falla rápido en dev si olvidas la env
  throw new Error("VITE_API_URL no está definida");
}

type ApiError = {
  error?: {
    message?: string;
    code?: string;
    details?: unknown;
  };
};

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    },
    credentials: "include", // listo para auth luego
    ...options
  });

  if (!res.ok) {
    let payload: ApiError | null = null;
    try {
      payload = await res.json();
    } catch {
      /* noop */
    }

    const message =
      payload?.error?.message ??
      `Error ${res.status} al llamar ${path}`;

    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
