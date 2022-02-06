import { useEffect, useState } from "react";

export function useWasm(
  fileName: string,
  imports: WebAssembly.Imports,
  onLoad: (instance: WebAssembly.Instance) => Promise<void>
) {
  const [state, setState] = useState<{
    loaded: boolean;
    instance: WebAssembly.Instance | null;
    module: WebAssembly.Module | null;
    error: string | null;
  }>({
    loaded: false,
    instance: null,
    module: null,
    error: null,
  });
  useEffect(() => {
    const abortController = new AbortController();
    const fetchWasm = async () => {
      try {
        const wasm = await fetch(fileName, { signal: abortController.signal });
        if (!wasm.ok) {
          throw new Error(`Failed to fetch resource ${fileName}.`);
        }
        const { instance, module } = await WebAssembly.instantiateStreaming(
          wasm,
          imports
        );
        if (!abortController.signal.aborted) {
          setState({ instance, module, loaded: true, error: null });
          await onLoad(instance);
        }
      } catch (e) {
        if (!abortController.signal.aborted) {
          if (e instanceof Error) {
            setState({ ...state, error: e.stack || e.message });
          } else {
            setState({ ...state, error: e as string });
          }
        }
      }
    };
    fetchWasm();
    return function cleanup() {
      abortController.abort();
    };
  }, [fileName, imports]);
  return state;
}
