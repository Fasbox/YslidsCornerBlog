# Yslid’s Corner

Blog público sobre **tecnología** y **ciberseguridad para todos**.

Este repo está dividido en 2 partes:

- **web/** → Frontend (React + Vite) desplegado en **Cloudflare Pages**
- **api-worker/** → Backend (Hono) desplegado como **Cloudflare Worker**
- **Supabase** → Base de datos (y también autenticación / storage si lo usas)

---

## Qué ya tiene la app (estado actual)

✅ **Frontend**
- Home (Hero, Paths, Social, Blog placeholder, About)
- Listado de posts (Tech / FASEC)
- Detalle de post (render de TipTap content)
- Búsqueda por tags / section
- Dashboard Admin (editor TipTap, series, tags)
- Autenticación Admin (protegida desde API)

✅ **Backend**
- Endpoints públicos para posts/tags/series
- Endpoints admin para CRUD de posts/series/tags
- Middlewares (CORS, headers de seguridad, auth admin)

⚠️ Pendiente / Roadmap cercano
- Home: “últimos posts reales”
- SEO avanzado (meta dinámico por post, OG tags, sitemap, canonical, etc.)
- Tests (unit / integration) para API y para UI

---

## Estructura del proyecto (explicada “en humano”)

### 1) `api-worker/` (Backend en Cloudflare Worker)

**Idea general:** aquí vive tu API (la que consume el frontend).  
Se organiza en capas para que sea mantenible:

- **routes/**: define las rutas HTTP (qué URL existe y qué método: GET/POST/etc.)
- **services/**: lógica del negocio (ej: “traer post por slug”, “crear post”, “posts relacionados”)
- **repositories/**: capa de datos (consultas a Supabase: select/insert/update)
- **middlewares/**: “filtros” antes de ejecutar rutas (CORS, seguridad, auth)
- **config/**: variables de entorno y cliente de Supabase
- **types/**: tipos globales (TypeScript)
- **utils/**: helpers reutilizables (errores, http, etc.)

**Árbol (resumen):**
api-worker/
src/
config/
env.ts
supabase.ts
middlewares/
cors.ts
noStoreAdmin.ts
requireAdmin.ts
securityHeaders.ts
repositories/
posts.repo.ts
tags.repo.ts
series.repo.ts
postTags.repo.ts
admin.posts.repo.ts
admin.series.repo.ts
routes/
health.routes.ts
posts.routes.ts
tags.routes.ts
admin.posts.routes.ts
admin.series.routes.ts
admin.tags.routes.ts
services/
posts.service.ts
related.service.ts
tags.service.ts
series.service.ts
adminPosts.service.ts
adminSeries.service.ts
types/
app.ts
utils/
errors.ts
httpError.ts
index.ts
wrangler.toml


---

### 2) `web/` (Frontend)

**Idea general:** aquí vive la interfaz.  
Separamos “pantallas”, “componentes” y “conexión a la API”.

- **pages/**: páginas/rutas (HomePage, PostDetailPage, SearchPage, Admin pages, etc.)
- **pages/components/home/**: componentes específicos del Home
- **components/**: componentes reutilizables (Card, PostContent, TipTapImageLightbox, etc.)
- **features/**: agrupado por “dominio” (posts, tags, admin) con APIs + hooks
- **lib/**: clientes base (apiClient, supabaseClient si aplica)
- **hooks/**: hooks reutilizables (media query, health, zoom imágenes, etc.)
- **styles/**: CSS por componentes y páginas
- **functions/**: (Cloudflare Pages Functions) si estás usando funciones en Pages

**Árbol (resumen):**
web/
public/
src/
components/
shell/
Drawer.tsx
Topbar.tsx
shell-types.ts
Card.tsx
Container.tsx
PostContent.tsx
SectionCard.tsx
TagPicker.tsx
TiptapImageLightbox.tsx
InlineSearch.tsx
features/
posts/
posts.api.ts
postDetail.api.ts
content.utils.ts
usePosts.ts
usePostDetail.ts
useInlinePostsSearch.ts
tags/
tags.api.ts
useTags.ts
admin/
adminPosts.api.ts
adminPostDetail.api.ts
adminPostsSeries.api.ts
adminSeries.api.ts
adminTags.api.ts
adminPostTags.api.ts
adminPostsList.api.ts
useAdminTags.ts
hooks/
useDebouncedValue.ts
useMediaQuery.ts
useHealth.ts
usePostSeries.ts
useRelatedPosts.ts
useTiptapImageZoom.ts
layouts/
AppShell.tsx
lib/
apiClient.ts
apiAdminClient.ts
supabaseClient.ts
pages/
HomePage.tsx
PostDetailPage.tsx
SearchPage.tsx
SectionIndexPage.tsx
NotFoundPage.tsx
RelatedPosts.tsx
components/home/
HomeBg.tsx
HomeHero.tsx
HomePaths.tsx
HomeSocial.tsx
HomeBlog.tsx
HomeAbout.tsx
admin/
editor/
...
styles/
token.css
base.css
layout.css
components/
tiptap.css
postDetail.css
adminDashboard.css
adminEditor.css
...
functions/
_middleware.ts
ping.ts


---

## Cómo se conectan WEB y API (flujo simple)

1. El usuario abre **web** (Cloudflare Pages).
2. Web llama a **api-worker** (Cloudflare Worker) para traer posts/tags/series.
3. La API consulta/actualiza datos en **Supabase**.
4. La API responde JSON y la web lo renderiza.

---

## Variables de entorno (lo mínimo que debes documentar)

> Los nombres exactos pueden variar según tu `env.ts` (api-worker) y tu `apiClient.ts` (web),
> pero esto es lo que normalmente necesitas.

### `api-worker` (Cloudflare Worker)
En Cloudflare/Wrangler (secrets/vars):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` *(solo en el backend, nunca en la web)*
- `VITE_SUPABASE_ANON_KEY`
- `CORS_ORIGIN`
- `API_BASE_URL`

### `web` (Vite / Cloudflare Pages)
En Cloudflare Pages (Environment Variables):

- `VITE_API_URL` (url del worker: `https://...workers.dev` o tu dominio)
- Si usas supabase directo desde el cliente:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

**Regla clave:**  
✅ `SERVICE_ROLE_KEY` solo en `api-worker` (backend).  
❌ Nunca en `web`.

---

## Comandos de desarrollo (local)

### Web
```bash
cd apps/web
npm install
npm run dev
```
## API (Cloudflare Worker + Hono)

### Requisitos
- Node.js + pnpm
- Wrangler (viene como dependencia del proyecto)

## Convenciones y decisiones importantes (léelo antes de tocar código)
### Separación de responsabilidades

Este proyecto sigue una regla clave:

- La web NO contiene lógica de negocio

- La API NO contiene lógica de presentación

Eso se refleja en:

- Web → hooks + componentes

- API → routes → services → repositories

Si algo parece “duplicado”, probablemente pertenece a otra capa.

## Arquitectura de la API (Hono)

La API sigue este flujo:

HTTP Request
   ↓
Route (valida URL y método)
   ↓
Middleware (auth, CORS, headers)
   ↓
Service (reglas del negocio)
   ↓
Repository (Supabase)
   ↓
Response JSON

## Rutas

Públicas: lectura de posts, tags, series

Admin: CRUD (requieren autenticación)

Ejemplo:
GET /posts/:slug
→ posts.routes.ts
→ posts.service.ts
→ posts.repo.ts

## 🔐 Autenticación (Admin)

- La autenticación no vive en la web
- La web solo envía credenciales / token
- La API valida con:

    - requireAdmin.ts
    - SUPABASE_SERVICE_ROLE_KEY

Esto evita:

- Exponer secretos en frontend
- Bypass de permisos desde el navegador

## ✍️ Editor de contenido (TipTap)

- El contenido de los posts se guarda como JSON

- Se renderiza en:

    - Web pública (PostContent)
    - Dashboard Admin (Editor)

Ventajas:

- No dependes de HTML inseguro
- Puedes transformar / migrar contenido en el futuro
- Mejor control de imágenes, tablas, embeds

## 🖼️ Imágenes en posts

Comportamiento actual:

- En mobile:
    - Tap → zoom (lightbox)
    - Tap fuera → cerrar

- En desktop:
    - Responsive, sin scroll horizontal

- Esto se controla con:
    - TiptapImageLightbox.tsx
    - useTiptapImageZoom.ts
    - tiptap.css

## 🌍 SEO (estado actual)
### Implementado
- URLs limpias por slug
- Separación por sección (Tech / FASEC)

### Pendiente (planificado)
- Meta tags dinámicos por post
- Open Graph (OG)
- Sitemap.xml
- Canonical URLs
- Structured Data (JSON-LD)

## 🧪 Testing (pendiente)
Aún NO hay tests, pero la estructura ya lo permite.
## API (recomendado)
- Tests de services (unit)
- Tests de routes (integration)
- Usar:
    - Vitest
    - Miniflare (Cloudflare Workers)
## Web (recomendado)
- Tests de hooks
- Tests de páginas clave
- Usar:
    - Vitest
    - Testing Library

## 🚀 Deploy
### API (Cloudflare Worker)
cd apps/api-worker
pnpm deploy

Usa wrangler.toml como fuente de verdad.
Secrets se mantienen en Cloudflare Dashboard.

### Web
Con el commit al github se sincorniza automáticamente


