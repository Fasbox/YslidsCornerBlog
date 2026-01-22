# Overview — Yslid’s Corner

## Qué es
Blog público de tecnología y ciberseguridad para todos.

## Apps
- `apps/web`: Frontend React + Vite.
- `apps/api-worker`: API serverless con Hono desplegada como Cloudflare Worker.

## Datos
- Supabase: base de datos principal (posts, tags, etc).

## Flujo general
1. Web solicita datos al Worker (Hono).
2. Worker valida, aplica middlewares y consulta Supabase.
3. Worker responde JSON.
4. Web renderiza (Posts en TipTap JSON).
