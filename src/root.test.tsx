import {createRoot} from "react-dom/client";
import Root from "./root";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(<Root />);
  root.unmount();
});
