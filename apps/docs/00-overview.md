# Overview – Yslid’s Corner

## ¿Qué es Yslid’s Corner?

**Yslid’s Corner** es un blog público sobre **tecnología y ciberseguridad**, enfocado en explicar conceptos técnicos de forma clara y accesible para todo tipo de público.

El proyecto está pensado como:
- Un **sitio de contenido** (posts, series, tags)
- Con un **dashboard privado** para administración de contenido
- Separando claramente **frontend**, **backend** y **base de datos**
- Preparado para crecer en el tiempo (SEO, tests, nuevas features)

---

## Objetivos del proyecto

- Publicar contenido técnico de forma clara y visual
- Mantener una arquitectura **simple pero profesional**
- Evitar acoplamientos innecesarios
- Facilitar el mantenimiento a mediano y largo plazo
- Permitir escalar sin reescribir todo

---

## Stack tecnológico (alto nivel)

### Frontend
- **React + Vite**
- TipTap para edición y render de contenido
- React Router para navegación
- React Query para manejo de estado remoto
- Desplegado en **Cloudflare Pages**

### Backend
- **Hono** corriendo en **Cloudflare Workers**
- API REST (JSON)
- Autenticación admin protegida desde backend
- **Zod** para validación (schemas) de:
  - payloads (body) que llegan a endpoints (ej: crear/editar post)
  - parámetros (ej: slug)
  - query params (ej: paginación, filtros)
  - respuesta/normalización opcional si lo quieres estandarizar
- Separación por capas (routes / services / repositories)

### Base de datos
- **Supabase**
  - PostgreSQL
  - Usado como backend de datos principal
  - Acceso controlado por claves (anon / service role)

---

## ¿Zod cambia algo de la arquitectura?

No cambia la arquitectura general, pero **sí agrega una pieza importante de “seguridad y consistencia”** en la API:

- La **forma** en que se conectan WEB → API → DB no cambia.
- Lo que cambia es que la API ahora tiene una etapa explícita de:
  - **validar**
  - **rechazar**
  - y devolver errores claros
  antes de tocar servicios/repositorios.

En práctica, Zod encaja así:
Request (cliente)
|
v
Routes (Hono)
| (Zod valida input aquí o justo antes del Service)
v
Services (lógica)
v
Repositories (consultas a Supabase)
v
Response


**Beneficios directos:**
- Evitas que entren datos incompletos o mal formateados.
- Los errores son más claros (y más fáciles de depurar).
- Menos “casos raros” llegando a la base de datos.
- Te prepara para tests y para documentación de contratos.

---

## Arquitectura general

El proyecto se divide en tres grandes piezas:
[ Navegador ]
|
v
[ Web (React) ]
|
v
[ API (Hono - Cloudflare Worker) ]
|
v
[ Supabase (Postgres) ]


### Principios clave
- El **frontend nunca accede directamente a datos sensibles**
- Toda lógica crítica pasa por la **API**
- La API es la única que conoce la base de datos
- Las responsabilidades están separadas

---

## Organización del repositorio

Este repositorio contiene dos aplicaciones principales:
apps/
├─ web/ → Frontend (React)
└─ api-worker/ → Backend (Cloudflare Worker)


Y una carpeta adicional de documentación:

docs/ → Documentación técnica del proyecto

---

## ¿Qué hace cada parte?

### Web
- Renderiza el contenido público
- Maneja la navegación
- Consume la API
- Contiene el dashboard de administración
- No guarda secretos críticos

### API Worker
- Expone endpoints públicos (posts, tags, series)
- Expone endpoints protegidos (admin)
- Valida permisos
- **Valida datos con Zod** antes de procesar acciones críticas (ej: crear/editar)
- Orquesta la lógica de negocio
- Habla con Supabase

### Supabase
- Almacena posts, series, tags y relaciones
- Provee autenticación y roles (si lo usas)
- No es accesible directamente desde el cliente para acciones sensibles

---

## Estado actual del proyecto

### Implementado
- Blog público (listado y detalle de posts)
- Render de contenido TipTap
- Tags y series
- Posts relacionados
- Dashboard admin
- Autenticación admin
- API estructurada por capas
- Validación de datos en API (Zod)

### Pendiente / Roadmap
- Últimos posts reales en Home
- SEO avanzado (meta dinámico, OG, sitemap)
- Tests (API + UI)
- Mejoras de performance y accesibilidad

---

## Filosofía de documentación

- El `README.md` explica **qué es el proyecto**
- La carpeta `docs/` explica **cómo funciona**
- Las decisiones importantes viven en `docs/adr/`
- La documentación se actualiza junto con el código

---

## ¿Por dónde seguir leyendo?

- Setup local → `01-setup-local.md`
- Arquitectura → `02-architecture.md`
- API → `03-api.md`
- Base de datos → `04-database-supabase.md`
- Deploy → `05-deploy-cloudflare.md`
- Convenciones → `06-conventions.md`
- Decisiones técnicas → `adr/`

---
