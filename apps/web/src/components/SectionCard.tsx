import { Link } from "react-router-dom";

export default function SectionCard(props: {
  title: string;
  description: string;
  to: string;
  badge: string;
  kicker?: string;
}) {
  return (
    <Link
      to={props.to}
      className="group block rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-7 shadow-[0_10px_30px_var(--shadow)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-[color:var(--cardHover)]"
    >
      {props.kicker ? (
        <p className="mb-2 text-xs font-semibold tracking-wider text-[color:var(--textSoft)] opacity-90">
          {props.kicker}
        </p>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <h2 className="text-2xl font-extrabold tracking-tight">{props.title}</h2>
        <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--accentSoft)] px-3 py-1 text-xs font-semibold text-[color:var(--text)]">
          {props.badge}
        </span>
      </div>

      <p className="mt-3 text-[color:var(--textSoft)]">{props.description}</p>

      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[color:var(--accent)]">
        <span>Entrar</span>
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </div>
    </Link>
  );
}
