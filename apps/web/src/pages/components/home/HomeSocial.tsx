// src/components/home/HomeSocial.tsx
import "../../../styles/components/home/social.css";

type SocialPost = {
  platform: "Instagram" | "TikTok";
  handle: string;
  title: string;
  desc: string;
  likes: string;
  gradient: "ig1" | "tt1" | "ig2";
};

const POSTS: SocialPost[] = [
  {
    platform: "Instagram",
    handle: "@fasec",
    title: "¿Qué es el Phishing?",
    desc: "Aprende a identificar correos fraudulentos",
    likes: "Deja tu like",
    gradient: "ig1",
  },
  {
    platform: "TikTok",
    handle: "@fasec",
    title: "5 Tips de Contraseñas",
    desc: "Protege tus cuentas en 60 segundos",
    likes: "Comenta",
    gradient: "tt1",
  },
  {
    platform: "Instagram",
    handle: "@fasec",
    title: "VPN: ¿Sí o No?",
    desc: "Cuándo realmente la necesitas",
    likes: "Comparte",
    gradient: "ig2",
  },
];

export default function HomeSocial() {
  return (
    <section className="social">
      <div className="socialHead">
        <span className="sectionPill sectionPill--fasec">🟠 FASEC en redes</span>

        <div className="socialText">
          <h2 className="socialTitle">
            Contenido que <span className="socialTitle__accent">protege</span>
          </h2>

          <p className="socialSub">
            Ciberseguridad en video. Síguenos para tips útiles.
          </p>
        </div>

        <div className="socialActions">
          <a className="socialBtn socialBtn--ig" href="#" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className="socialBtn socialBtn--tt" href="#" target="_blank" rel="noreferrer">
            TikTok
          </a>
        </div>
      </div>

      <div className="socialGrid">
        {POSTS.map((p) => (
          <article key={p.title} className="post">
            <div className={`postTop postTop--${p.gradient}`}>
              <span className="postPill">{p.platform}</span>
              <span className="postHandle">{p.handle}</span>
            </div>

            <div className="postBody">
              <h3 className="postTitle">{p.title}</h3>
              <p className="postDesc">{p.desc}</p>

              <div className="postMeta">
                <span className="postHeart">❤💭🔃</span>
                <span>{p.likes}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
