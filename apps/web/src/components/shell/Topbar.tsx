import { Link, NavLink } from "react-router-dom";
import { useMediaQuery } from "../../hooks/useMediaQuery";

function cnNav(isActive: boolean) {
  return ["nav__link", isActive ? "nav__link--active" : ""].join(" ");
}

type Props = {
  open: boolean;
  onOpen: () => void;
  toggleBtnRef: React.RefObject<HTMLButtonElement>;
};

export default function Topbar({ open, onOpen, toggleBtnRef }: Props) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="topbarWrap">
      <header className="topbar">
        <div className="topbar__inner">
          {/* Left: toggle (solo en no-desktop) */}
          {!isDesktop ? (
            <button
              ref={toggleBtnRef}
              type="button"
              className="nav__toggle"
              aria-label="Abrir menú"
              aria-expanded={open}
              aria-controls="mobile-drawer"
              onClick={onOpen}
            >
              <span className="nav__toggleIcon">≡</span>
            </button>
          ) : (
            <div aria-hidden="true" />
          )}

          {/* Brand */}
          <Link to="/" className="brand brand--center" aria-label="Ir al inicio">
            <span className="brand__text">
              <span className="brand__title">yslid’s corner</span>
            </span>
          </Link>

          {/* Right: spacer en mobile para centrar */}
          {!isDesktop ? <div className="topbar__spacer" aria-hidden="true" /> : null}

          {/* Desktop only */}
          {isDesktop ? (
            <div className="topbar__right" aria-label="Navegación escritorio">
              <nav className="nav nav--desktop" aria-label="Navegación principal">
                <NavLink to="/tech" className={({ isActive }) => cnNav(isActive)}>
                  Tech
                </NavLink>
                <NavLink to="/fasec" className={({ isActive }) => cnNav(isActive)}>
                  FASEC
                </NavLink>
              </nav>

              <Link to="/search?q=" className="nav__cta" aria-label="Buscar">
                <span className="nav__ctaIcon" aria-hidden="true">⌕</span>
                <span className="nav__ctaText">Buscar</span>
              </Link>
            </div>
          ) : null}
        </div>
      </header>
    </div>
  );
}
