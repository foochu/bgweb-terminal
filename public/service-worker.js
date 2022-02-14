const WASM = "gbweb.1.wasm";

self.importScripts("wasm_exec.js");

const go = new Go();

let wasmPromise = (async function loadWasm() {
  const response = await fetch(WASM);
  if (!response.ok) {
    throw new Error(`Failed to fetch wasm ${WASM}.`);
  }
  const { instance } = await WebAssembly.instantiateStreaming(
    response,
    go.importObject
  );
  go.run(instance);
})();

self.addEventListener("install", function (event) {
  self.skipWaiting();
  event.waitUntil(wasmPromise);
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

  if (request.method === "POST" && url.pathname.match(/\/api\/v1\/getmoves/)) {
    event.waitUntil(wasmPromise);
    return event.respondWith(
      new Promise(async function (resolve) {
        let tries = 0;
        while (!wasm_get_moves) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          if (tries++ > 10) {
            break;
          }
        }
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
