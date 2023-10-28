import {rest} from "msw";
import {ApiBoardsResponse} from "queries/boards";
import {ApiCommmitteesResponse} from "queries/committees";
import {ApiMembersResponse} from "queries/members";
import {ApiProductsResponse} from "queries/products";
import {ApiStatisticsResponse} from "queries/statistics";

export const getHandlers = ({
  products,
  members,
  committees,
  boardMembers,
  statistics,
}: {
  members: ApiMembersResponse["members"];
  products: ApiProductsResponse["products"];
  boardMembers: ApiBoardsResponse["boardMembers"];
  committees: ApiCommmitteesResponse["committees"];
  statistics: ApiStatisticsResponse["statistics"];
}) => {
  const handlers = [
    rest.get("*/members", (req, res, ctx) => {
      return res(ctx.json({members}));
    }),
    rest.get("*/products", (req, res, ctx) => {
      return res(ctx.json({products}));
    }),
    rest.get("*/boards", (req, res, ctx) => {
      return res(ctx.json({boardMembers}));
    }),
    rest.get("*/committees", (req, res, ctx) => {
      return res(ctx.json({committees}));
    }),
    rest.get("*/statistics/categories", (req, res, ctx) => {
      return res(ctx.json({statistics}));
    }),
    rest.get("*/activities", (req, res, ctx) => {
      return res(ctx.json({activities: []}));
    }),
    rest.post("*/orders", (req, res, ctx) => {
      return res(ctx.status(200));
    }),
    rest.get("*/orders", (req, res, ctx) => {
      return res(ctx.json({products: []}));
    }),
    rest.get("*/sponsors", (req, res, ctx) => {
      return res(
        ctx.json({
          sponsors: [
            {name: "S[ck]rip(t|t?c)ie", image: ""},
            {name: "Compucie", image: ""},
            {name: "Borrelcie", image: ""},
          ],
        })
      );
    }),
    rest.get("https://old.professorfrancken.nl/*", (req, res, ctx) => {
      return res(ctx.status(204));
    }),
  ];

  return handlers;
};
