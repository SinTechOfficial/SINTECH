import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import App from "./App";
export {
  publicRouteSeo,
  getSiteOrigin,
  assertPublishableContent,
} from "./data/routeManifest";
export { site } from "./data/site";

export function renderRoute(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    const chunks: string[] = [];
    let settled = false;
    let abortRender: () => void = () => {};
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      abortRender();
      reject(new Error(`Timed out prerendering ${path}.`));
    }, 15_000);

    output.setEncoding("utf8");
    output.on("data", (chunk: string) => chunks.push(chunk));
    output.on("end", () => {
      clearTimeout(timeout);
      if (settled) return;
      settled = true;
      resolve(chunks.join(""));
    });
    output.on("error", (error: Error) => {
      clearTimeout(timeout);
      if (settled) return;
      settled = true;
      reject(error);
    });

    const stream = renderToPipeableStream(<App ssrPath={path} />, {
      onAllReady() {
        stream.pipe(output);
      },
      onShellError(error) {
        clearTimeout(timeout);
        if (settled) return;
        settled = true;
        reject(error);
      },
      onError(error) {
        clearTimeout(timeout);
        if (settled) return;
        settled = true;
        reject(error);
      },
    });
    abortRender = () => stream.abort();
  });
}
