import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";
import store from "./Setup/store";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Root store={store} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
