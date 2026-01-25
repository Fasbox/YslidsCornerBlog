# API — Yslid’s Corner (Hono + Cloudflare Worker)

Este documento describe el **contrato real** de la API que consume el frontend (`apps/web`) y que vive en `apps/api-worker`.

- Backend: **Cloudflare Worker + Hono**
- DB/Auth: **Supabase**
- Validación: **Zod** (queries, params y bodies)

> Objetivo: que en 3–6 meses cualquiera (incluyéndote a ti) pueda volver y entender qué hay, cómo se usa y cómo se extiende.

---

## 1) Base URL

El frontend llama a la API usando:

- `VITE_API_URL` (frontend) → ejemplo: `https://api.yslidscorner.com`
- Todas las rutas mostradas abajo son relativas a ese base URL.

En tu web se consume así:

- Público: `apiFetch(path)` en `web/src/lib/apiClient.ts`
- Admin: `adminFetch(path)` en `web/src/lib/apiAdminClient.ts` (incluye Bearer token)

---

## 2) Autenticación (solo Admin)

Los endpoints **/admin/** requieren autenticación.

### Cómo se autentica un admin (flujo real)
1. El admin inicia sesión en la web con **Supabase Auth**.
2. La web obtiene el JWT:
   - `supabase.auth.getSession()`
3. La web llama a la API admin incluyendo:
   - `Authorization: Bearer <access_token>`

### Qué hace la API
- Valida el token con `requireAdmin` (middleware).
- Si el token es inválido/expiró o no tiene permisos:
  - Respuesta: **401** o **403** (según implementación de `requireAdmin`).

> Regla de oro:
> - `SUPABASE_SERVICE_ROLE_KEY` **solo** en backend (Worker).
> - La web **nunca** debe tener service role key.

---

## 3) CORS y Seguridad

En `src/index.ts`:
- La API hace preflight con `OPTIONS *` validando `Origin` contra `CORS_ORIGIN`.
- Luego agrega headers CORS en todas las respuestas (post-handler).
- Agrega headers de seguridad con `securityHeaders`.
- En `/admin/*` agrega `noStoreAdmin` para evitar caching.

---

## 4) Formato de errores (consistente)

Tu API centraliza errores con:
- `jsonError(c, message, code, status, details?)`
- `toErrorResponse(c, e)` para excepciones
- `app.onError(...)` para no controlados
- `app.notFound(...)` para 404

### Forma esperada por el frontend
El cliente intenta leer errores como:
```json
{
  "error": {
    "message": "texto",
    "code": "ALGO",
    "details": {}
  }
}
```

## 5) Endpoints públicos (sin auth)
### 5.1 Health
### GET /health
Descripción: confirma que el Worker responde.