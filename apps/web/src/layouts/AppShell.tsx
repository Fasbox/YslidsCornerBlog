import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import Container from "../components/Container";

import Topbar from "../components/shell/Topbar";
import Drawer from "../components/shell/Drawer";

export default function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isFasec = pathname.startsWith("/fasec");
  const sectionLabel = useMemo(() => (isFasec ? "FASEC" : "Tech"), [isFasec]);

  const [open, setOpen] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => toggleBtnRef.current?.focus());
  };

  // cerrar drawer al navegar
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ESC para cerrar
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // lock scroll cuando drawer está abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="shell">
      {/* Topbar */}
      <div className="topbarWrap">
        <Container>
          <Topbar
            open={open}
            onOpen={() => setOpen(true)}
            toggleBtnRef={toggleBtnRef as any}
          />
        </Container>
      </div>

      {/* Drawer (mobile/tablet) */}
      <Drawer open={open} onClose={close} pathname={pathname} sectionLabel={sectionLabel} />

      {/* Main */}
      <main className="shell__main">
        <Container>{children}</Container>
      </main>

      {/* Footer */}
      <footer className="footer">
        <Container>
          <div className="footer__inner">
            <p className="footer__text">
              © {new Date().getFullYear()} — Crónicas de una mente curiosa.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
