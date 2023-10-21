import {Server, Response, Model, belongsTo, hasMany} from "miragejs";
import {MemberFactory} from "./members";
import {ProductFactory} from "./products";
import {CommitteeFactory, CommitteeMemberFactory} from "./committees";
import {BoardFactory, BoardMemberFactory} from "./boards";
import {CategoryFactory, ActivityFactory, seedStatistics} from "./statistics";
import {token} from "./authentication";

export function makeServer({environment = "development"} = {}) {
  let server = new Server({
    urlPrefix: "http://francken.nl.localhost/",
    namespace: "api/plus-one",
    environment,
    models: {
      member: Model,
      product: Model,
      committee: Model.extend({
        committeeMembers: hasMany(),
      }),
      committeeMember: Model.extend({
        member: belongsTo(),
        committee: belongsTo(),
      }),
      board: Model.extend({
        boardMembers: hasMany(),
      }),
      boardMember: Model.extend({
        member: belongsTo(),
        board: belongsTo(),
      }),
      categories: Model,
      statistics: Model,
    },
    factories: {
      member: MemberFactory,
      product: ProductFactory,
      committee: CommitteeFactory,
      committeeMember: CommitteeMemberFactory,
      board: BoardFactory,
      boardMember: BoardMemberFactory,
      category: CategoryFactory,
      activity: ActivityFactory,
    },
    seeds(server) {
      server.create("member", {
        latest_purchase_at: "2020-03-08 22:05:49",
        button_height: 0,
        button_width: 0,
        bijnaam: "",
        afbeelding:
          "https://old.professorfrancken.nl/database/streep/afbeeldingen/xtCWQ7vaLKJdSndU1hlv.jpg",
        kleur: "",
        prominent: null,
        geboortedatum: "1993-04-26",
        achternaam: "Redeman",
        tussenvoegsel: "",
        initialen: "M.S.",
        voornaam: "Mark",
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'string | ... Remove this comment to see the full error message
        id: 1403,
      });
      server.createList("member", 800);
      server.createList("product", 30);
      server.createList("committeeMember", 100);
      server.createList("boardMember", 100);
      seedStatistics(server);
    },
    routes() {
      this.post("authenticate", (_, request) => {
        const {password} = JSON.parse(request.requestBody);
        if (password !== "bitterballen") {
          return new Response(401, {}, {error: "unauthorized"});
        }
        return {token};
      });
      this.get("members", (schema) => {
        const {models} = (schema as any).members.all();
        return {members: models};
      });
      this.get("/products", (schema) => {
        const {models} = (schema as any).products.all();
        return {products: models};
      });
      this.get("/boards", (schema) => {
        const {models} = (schema as any).boardMembers.all();
        return {
          boardMembers: models.map((boardMember: any) => ({
            functie: boardMember.title,
            lid_id: boardMember.member.id,
            jaar: boardMember.board.year,
          })),
        };
      });
      this.get("committees", (schema) => {
        const {models} = (schema as any).committeeMembers.all();
        return {
          committees: models.map((committeeMember: any) => ({
            naam: committeeMember.committee.name,
            functie: committeeMember.title,
            jaar: committeeMember.year,
            lid_id: committeeMember.member.id,
            commissie_id: committeeMember.committee.id,
          })),
        };
      });
      this.get("*/categories", (schema) => {
        const {models} = (schema as any).categories.all();
        return {statistics: models};
      });
      this.get("*/activities", () => ({
        activities: [
          {
            endDate: "2021-01-15T00:00:00+00:00",
            startDate: "2021-01-13T00:00:00+00:00",
            location:
              "Martinihal, Leonard Springerlaan 2, 9727 KB Groningen, Netherlands",
            description:
              "The ‘Beta Business Days’ has been an unique multiday career-event for all students of the Faculty of Mathematics and Natural Sciences from the University of Groningen in the Netherlands.\n",
            title: "Beta Business Days",
          },
        ],
      }));
      this.post("/orders", () => {
        return {order: 1};
      });
      this.get("/orders", () => {
        return {orders: []};
      });
      this.get("/sponsors", () => {
        return {
          sponsors: [
            {name: "S[ck]rip(t|t?c)ie", image: ""},
            {name: "Compucie", image: ""},
            {name: "Borrelcie", image: ""},
          ],
        };
      });
      this.get("https://borrelcie.vodka/present/data.php", (_) => {
        return ["Mark"];
      });
    },
  });
  return server;
}

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
        this[method]("http://francken.nl.localhost/*", async (_: any, request: any) => {
          let [status, headers, body] = await (window as any).handleFromCypress(request);
          return new Response(status, headers, body);
        });
        // @ts-expect-error ts-migrate(7052) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        this[method](
          "https://borrelcie.vodka/present/data.php",
          async (_: any, request: any) => {
            let [status, headers, body] = await (window as any).handleFromCypress(
              request
            );
            return new Response(status, headers, body);
          }
        );
        // @ts-expect-error ts-migrate(7052) FIXME: Element implicitly has an 'any' type because type ... Remove this comment to see the full error message
        this[method]("/*", async (_: any, request: any) => {
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

  //return;
  if (process.env.NODE_ENV === "development") {
    return makeDevServer();
  }

  return null;
};

export default makeEnvironmentSpecificServer;
