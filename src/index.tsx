import {createRoot} from "react-dom/client";
import Root from "./Root";
import makeServer from "./server/index";

makeServer();

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<Root />);
