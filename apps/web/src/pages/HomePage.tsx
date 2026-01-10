export default function HomePage() {
  return (
    <main className="home">
      <div className="home-grid">
        <section className="home-hero">
          <p className="home-kicker">YSLID’S CORNER</p>

          <h1 className="home-title">
            Una mente curiosa navegando el caos de la tecnología
          </h1>

          <p className="home-subtitle">
            Este es mi camino por la ciberseguridad, la automatización, las redes y
            todo lo relacionado con la tecnología. A veces, las cosas no funcionan a
            la primera (o a la décima), pero supongo que esa es la parte divertida.
          </p>
        </section>

        <section className="home-gates">
          <a className="gate gate-tech" href="/tech">
            <span className="gate-badge">TECH</span>
            <h2>Tech</h2>
            <p>Redes, desarrollo, herramientas y productividad.</p>
            <span className="gate-cta">Entrar →</span>
          </a>

          <a className="gate gate-fasec" href="/fasec">
            <span className="gate-badge">FASEC</span>
            <h2>FASEC</h2>
            <p>Ciberseguridad para todos: fácil, divertida y humana.</p>
            <span className="gate-cta">Entrar →</span>
          </a>
        </section>
      </div>
    </main>
  );
}
