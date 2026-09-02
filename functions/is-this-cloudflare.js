export async function onRequest(context) {
  const responseHeaders = new Headers();
  responseHeaders.set("Access-Control-Allow-Origin", "*");
  responseHeaders.set("Cache-Control", "max-age=604800");
  return new Response(null, {
    status: 204,
  });
}
