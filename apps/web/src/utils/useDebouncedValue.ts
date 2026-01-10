import { useEffect, useState } from "react";

/**
 * Devuelve un valor "debounced":
 * - Espera `delayMs` ms después del último cambio antes de actualizarse.
 * - Si el usuario sigue escribiendo, reinicia el contador.
 */
export function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}
