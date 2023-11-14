import {createRoot} from "react-dom/client";
import {ENVIRONMENT} from "./configuration";
import Root from "./root";

async function initialize() {
  if (ENVIRONMENT && !(window as any).Cypress) {
    const {worker} = await import("./test-utils/server/msw-browser");
    await worker.start();
  }
}

initialize().then(() => {
  const container = document.getElementById("root");
  const root = createRoot(container!);
  root.render(<Root />);
});
