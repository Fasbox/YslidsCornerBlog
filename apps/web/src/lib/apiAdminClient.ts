import { supabase } from "./supabaseClient";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("Falta VITE_API_URL");

export async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("No hay sesión activa");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });

  // 👇 importante
  if (res.status === 401 || res.status === 403) {
    // token inválido/expirado o sin permisos
    await supabase.auth.signOut();
    throw new Error("Sesión expirada o sin permisos. Inicia sesión de nuevo.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  return res.json();
}
