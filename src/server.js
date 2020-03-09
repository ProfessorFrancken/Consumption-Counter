// src/server.js
import { Server, Response, Model } from 'miragejs';

export function makeServer({ environment = 'development' } = {}) {
  let server = new Server({
    logging: true,
    urlPrefix: 'http://francken.nl.localhost/',
    namespace: 'api/plus-one',
    environment,
    // models: {
    //   user: Model
    // },
    // seeds(server) {
    //   server.create('user', { name: 'Bob' });
    //   server.create('user', { name: 'Alice' });
    // },
    routes() {
      // this.logging = true;

      // let methods = ['get', 'put', 'patch', 'post', 'delete'];
      // methods.forEach(method => {
      //   this[method](
      //     'http://francken.nl.localhost/*',
      //     async (schema, request) => {
      //       console.info('[HOI] Handling a arbitrary request');
      //       return [];
      //     }
      //   );
      // });

      const token =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjI1OTE3MDIsImV4cCI6MTU1NDEyNzcwMiwicGx1cy1vbmUiOnRydWV9._KlpRSqK7AHgYX4WybMPJlTazuoU4OY1KoEyQtkiTd4';

      this.post('authenticate', (schema, request) => {
        const { password } = JSON.parse(request.requestBody);

        if (password === 'bitterballen') {
          return new Response(
            200,
            { 'content-type': 'application/json' },
            { token }
          );
          return { token };
        }
        return new Response(401, {}, { error: 'unauthorized' });
      });

      this.get('https://buixieval.nl/api/backers', schema => {
        const members = [
          {
            id: 1,
            name: 'John',
            contributed: '33.33',
            team: 'p',
            img: '1.jpeg',
            f_id: '314'
          }
        ];
        return members;
      });

      // moxios.stubRequest(`${base_api}/authenticate`, {
      //   response: { token },
      //   headers: { 'content-type': 'application/json' }
      // });

      // this.useDefaultPassthroughs = true;
    }
  });

  server.logging = true;

  return server;
}
