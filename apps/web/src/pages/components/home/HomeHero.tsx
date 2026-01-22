// src/components/home/HomeHero.tsx
import "../../../styles/components/homeBlog/hero.css";

type Props = {
  onExplore: () => void;
  onAbout: () => void;
};

function IconChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomeHero({ onExplore, onAbout }: Props) {
  return (
    <section className="hero">
      <div className="hero-inner">

        <h1 className="hero-title">
          <span className="hero-title__base">Yslid's </span>
          <span className="hero-title__accent">corner</span>
        </h1>

        <p className="hero-sub">
          Donde la <strong className="hero-sub__bold">tecnología</strong> se encuentra con la{" "}
          <strong className="hero-sub__orange">seguridad</strong>, explicado de forma humana.
        </p>

        <div className="hero-actions">
          <button className="btn btn-explore" type="button" onClick={onExplore}>
            Explorar <IconChevronDown />
          </button>
          <button className="btn btn-ghost" type="button" onClick={onAbout}>
            Sobre mí
          </button>
        </div>

        <div className="hero-scroll" aria-hidden="true">
          <span>Scroll</span>
          <span className="mouse" />
        </div>
      </div>
    </section>
  );
}