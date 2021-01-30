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
        // @ts-expect-error ts-migrate(7052) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        this[method](
          "http://francken.nl.localhost/*",
          async (schema: any, request: any) => {
            let [status, headers, body] = await (window as any).handleFromCypress(
              request
            );
            return new Response(status, headers, body);
          }
        );
        // @ts-expect-error ts-migrate(7052) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        this[method](
          "https://borrelcie.vodka/present/data.php",
          async (schema: any, request: any) => {
            let [status, headers, body] = await (window as any).handleFromCypress(
              request
            );
            return new Response(status, headers, body);
          }
        );
        // @ts-expect-error ts-migrate(7052) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        this[method]("/*", async (schema: any, request: any) => {
          let [status, headers, body] = await (window as any).handleFromCypress(request);
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

const makeEnvironmentSpecificServer = () => {
  if ((window as any).Cypress) {
    return makeCypressServer();
  }

  if (process.env.NODE_ENV === "development") {
    return makeDevServer();
  }

  return null;
};

export default makeEnvironmentSpecificServer;
