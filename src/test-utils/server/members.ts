// @ts-expect-error ts-migrate(2305) FIXME: Module '"miragejs"' has no exported member 'trait'... Remove this comment to see the full error message
import {Factory, trait} from "miragejs";
import {faker} from "@faker-js/faker";
import moment from "moment";
import {ApiMembersResponse} from "../../queries/members";
import {ArrayElement} from "../../types";

export const memberFactoryDefinition = {
  id: (i: any) => parseInt(i, 10),

  achternaam() {
    return faker.person.lastName();
  },

  voornaam() {
    return faker.person.firstName();
  },

  tussenvoegsel(i: any) {
    if (i % 3 === 0) {
      return "de";
    }
    return "";
  },

  initialen() {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return `${this.voornaam[0]}. ${this.achternaam[0]}.`;
  },

  latest_purchase_at(i: any) {
    if (i % 10 === 0) {
      return null;
    }
    return moment(faker.date.recent()).format("YYYY-MM-DD HH:MM:SS");
  },
  geboortedatum(i: any) {
    const birthdate =
      i % 5 === 0
        ? faker.date.past({years: 2, refDate: moment().subtract(15, "years").toDate()})
        : faker.date.past({years: 10, refDate: moment().subtract(18, "years").toDate()});

    return moment(birthdate).format("YYYY-MM-DD");
  },

  minor: trait({
    birthdate() {
      const birthdate = faker.date.past(2, moment().subtract(15, "years").toDate());

      return moment(birthdate).format("YYYY-MM-DD");
    },
  }),

  withCommittee: trait({
    afterCreate(member: any, server: any) {},
  }),

  small_button: trait({
    button_height: 40,
    button_width: 70,
  }),

  button_height(i: any) {
    if (i === 100) {
      return 70;
    }
    return null;
  },
  button_width(i: any) {
    if (i === 100) {
      return 70;
    }
    return null;
  },
  bijnaam(i: any) {
    const nicknames = [null, null, null, null, null, "hoi"];

    return nicknames[i % nicknames.length];
  },
  afbeelding(i: any) {
    const backgrounds = [
      null,
      "https://old.professorfrancken.nl/database/streep/afbeeldingen/c538yFPOCdcXhZ6Xqz2l.jpg",
      null,
      null,
      null,
    ];

    return backgrounds[i % backgrounds.length];
  },
  kleur(i: any) {
    const colors = [null, null, null, "#e50000"];

    return colors[i % colors.length];
  },
  prominent: null,
};

export type ApiMember = ArrayElement<ApiMembersResponse["members"]>;
export const getMemberApi = (member: Partial<ApiMember>): ApiMember => {
  const idx = member.id ?? 0;
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
    ...member,
  };
};

export const MemberFactory = Factory.extend(memberFactoryDefinition);
