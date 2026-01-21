import { Link, NavLink } from "react-router-dom";
import InlineSearch from "./InlineSearch";

function cnNav(isActive: boolean) {
  return ["nav__link", isActive ? "nav__link--active" : ""].join(" ");
}

type Props = {
  open: boolean;
  onClose: () => void;
  pathname: string;
  sectionLabel: string; // "Tech" | "FASEC"
};

export default function Drawer({ open, onClose, pathname, sectionLabel }: Props) {
  return (
    <div id="mobile-drawer" className="drawer" data-open={open ? "true" : "false"}>
      <div className="drawer__overlay" onClick={onClose} />

      <aside
        className="drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        <div className="drawer__header drawer__header--brand">
          <Link to="/" className="drawer__brand" onClick={onClose}>
            <span className="drawer__brandTitle">yslid’s corner</span>
          </Link>

          <button
            type="button"
            className="drawer__close"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            ×
          </button>
        </div>

        <div className="drawer__body">
          <div className="drawer__searchWrap">
            <InlineSearch
              placeholder="Buscar…"
              onPick={onClose} // al elegir resultado cierra el drawer
            />
          </div>

          <nav className="drawer__links" aria-label="Navegación">
            <NavLink to="/tech" className={({ isActive }) => cnNav(isActive)} onClick={onClose}>
              Tech
            </NavLink>
            <NavLink
              to="/fasec"
              className={({ isActive }) => cnNav(isActive)}
              onClick={onClose}
            >
              FASEC
            </NavLink>
          </nav>

          <div className="drawer__section">
            <p className="drawer__sectionLabel">SECCIÓN ACTUAL</p>
            <p className="drawer__sectionValue">
              {pathname === "/" ? "Home" : sectionLabel}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
