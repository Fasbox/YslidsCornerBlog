// src/components/home/HomeBlog.tsx
import { Link } from "react-router-dom";
import "../../../styles/components/home/blog.css";

type Post = {
  section: "TECH" | "FASEC";
  minutes: string;
  date: string;
  title: string;
  excerpt: string;
  to: string;
};

const FEATURED: Post = {
  section: "TECH",
  minutes: "8 min",
  date: "20 Ene 2026",
  title: "Configurando tu primer servidor Linux desde cero",
  excerpt:
    "Una guía paso a paso para principiantes que quieren adentrarse en el mundo de los servidores.",
  to: "/tech",
};

const LIST: Post[] = [
  {
    section: "FASEC",
    minutes: "5 min",
    date: "",
    title: "¿Tu contraseña es segura? Probablemente no",
    excerpt: "Descubre por qué las contraseñas que crees seguras pueden no serlo.",
    to: "/fasec",
  },
  {
    section: "TECH",
    minutes: "12 min",
    date: "",
    title: "Docker para humanos: contenedores sin dolor",
    excerpt: "Olvídate del “funciona en mi máquina” para siempre.",
    to: "/tech",
  },
  {
    section: "FASEC",
    minutes: "4 min",
    date: "",
    title: "Autenticación de dos factores: tu nuevo mejor amigo",
    excerpt: "Por qué 2FA debería estar en todas tus cuentas importantes.",
    to: "/fasec",
  },
];

function SectionPill({ type }: { type: "TECH" | "FASEC" }) {
  return <span className={`postTag postTag--${type.toLowerCase()}`}>{type}</span>;
}

export default function HomeBlog() {
  return (
    <section className="blog">
      <div className="blogHead">
        <span className="sectionPill">Últimos artículos</span>

        <div className="blogHeadRow">
          <h2 className="blogTitle">
            Lo fresco del <span className="blogTitle__accent">blog</span>
          </h2>

          <Link className="blogAll" to="/search?q=">
            Ver todos los artículos <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="blogGrid">
        <article className="featured">
          <div className="featuredMeta">
            <SectionPill type={FEATURED.section} />
            <span className="dot">•</span>
            <span className="metaText">{FEATURED.minutes}</span>
            <span className="dot">•</span>
            <span className="metaText">{FEATURED.date}</span>
          </div>

          <h3 className="featuredTitle">{FEATURED.title}</h3>
          <p className="featuredExcerpt">{FEATURED.excerpt}</p>

          <Link className="featuredLink" to={FEATURED.to}>
            Leer artículo <span aria-hidden="true">→</span>
          </Link>
        </article>

        <div className="compactCol">
          {LIST.map((p) => (
            <Link key={p.title} to={p.to} className="compact">
              <div className="compactMeta">
                <SectionPill type={p.section} />
                <span className="metaText">{p.minutes}</span>
              </div>
              <h4 className="compactTitle">{p.title}</h4>
              <p className="compactExcerpt">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
