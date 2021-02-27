import React from "react";
import {render} from "react-dom";
import registerServiceWorker from "./Setup/registerServiceWorker";
import Root from "./Root";
import makeServer from "./server/index";

makeServer();

render(<Root />, document.getElementById("root"));

registerServiceWorker();
