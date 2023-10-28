import {setupWorker} from "msw";
import {memberFactoryDefinition} from "./members";
import {range, sampleSize} from "lodash";
import {productFactoryDefinition} from "./products";
import {committeeFactoryDefinition} from "./committees";
import {faker} from "@faker-js/faker";
import moment from "moment";
import {getHandlers} from "./msw-handlers";

faker.seed(33);

const members = [
  {
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
  },
  ...range(0, 300).map((idx) => {
    const voornaam = memberFactoryDefinition.voornaam();
    const achternaam = memberFactoryDefinition.achternaam();
    const tussenvoegsel = memberFactoryDefinition.tussenvoegsel(idx);
    const geboortedatum = memberFactoryDefinition.geboortedatum(idx);
    const afbeelding = memberFactoryDefinition.afbeelding(idx);
    const button_width = memberFactoryDefinition.button_width(idx);
    const button_height = memberFactoryDefinition.button_height(idx);
    const bijnaam = memberFactoryDefinition.bijnaam(idx);
    const kleur = memberFactoryDefinition.kleur(idx);
    const prominent = null;
    const latest_purchase_at = memberFactoryDefinition.latest_purchase_at(idx);

    return {
      id: idx,
      latest_purchase_at,
      button_height,
      button_width,
      bijnaam,
      afbeelding,
      kleur,
      prominent,
      geboortedatum,
      achternaam,
      tussenvoegsel,
      initialen: `${voornaam[0]}. ${achternaam[0]}`,
      voornaam,
    };
  }),
];

const products = range(0, 30).map((idx) => {
  return {
    id: idx,
    product_id: idx,
    kleur: null,
    splash_afbeelding: productFactoryDefinition.splash_afbeelding(idx),
    updated_at: productFactoryDefinition.updated_at,
    created_at: productFactoryDefinition.created_at,
    eenheden: productFactoryDefinition.eenheden,
    btw: productFactoryDefinition.btw,
    afbeelding: productFactoryDefinition.afbeelding(idx),
    beschikbaar: productFactoryDefinition.beschikbaar,
    positie: productFactoryDefinition.positie,
    categorie: productFactoryDefinition.categorie(idx),
    prijs: productFactoryDefinition.prijs(),
    naam: productFactoryDefinition.naam(),
  };
});

const year = new Date().getFullYear();
const committees = range(0, 10).flatMap((idx) => {
  const committeeMembers = sampleSize(members, Math.ceil(10 * Math.random() + 5));
  const committee = {
    id: idx,
    naam: committeeFactoryDefinition.name(idx),
  };

  const functions = ["", "", "", "Treasurer", "President"];

  return committeeMembers.map((committeeMember, cmIdx) => {
    return {
      commissie_id: `${committee.id}`,
      naam: committee.naam,
      jaar: year,
      lid_id: `${committeeMember.id}`,
      functie: functions[cmIdx % functions.length],
    };
  });
});

const boardMembers = range(0, 20).flatMap((boardIdx) => {
  const boardYear = year - boardIdx;
  const boardMembers = sampleSize(members, Math.ceil(3 * Math.random() + 3));

  const functions = ["President", "Treasurer", "Secretary", "Intern", "Extern"];

  return boardMembers.map((boardMember, idx) => {
    return {
      functie: functions[idx % functions.length],
      lid_id: boardMember.id,
      jaar: boardYear,
    };
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
