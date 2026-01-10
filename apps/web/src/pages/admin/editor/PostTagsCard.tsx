import Card from "../../../components/Card";
import TagPicker from "../../../components/TagPicker";
import type { Tag } from "../../../features/tags/tags.api";

export default function PostTagsCard(props: {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  tags: Tag[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const { isLoading, isError, error, tags, value, onChange } = props;

  return (
    <Card>
      <div className="card-pad">
        {isLoading ? (
          <p className="helpText">Cargando tags…</p>
        ) : isError ? (
          <p className="helpText">Error cargando tags: {error?.message ?? "desconocido"}</p>
        ) : (
          <TagPicker tags={tags} value={value} onChange={onChange} max={3} />
        )}
      </div>
    </Card>
  );
}
