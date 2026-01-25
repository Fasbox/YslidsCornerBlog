# 01 – Setup local (desarrollo en tu máquina)

Este documento explica cómo levantar el proyecto **en local** (frontend + API) de forma simple y repetible.

> Objetivo: que en 5–10 min puedas abrir el proyecto, instalar dependencias y tener:
> - **web** corriendo en `localhost`
> - **api-worker** corriendo con Wrangler en `localhost`
> - conectados entre sí

---

## Requisitos

Instala esto una sola vez en tu máquina:

- **Node.js** (recomendado: LTS)
- **pnpm** (recomendado para este repo)
- Cuenta/config de **Cloudflare** (solo para deploy, no para correr local)
- Acceso a **Supabase** (URL + keys)

### Verificar versiones (opcional)
```bash
node -v
pnpm -v
```

## 1) Clonar el repo e instalar dependencias

### Web
cd apps/web
pnpm install

### API Worker
cd ../api-worker
pnpm install

## 2) Variables de entorno (local)

### 2.1 Web (apps/web/.env)
En apps/web/ crea un archivo .env (si no existe):

URL del worker en local (Wrangler)
VITE_API_URL=http://127.0.0.1:8787

Solo si el frontend usa Supabase directo
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

### 2.2 API (apps/api-worker/.dev.vars)
En apps/api-worker/ crea o actualiza .dev.vars
(este archivo es usado por Wrangler en local):

CORS para desarrollo
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173

Supabase
SUPABASE_URL=TU_SUPABASE_URL
SUPABASE_ANON_KEY=TU_SUPABASE_ANON_KEY

Opcional (si la API lo usa internamente)
API_BASE_URL=http://127.0.0.1:8787

