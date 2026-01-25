// src/components/home/HomeAbout.tsx
import "../../../styles/components/home/about.css";

export default function HomeAbout() {
  return (
    <section className="about" id="sobre-mi">
      <div className="aboutGrid">
        {/* LEFT: FOTO */}
        <div className="aboutPhotoWrap">
          <div className="aboutPill aboutPill--top">🔒 Security</div>

          <div className="aboutPhoto">
            {/* Foto */}
            <img
              src="/tu-foto.png"
              alt="Foto de Yslid"
              className="aboutPhotoImg"
            />
          </div>

          <div className="aboutPill aboutPill--left">🤖 Tech</div>
          <div className="aboutPill aboutPill--right">🛡️ Seguridad</div>
        </div>

        {/* RIGHT: TEXTO */}
        <div className="aboutBody">
          <span className="sectionPill">Sobre mí</span>

          <h2 className="aboutTitle">
            Hola, soy <span className="aboutTitle__accent">Yslid</span>
          </h2>

          <p className="aboutText">
            Apasionado por la tecnología y la ciberseguridad. Este es mi rincón digital donde
            comparto todo lo que aprendo en mi camino.
          </p>

          <p className="aboutText">
            Creo firmemente que la seguridad digital debería ser accesible para todos, no solo para
            expertos. Por eso creé <strong className="aboutFasec">FASEC</strong>: ciberseguridad
            fácil y humana.
          </p>

          <div className="aboutLine">
            <span className="aboutHeart">♡</span>
            <span>Una mente curiosa navegando el caos de la tecnología.</span>
          </div>

          <div className="aboutLinks">
            <a className="aboutLink" href="https://github.com/Fasbox/YslidsCornerBlog" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="aboutLink" href="https://www.instagram.com/itsfasec/" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a className="aboutLink" href="https://www.linkedin.com/in/fabian-chavarria/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="aboutLink" href="YslidsMail@proton.me" target="_blank" rel="noreferrer">
              Email
            </a>
          </div>
        </div>

        {/* QUOTE centrado abajo del todo */}
        <div className="aboutQuote" aria-label="Cita">
          <span className="quoteMark quoteMark--l">“</span>
          <p>La mejor seguridad es la que se entiende y se usa.</p>
          <span className="quoteMark quoteMark--r">”</span>
        </div>
      </div>
    </section>
  );
}
