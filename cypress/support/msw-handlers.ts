import moment from "moment";
import {getHandlers} from "./../../src/test-utils/server/msw-handlers";
import {getBoardMemberApi} from "../../src/test-utils/server/boards";
import {getCommitteeMemberApi} from "../../src/test-utils/server/committees";
import {getProductApi} from "../../src/test-utils/server/products";
import {getMemberApi} from "../../src/test-utils/server/members";

const member = {
  firstName: "John",
  lastName: "Snow",
  fullName: "John Snow",
};

const date = new Date();

const past = new Date();
past.setYear(past.getFullYear() - 1);

const thisWeek = [
  // The previous Sunday isn't displayed
  new Date(2020, 2, 8),

  // Start at Monday
  new Date(2020, 2, 9),
  new Date(2020, 2, 10),
  new Date(2020, 2, 11),
  // Up to Thursday
  new Date(2020, 2, 12),
];

const currentYear = new Date().getFullYear();

export const mswHandlers = getHandlers({
  members: [
    getMemberApi({
      id: 1,
      latest_purchase_at: date.toISOString(),
      geboortedatum: "1993-04-26",
      achternaam: member.lastName,
      voornaam: member.firstName,
      tussenvoegsel: "",
      bijnaam: "",
    }),
    getMemberApi({
      id: 1403,
      latest_purchase_at: date.toISOString(),
      geboortedatum: "1993-04-26",
      achternaam: "Redeman",
      voornaam: "Mark",
      tussenvoegsel: "",
      bijnaam: "",
    }),
    getMemberApi({
      id: 123,
      achternaam: "Sjaars",
      voornaam: "Sjaars",
      tussenvoegsel: "",
      bijnaam: "Sjaars",
      geboortedatum: "2003-01-01",
    }),
    getMemberApi({
      id: 1234,
      achternaam: "Stark",
      voornaam: "Arya",
      tussenvoegsel: "",
      bijnaam: "Arya",
      button_width: 70,
      button_height: 40,
      latest_purchase_at: "2020-03-08 22:05:49",
      geboortedatum: "1993-04-26",
    }),
    getMemberApi({
      id: 33,
      achternaam: "Baars",
      voornaam: "Sven",
      tussenvoegsel: "",
      bijnaam: "ir. Sven",
    }),
    getMemberApi({
      id: 34,
      bijnaam: "Dictadtor",
      afbeelding:
        "https://old.professorfrancken.nl/database/streep/afbeeldingen/nc1J3sNtthqGkeQy0tDf.jpeg",
    }),
    getMemberApi({
      id: 2,

      latest_purchase_at: past.toISOString(),
      geboortedatum: "1993-01-01",
      achternaam: "Stark",
      voornaam: "Brandon",
      tussenvoegsel: "",
      bijnaam: "Brandon Stark",
    }),
    getMemberApi({
      id: 9999,
      latest_purchase_at: date.toISOString(),
      geboortedatum: "1993-01-01",
      achternaam: "Stark",
      voornaam: "Rickard",
      tussenvoegsel: "",
      bijnaam: "Rickard Stark",
    }),
  ],
  products: [
    getProductApi({id: 1, categorie: "Bier", naam: "Hertog Jan"}),
    getProductApi({id: 2, categorie: "Eten", naam: "Mars"}),
    getProductApi({id: 3, categorie: "Fris", naam: "Ice Tea", prijs: 0.61}),
    getProductApi({id: 4, categorie: "Fris", naam: "Goede morgen!"}),
    getProductApi({
      id: 5,
      categorie: "Fris",
      naam: "Pepsi max",
      splash_afbeelding:
        "https://old.professorfrancken.nl/database/streep/afbeeldingen/ECDOccDsQVmRRRpyBnN1.jpeg",
    }),
  ],
  boardMembers: [
    getBoardMemberApi({jaar: date.getFullYear(), lid_id: 1403}),
    getBoardMemberApi({jaar: date.getFullYear() - 1, lid_id: 1}),
    getBoardMemberApi({jaar: date.getFullYear() - 2, lid_id: 1}),
    getBoardMemberApi({jaar: date.getFullYear() - 3, lid_id: 1}),
    getBoardMemberApi({jaar: date.getFullYear() - 4, lid_id: 1}),

    getBoardMemberApi({jaar: 2019, lid_id: 34}),
    getBoardMemberApi({jaar: date.getFullYear() - 10, lid_id: 9999}),
  ],
  committees: [
    getCommitteeMemberApi({
      commissie_id: "1",
      naam: "s[ck]rip(t|t?c)ie",
      jaar: currentYear,
      lid_id: "33",
    }),
    getCommitteeMemberApi({
      commissie_id: "1",
      naam: "s[ck]rip(t|t?c)ie",
      jaar: currentYear,
      lid_id: "1403",
    }),
  ],
  statistics: thisWeek.map((day, idx) => {
    return {
      date: moment(day).format("YYYY-MM-DD"),
      beer: `${100 * (idx + 1)}`,
      food: "0",
      soda: "0",
    };
  }),
});
