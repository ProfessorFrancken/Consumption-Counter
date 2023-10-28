import {setupWorker} from "msw";
import {getMemberApi} from "./members";
import {range, sampleSize} from "lodash";
import {getProductApi} from "./products";
import {getCommitteeMemberApi} from "./committees";
import {faker} from "@faker-js/faker";
import moment from "moment";
import {getHandlers} from "./msw-handlers";
import {getBoardMemberApi} from "./boards";

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
const committees = range(0, 10).flatMap((idx) => {
  const committeeMembers = sampleSize(members, Math.ceil(10 * Math.random() + 5));

  return committeeMembers.map((committeeMember) => {
    return getCommitteeMemberApi({
      commissie_id: `${idx}`,
      lid_id: `${committeeMember.id}`,
      jaar: year,
    });
  });
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

const statistics = range(0, 2 * 365).map((idx) => {
  const date = moment().subtract(idx, "day").format("YYYY-MM-DD");
  return {
    date,
    beer: `${faker.number.int(330)}`,
    soda: `${faker.number.int(100)}`,
    food: `${faker.number.int(200)}`,
  };
});

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(
  ...getHandlers({
    products,
    members,
    committees,
    boardMembers,
    statistics,
  })
);
