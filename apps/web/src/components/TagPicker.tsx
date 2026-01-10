import { useMemo, useState } from "react";
import type { Tag } from "../features/tags/tags.api";

export default function TagPicker(props: {
  tags: Tag[];
  value: string[];
  onChange: (ids: string[]) => void;
  max?: number;
}) {
  const { tags, value, onChange, max = 3 } = props;
  const [q, setQ] = useState("");

  const selected = useMemo(() => new Set(value), [value]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return tags;
    return tags.filter((t) => {
      const name = (t as any).name ?? "";
      const slug = (t as any).slug ?? "";
      return (
        String(name).toLowerCase().includes(qq) ||
        String(slug).toLowerCase().includes(qq)
      );
    });
  }, [tags, q]);

  const toggle = (id: string) => {
    const isOn = selected.has(id);

    if (isOn) {
      onChange(value.filter((x) => x !== id));
      return;
    }

    // si ya llegó al máximo, no permitir más
    if (value.length >= max) return;

    onChange([...value, id]);
  };

  return (
    <div className="tagPicker">
      <div className="tagPicker__top">
        <div>
          <div className="tagPicker__label">Tags</div>
          <div className="tagPicker__hint">Máximo {max}</div>
        </div>

        <div className="tagPicker__count">
          {value.length}/{max}
        </div>
      </div>

      <input
        className="fieldControl"
        placeholder="Buscar tag…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="tagPicker__chips">
        {filtered.map((t: any) => {
          const id = String(t.id);
          const isOn = selected.has(id);
          const isLocked = !isOn && value.length >= max;

          return (
            <button
              key={id}
              type="button"
              className={
                isOn
                  ? "tagChip tagChip--on"
                  : isLocked
                  ? "tagChip tagChip--off tagChip--locked"
                  : "tagChip tagChip--off"
              }
              onClick={() => toggle(id)}
              disabled={isLocked}
              title={t.slug ? String(t.slug) : ""}
            >
              {t.name}
              {t.section ? (
                <span className="tagChip__meta">{String(t.section)}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
