import React from 'react';
import { render } from 'react-dom';
import registerServiceWorker from './Setup/registerServiceWorker';
import Root from './Root';
import store from './Setup/store';
import { makeServer } from './server';
import { Server, Response } from 'miragejs';

if (window.Cypress) {
  let cyServer = new Server({
    logging: true,
    urlPrefix: 'http:francken.nl.localhost/',
    namespace: 'api/plus-one',
    environment: 'testing',

    routes() {
      let methods = ['get', 'put', 'patch', 'post', 'delete'];
      methods.forEach(method => {
        this[method](
          'http://francken.nl.localhost/*',
          async (schema, request) => {
            console.log('requesting arbitrary to cypress');

            let [status, headers, body] = await window.handleFromCypress(
              request
            );
            return new Response(status, headers, body);
          }
        );
        this[method]('/*', async (schema, request) => {
          console.log('requesting to cypress');

          let [status, headers, body] = await window.handleFromCypress(request);
          return new Response(status, headers, body);
        });
      });
    }
  });
  cyServer.logging = false;
} else if (process.env.NODE_ENV === 'development') {
  let server = makeServer();
  server.logging = true;
}

render(<Root store={store} />, document.getElementById('root'));

registerServiceWorker();
