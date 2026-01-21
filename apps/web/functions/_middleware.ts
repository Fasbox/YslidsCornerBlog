// functions/_middleware.ts

type ApiPostDetail = {
  title?: string | null;
  excerpt?: string | null;
  cover_image_url?: string | null;
};

export const onRequest: PagesFunction = async (ctx) => {
  const { request, next } = ctx;
  const url = new URL(request.url);

  const ua = request.headers.get("user-agent") ?? "";
  const forceOg =
  url.searchParams.get("og") === "1" &&
  (url.hostname === "localhost" || url.hostname.endsWith("pages.dev"));
  const isBot = /whatsapp|facebookexternalhit|facebot|twitterbot|telegrambot|discordbot|slackbot/i.test(
    ua
  );

  if (!isBot && !forceOg) return next();

  // /fasec/post/:slug  o  /tech/post/:slug
  const m = url.pathname.match(/^\/(fasec|tech)\/post\/([^/]+)\/?$/i);
  if (!m) return next();

  const section = m[1].toUpperCase() === "FASEC" ? "FASEC" : "TECH";
  const slug = m[2];

  const apiUrl = `https://api.yslidscorner.com/posts/${section}/${encodeURIComponent(slug)}`;

  try {
    const r = await fetch(apiUrl, { headers: { Accept: "application/json" } });
    if (!r.ok) return next();

    const post = (await r.json()) as ApiPostDetail;

    const title = String(post.title ?? "Yslid’s Corner");
    const descRaw = String(post.excerpt ?? "");
    const description = descRaw.replace(/\s+/g, " ").trim().slice(0, 200);

    const ogImage =
      (post.cover_image_url && String(post.cover_image_url)) ||
      "https://www.yslidscorner.com/og-default.png";

    const canonical = `https://www.yslidscorner.com/${section.toLowerCase()}/post/${encodeURIComponent(
      slug
    )}`;

    const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(title)}</title>

    <link rel="canonical" href="${canonical}" />

    <meta name="description" content="${escapeHtml(description)}" />

    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Yslid’s Corner" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${escapeHtml(ogImage)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(ogImage)}" />

    <meta http-equiv="refresh" content="0;url=${canonical}" />
  </head>
  <body></body>
</html>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch {
    return next();
  }
};

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
