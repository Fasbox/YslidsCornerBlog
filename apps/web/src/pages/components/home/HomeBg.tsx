// src/pages/components/home/HomeBg.tsx
export default function HomeBg() {
  return (
    <div className="home-bg" aria-hidden="true">
      <span className="home-blob home-blob--a" />
      <span className="home-blob home-blob--b" />
      <span className="home-blob home-blob--c" />
      <span className="home-blob home-blob--d" />
      <span className="home-gridlines" />

      {/* ✅ breathing floats (circles) */}
      <span className="bg-float bg-circle bg-a" />
      <span className="bg-float bg-circle bg-b" />
      <span className="bg-float bg-circle bg-c" />

      {/* ✅ breathing floats (orange squares) */}
      <span className="bg-float bg-square-orange bg-d" />
      <span className="bg-float bg-square-orange bg-e" />
      <span className="bg-float bg-square-orange bg-f" />
    </div>
  );
}
