import React from "react";
import {createRoot} from "react-dom/client";
import ReactDOM from "react-dom";
import Root from "./Root";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(<Root />);
  root.unmount();
});
