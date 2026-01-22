// src/components/home/HomePaths.tsx
import { Link } from "react-router-dom";
import "../../../styles/components/home/paths.css";

type TagProps = {
  children: React.ReactNode;
  variant?: "tech" | "fasec";
};

function Tag({ children, variant }: TagProps) {
  return <span className={`tag ${variant ? `tag--${variant}` : ""}`}>{children}</span>;
}

export default function HomePaths() {
  return (
    <section className="paths">
      <div className="sectionHead">
        <span className="sectionPill">Elige tu camino</span>
        <h2 className="sectionTitle">
          Dos mundos, <span className="sectionTitle__accent">una misión</span>
        </h2>
        <p className="sectionSub">
          Explora contenido práctico que necesitas, presentado de forma fácil.
        </p>
      </div>

      <div className="pathsGrid">
        {/* TECH */}
        <Link className="pathCard pathCard--tech" to="/tech" aria-label="Explorar Tech">
          <div className="pathCardTop">
            <span className="badge badge--tech">TECH</span>

            {/* 👇 Aquí vas a poner tus SVGs/íconos (solo desde 768px se verá) */}
            <div className="pathsVisual" aria-hidden="true">
                <span className="pathIcon">
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 8L5 11.6923L9 16M15 8L19 11.6923L15 16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="pathIcon">
                  <svg viewBox="0 0 1024 1024" width="22" height="22" fill="currentColor">
                    <path d="M764.416 254.72a351.68 351.68 0 0 1 86.336 149.184H960v192.064H850.752a351.68 351.68 0 0 1-86.336 149.312l54.72 94.72-166.272 96-54.592-94.72a352.64 352.64 0 0 1-172.48 0L371.136 936l-166.272-96 54.72-94.72a351.68 351.68 0 0 1-86.336-149.312H64v-192h109.248a351.68 351.68 0 0 1 86.336-149.312L204.8 160l166.208-96 54.656 94.592a352.64 352.64 0 0 1 172.48 0L652.8 64l166.4 96-54.784 94.72zM704 500a192 192 0 1 0-384 0 192 192 0 0 0 384 0z"/>
                  </svg>
                </span>
            </div>
          </div>

          <h3 className="pathTitle">
            Tecnología <span className="pathTitle__accentTech">sin límites</span>
          </h3>

          <p className="pathDesc">
            Redes, desarrollo, herramientas y productividad. Todo proyecto raro que encuentre
            y crea útil.
          </p>

          {/* 👇 En móvil se ocultan o se reducen a 2 (CSS) */}
          <div className="tagRow">
            <Tag variant="tech">Redes</Tag>
            <Tag variant="tech">Linux</Tag>
            <Tag variant="tech">Tecnología</Tag>
            <Tag variant="tech">Scripting</Tag>
            <Tag variant="tech">Tools</Tag>
          </div>

          <div className="pathLink pathLink--tech">
            Explorar TECH <span aria-hidden="true">→</span>
          </div>
        </Link>

        {/* FASEC */}
        <Link className="pathCard pathCard--fasec" to="/fasec" aria-label="Explorar FASEC">
          <div className="pathCardTop">
            <span className="badge badge--fasec">FASEC</span>

            <div className="pathsVisual" aria-hidden="true">
              <span className="pathIcon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                    <path
                      d="M12 9V12M12 15H12.01M20 12C20 16.46 14.54 19.69 12.64 20.68
                        C12.44 20.79 12.33 20.84 12.19 20.87
                        C12.08 20.89 11.92 20.89 11.81 20.87
                        C11.67 20.84 11.56 20.79 11.36 20.68
                        C9.46 19.69 4 16.46 4 12V8.22
                        C4 7.42 4 7.02 4.13 6.67
                        C4.25 6.37 4.43 6.1 4.68 5.89
                        C4.95 5.64 5.33 5.5 6.08 5.22
                        L11.44 3.21C11.65 3.13 11.75 3.09 11.86 3.08
                        C11.95 3.06 12.05 3.06 12.14 3.08
                        C12.25 3.09 12.35 3.13 12.56 3.21
                        L17.92 5.22"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
              </span>
              <span className="pathIcon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                  <path
                    d="M22 12C22 15.77 22 17.66 20.83 18.83
                      C19.66 20 17.77 20 14 20H10
                      C6.23 20 4.34 20 3.17 18.83
                      C2 17.66 2 15.77 2 12
                      C2 8.23 2 6.34 3.17 5.17
                      C4.34 4 6.23 4 10 4H14
                      C17.77 4 19.66 4 20.83 5.17"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <circle cx="8" cy="12" r="1" fill="currentColor" />
                  <circle cx="12" cy="12" r="1" fill="currentColor" />
                  <circle cx="16" cy="12" r="1" fill="currentColor" />
                </svg>
              </span>
            </div>
          </div>

          <h3 className="pathTitle">
            Ciberseguridad <span className="pathTitle__accentFasec">fácil</span>
          </h3>

          <p className="pathDesc">
            Seguridad explicada de forma humana. Protege tu vida digital sin ser un experto.
          </p>

          <div className="tagRow">
            <Tag variant="fasec">Privacidad</Tag>
            <Tag variant="fasec">Passwords</Tag>
            <Tag variant="fasec">Phishing</Tag>
            <Tag variant="fasec">Tips</Tag>
            <Tag variant="fasec">Noticias</Tag>
          </div>

          <div className="pathLink pathLink--fasec">
            Explorar FASEC <span aria-hidden="true">→</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
