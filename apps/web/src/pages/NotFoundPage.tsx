import { useNavigate, useLocation } from "react-router-dom";
import Card from "../components/Card";

export default function NotFoundPage() {
  const nav = useNavigate();
  const loc = useLocation();

  return (
    <div style={{ padding: "24px 0" }}>
      <Card>
        <div className="card-pad" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1 }}>
            404
          </div>

          <h1 style={{ margin: "8px 0 0", fontSize: 22, fontWeight: 900 }}>
            Página no encontrada
          </h1>

          <p className="helpText" style={{ margin: "10px auto 0", maxWidth: 520 }}>
            La ruta <strong>{loc.pathname}</strong> no existe o fue movida.
          </p>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn--ghost" onClick={() => nav(-1)}>
              ← Volver
            </button>
            <button className="btn btn--primary" onClick={() => nav("/")}>
              Ir al inicio
            </button>
            <button className="btn btn--ghost" onClick={() => nav("/search")}>
              Buscar
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
