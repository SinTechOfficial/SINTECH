import { renderToString } from "react-dom/server";
import App from "./App";
export { publicRouteSeo, getSiteOrigin } from "./data/routeManifest";
export { site } from "./data/site";

export function renderRoute(path: string): string {
  return renderToString(<App ssrPath={path} />);
}
