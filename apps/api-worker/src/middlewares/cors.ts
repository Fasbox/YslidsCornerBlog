import { Hono } from "hono";
import type { AppContext } from "../types/app";

const app = new Hono<AppContext>();

type CorsHeaders = Record<string, string>;

export function corsHeaders(origin: string | null, allowedOrigins: string[]): CorsHeaders | null {
  if (!origin) return null;
  if (!allowedOrigins.includes(origin)) return null;

  return {
    "Access-Control-Allow-Origin": origin,
    "Vary": "Origin",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  };
}

export function parseAllowedOrigins(csv: string) {
  return csv.split(",").map(s => s.trim()).filter(Boolean);
}
