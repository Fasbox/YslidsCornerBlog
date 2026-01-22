export default function HomeBg() {
  return (
    <div className="home-bg" aria-hidden="true">
      <span className="home-blob home-blob--a" />
      <span className="home-blob home-blob--b" />
      <span className="home-blob home-blob--c" />
      <span className="home-gridlines" />

      {/* 👇 breathing floats */}
      <span className="bg-float bg-circle bg-a" />
      <span className="bg-float bg-circle bg-b" />
      <span className="bg-float bg-square bg-c" />
    </div>
  );
}
