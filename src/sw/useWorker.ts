import { useEffect, useState } from "react";
import { register } from "register-service-worker";

export function useWorker(script: string) {
  const [state, setState] = useState<{
    loaded: boolean;
    registration: ServiceWorkerRegistration | null;
    error: Error | null;
  }>({
    loaded: false,
    registration: null,
    error: null,
  });
  useEffect(() => {
    const abortController = new AbortController();
    const startWorker = async () => {
      register(script, {
        registrationOptions: {},
        ready(registration) {
          console.log("Service worker is active.");
        },
        registered(registration) {
          console.log("Service worker has been registered.");
          if (!abortController.signal.aborted) {
            setState((state) => ({ ...state, loaded: true, registration }));
          }
        },
        cached(registration) {
          console.log("Content has been cached for offline use.");
        },
        updatefound(registration) {
          console.log("New content is downloading.");
        },
        updated(registration) {
          console.log("New content is available; please refresh.");
        },
        offline() {
          console.log(
            "No internet connection found. App is running in offline mode."
          );
        },
        error(error) {
          console.error("Error during service worker registration:", error);
          if (!abortController.signal.aborted) {
            setState((state) => ({ ...state, error }));
          }
        },
      });
    };
    startWorker();
    return function cleanup() {
      abortController.abort();
    };
  }, [script]);
  return state;
}
