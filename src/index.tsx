import React from "react";
import {render} from "react-dom";
import registerServiceWorker from "./Setup/registerServiceWorker";
import Root from "./Root";
import store from "./Setup/store";
import makeServer from "./server";

makeServer();

render(<Root store={store} />, document.getElementById("root"));

registerServiceWorker();
