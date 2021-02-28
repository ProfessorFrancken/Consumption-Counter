import React from "react";
import {render} from "react-dom";
import Root from "./Root";
import makeServer from "./server/index";

makeServer();

render(<Root />, document.getElementById("root"));
