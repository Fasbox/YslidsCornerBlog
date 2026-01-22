// src/pages/HomePage.tsx
import "../styles/components/home.css";

import HomeBg from "./components/home/HomeBg";
import HomeHero from "./components/home/HomeHero";
import HomePaths from "./components/home/HomePaths";
import HomeSocial from "./components/home/HomeSocial";
import HomeBlog from "./components/home/HomeBlog";
import HomeAbout from "./components/home/HomeAbout";

export default function HomePage() {
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="homePage">
      <HomeBg />

      <main className="home">
        <HomeHero
          onExplore={() => scrollToId("explorar")}
          onAbout={() => scrollToId("sobre-mi")}
        />

        <div id="explorar" className="home-anchor" />

        <HomePaths />
        <HomeSocial />
        <HomeBlog />
        <HomeAbout />
      </main>
    </div>
  );
}
