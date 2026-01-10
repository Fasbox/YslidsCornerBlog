import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function AdminGuard() {
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let alive = true;

    async function run() {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      setHasSession(Boolean(data.session));
      setChecking(false);
    }

    run();

    // opcional: reaccionar a cambios de auth
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(Boolean(session));
      setChecking(false);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (checking) {
    return (
      <div className="container">
        <div style={{ padding: 24 }}>
          <p className="helpText">Verificando sesión…</p>
        </div>
      </div>
    );
  }

  if (!hasSession) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
}
