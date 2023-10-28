import {createRoot} from "react-dom/client";
import Root from "./root";
import makeServer from "./test-utils/server/index";

makeServer();

if (process.env.NODE_ENV === "development" && !(window as any).Cypress) {
  const {worker} = require("./test-utils/server/msw-browser");
  worker.start();
}

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<Root />);
