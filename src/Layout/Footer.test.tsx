import React from "react";
import ReactDOM from "react-dom";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {MemoryRouter} from "react-router-dom";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {Provider} from "react-redux";
import Footer from "./Footer";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'redu... Remove this comment to see the full error message
import configureMockStore from "redux-mock-store";

it("renders without crashing", () => {
  const mockStore = configureMockStore();
  const store = mockStore({queuedOrder: null, order: {products: []}});

  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
