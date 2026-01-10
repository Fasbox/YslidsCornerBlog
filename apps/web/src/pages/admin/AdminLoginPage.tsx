import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import { supabase } from "../../lib/supabaseClient";

export default function AdminLoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.length >= 6 && !loading;
  }, [email, password, loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setErr(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;

      if (data.session) nav("/admin");
    } catch (e: any) {
      setErr(e?.message ?? "Error iniciando sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      {/* reutilizamos el layout del adminEditor (ya lo tienes estilizado) */}
      <div className="adminEditor">
        <header className="adminEditor__header">
          <div>
            <h1 className="adminEditor__title">Admin</h1>
            <p className="adminEditor__subtitle">Login privado para el dueño.</p>
          </div>
        </header>

        <Card>
          <div className="card-pad">
            <form onSubmit={onSubmit} className="metaGrid">
              <div className="metaGrid__span2">
                <label className="fieldLabel">Email</label>
                <input
                  className="fieldControl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="tu-email@dominio.com"
                />
              </div>

              <div className="metaGrid__span2">
                <label className="fieldLabel">Password</label>
                <input
                  type="password"
                  className="fieldControl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <p className="helpText">Solo tú deberías tener acceso a este panel.</p>
              </div>

              {err ? (
                <div className="metaGrid__span2">
                  <p className="helpText">{err}</p>
                </div>
              ) : null}

              <div className="metaGrid__span2">
                <button type="submit" disabled={!canSubmit} className="btn btn--primary">
                  {loading ? "Entrando…" : "Entrar"}
                </button>
                {!canSubmit ? (
                  <p className="helpText">Ingresa email y password para continuar.</p>
                ) : null}
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
