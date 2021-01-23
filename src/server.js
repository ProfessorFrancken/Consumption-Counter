import {makeServer} from "./server/";
import {Server, Response} from "miragejs";

const makeCypressServer = () => {
  let cyServer = new Server({
    logging: true,
    urlPrefix: "http:francken.nl.localhost/",
    namespace: "api/plus-one",
    environment: "testing",

    routes() {
      let methods = ["get", "put", "patch", "post", "delete"];
      methods.forEach((method) => {
        this[method]("http://francken.nl.localhost/*", async (schema, request) => {
          let [status, headers, body] = await window.handleFromCypress(request);
          return new Response(status, headers, body);
        });
        this[method](
          "https://borrelcie.vodka/present/data.php",
          async (schema, request) => {
            let [status, headers, body] = await window.handleFromCypress(request);
            return new Response(status, headers, body);
          }
        );
        this[method]("/*", async (schema, request) => {
          let [status, headers, body] = await window.handleFromCypress(request);
          return new Response(status, headers, body);
        });
      });
    },
  });
  cyServer.logging = false;
  return cyServer;
};

const makeDevServer = () => {
  let server = makeServer();
  server.logging = true;
  return server;
};

export default () => {
  return window.Cypress
    ? makeCypressServer()
    : process.env.NODE_ENV === "development"
    ? makeDevServer()
    : null;
};
