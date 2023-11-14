import {createRoot} from "react-dom/client";
import {ENVIRONMENT} from "./configuration";
import Root from "./root";

if (ENVIRONMENT && !(window as any).Cypress) {
  import("./test-utils/server/msw-browser").then(({worker}) => {
    worker.start();
  });
}

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<Root />);
