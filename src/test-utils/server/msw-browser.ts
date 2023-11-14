import {setupWorker} from "msw";
import {getMemberApi} from "./members";
import {range, sampleSize, sample, orderBy, groupBy} from "lodash";
import {getProductApi} from "./products";
import {getCommitteeMemberApi} from "./committees";
import {faker} from "@faker-js/faker";
import moment from "moment";
import {getHandlers} from "./msw-handlers";
import {getBoardMemberApi} from "./boards";
import {getOrderApi} from "./orders";
import {ApiCommitteesStatisticsResponse} from "../../queries/statistics";

faker.seed(33);

const members = [
  getMemberApi({
    latest_purchase_at: "2020-03-08 22:05:49",
    button_height: null,
    button_width: null,
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
    id: 1403,
  }),
  ...range(0, 300).map((idx) => {
    return getMemberApi({id: idx});
  }),
];

const products = range(0, 30).map((idx) => {
  return getProductApi({id: idx});
});

const year = new Date().getFullYear();
const committees = range(0, 33).map((idx) => {
  const committeeMembers = sampleSize(members, Math.ceil(10 * Math.random() + 5));

  const {naam: name} = getCommitteeMemberApi({
    commissie_id: `${idx}`,
    lid_id: `${idx}`,
    jaar: year,
  });

  return {
    id: idx,
    name,
    members: committeeMembers.map((committeeMember) => {
      return getCommitteeMemberApi({
        commissie_id: `${idx}`,
        lid_id: `${committeeMember.id}`,
        jaar: year,
      });
    }),
  };
});

const boardMembers = range(0, 20).flatMap((boardIdx) => {
  const boardYear = year - boardIdx;
  const boardMembers = sampleSize(members, Math.ceil(3 * Math.random() + 3));

  return boardMembers.map((boardMember, idx) => {
    return getBoardMemberApi({
      lid_id: boardMember.id,
      jaar: boardYear,
    });
  });
});

const ORDERS_PER_MEMBER = 40;
const orders = orderBy(
  range(0, members.length * ORDERS_PER_MEMBER).map((idx) => {
    const member = sample(members)!;
    const product = sample(products)!;

    return getOrderApi({id: idx}, member, product);
  }),
  (order) => moment(order.ordered_at).unix()
);

const ordersByDate = groupBy(orders, (order) =>
  moment(order.ordered_at).format("YYYY-MM-DD")
);

// NOTE: the heat map currently requires every date to be present,
// will be fixed later
const transactionStatistics = range(0, 2 * 365).map((idx) => {
  const date = moment().subtract(idx, "day").format("YYYY-MM-DD");

  const beer = ordersByDate[date]?.filter((order) => order.type === "Bier")?.length ?? 0;
  const soda = ordersByDate[date]?.filter((order) => order.type === "Fris")?.length ?? 0;
  const food = ordersByDate[date]?.filter((order) => order.type === "Eten")?.length ?? 0;

  return {
    date,
    beer: `${beer}`,
    soda: `${soda}`,
    food: `${food}`,
  };
});

const ordersByMember = groupBy(orders, (order) => order.member_id);

const committeesStatistics: ApiCommitteesStatisticsResponse["statistics"] =
  committees.map((committee) => {
    const orders = committee.members.flatMap(
      (member) => ordersByMember[member.lid_id] ?? []
    );

    const beer = orders?.filter((order) => order.type === "Bier")?.length ?? 0;
    const soda = orders?.filter((order) => order.type === "Fris")?.length ?? 0;
    const food = orders?.filter((order) => order.type === "Eten")?.length ?? 0;

    return {
      beer,
      food,
      soda,
      committee: {
        id: committee.id,
        name: committee.name,
      },
    };
  });

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(
  ...getHandlers({
    products,
    members,
    committees: committees.flatMap(({members}) => members),
    boardMembers,
    transactionStatistics,
    committeesStatistics,
    orders,
  })
);
