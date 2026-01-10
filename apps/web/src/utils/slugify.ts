export function slugify(input: string): string {
  return input
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-") // todo lo no alfanumérico -> guion
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
