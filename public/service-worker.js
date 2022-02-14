const WASM = "gbweb.1.wasm";

self.importScripts("wasm_exec.js");

const go = new Go();

let wasmLoaded = (async function loadWasm() {
  const response = await fetch(WASM);
  if (!response.ok) {
    throw new Error(`Failed to fetch wasm ${WASM}.`);
  }
  const { instance } = await WebAssembly.instantiateStreaming(
    response,
    go.importObject
  );

  // this wasm runs "forever" so can't await
  go.run(instance);

  // instead, wait until wasm registers global function "wasm_get_moves"
  let tries = 0;
  while (!wasm_get_moves) {
    const WAIT = 300;
    await new Promise((resolve) => setTimeout(resolve, WAIT));
    if (tries++ > 10000 / WAIT) {
      break;
    }
  }
})();

self.addEventListener("install", function (event) {
  self.skipWaiting();
  event.waitUntil(wasmLoaded);
});

self.addEventListener("activate", function (event) {
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  const { request } = event;

  let url;

  try {
    url = new URL(request.url);
  } catch (e) {
    // ignore any non-url request
    return;
  }

  if (url.origin !== location.origin) {
    // ignore cross origin
    return;
  }

  // only ever care about /api/*
  if (!url.pathname.match(/^\/api\/.*/)) {
    return;
  }

  console.log(
    "service worker intercepted API request",
    request.method,
    url.pathname
  );

  if (request.method === "GET" && url.pathname.match(/\/api\/v1\/ping/)) {
    return event.respondWith(
      new Promise(async function (resolve) {
        await wasmLoaded;
        resolve(
          new Response("ok", {
            headers: { "Content-Type": "text/plain" },
          })
        );
      })
    );
  }

  if (request.method === "POST" && url.pathname.match(/\/api\/v1\/getmoves/)) {
    return event.respondWith(
      new Promise(async function (resolve) {
        await wasmLoaded;
        const body = await request.text();
        resolve(
          new Response(wasm_get_moves(body), {
            headers: { "Content-Type": "application/json" },
          })
        );
      })
    );
  }

  return event.respondWith(new Response(null, { status: 404 }));
});
