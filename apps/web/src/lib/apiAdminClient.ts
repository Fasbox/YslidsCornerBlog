import { supabase } from "./supabaseClient";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("Falta VITE_API_URL");

type ErrorLike =
  | { error?: { message?: string } | string; message?: string }
  | null
  | undefined;

function pickErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;

  const p = payload as ErrorLike;

  // error puede venir como string o como { message }
  const err = (p as any).error;
  if (typeof err === "string" && err.trim()) return err;
  if (err && typeof err === "object" && typeof (err as any).message === "string") return (err as any).message;

  // message directo
  if (typeof (p as any).message === "string" && (p as any).message.trim()) return (p as any).message;

  return fallback;
}

export async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) throw new Error("No hay sesión activa");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });

  // token inválido/expirado o sin permisos
  if (res.status === 401 || res.status === 403) {
    await supabase.auth.signOut();
    throw new Error("Sesión expirada o sin permisos. Inicia sesión de nuevo.");
  }

  // Intentar leer JSON de error (sin romper si no es JSON)
  let payload: unknown = null;
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
  } else {
    // a veces el backend manda texto
    try {
      payload = await res.text();
    } catch {
      payload = null;
    }
  }

  if (!res.ok) {
    const fallback = typeof payload === "string" && payload.trim() ? payload : `HTTP ${res.status}`;
    const msg = pickErrorMessage(payload, fallback);
    throw new Error(msg);
  }

  // ✅ respuesta OK
  // si no es JSON, igual devolvemos algo (pero tu API normalmente es JSON)
  if (ct.includes("application/json")) return (payload as T) ?? (await res.json());
  return (payload as unknown as T);
}
