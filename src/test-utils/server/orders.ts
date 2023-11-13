import {ApiOrdersResponse} from "../../queries/orders";
import {faker} from "@faker-js/faker";
import {ArrayElement} from "../../types";
import {ApiProduct} from "./products";
import {ApiMember} from "./members";
import moment from "moment";

type ApiOrder = ArrayElement<ApiOrdersResponse["orders"]>;

export const getOrderApi = (
  order: Partial<ApiOrder>,
  member: ApiMember,
  product: ApiProduct
): ApiOrder & {type: ApiProduct["categorie"]} => {
  const idx = order.id ?? 0;
  const member_id = member.id;
  const product_id = product.id;
  const price = product.prijs;

  const ordered_at = moment(
    faker.date.recent({
      days: 2 * 365,
    })
  ).format("YYYY-MM-DD HH:MM:SS");

  return {
    id: idx,
    amount: 1,
    member_id,
    product_id,
    price,
    ordered_at,
    type: product.categorie,

    ...order,
  };
};

export {};
