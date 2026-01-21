export const onRequest: PagesFunction = async () => {
  return new Response("pong", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
