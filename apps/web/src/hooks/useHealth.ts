import { useEffect, useState } from "react";
import { apiFetch } from "../lib/apiClient";

type HealthResponse = {
  ok: boolean;
  service: string;
  ts: string;
};

export function useHealth() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    apiFetch<HealthResponse>("/health")
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}
