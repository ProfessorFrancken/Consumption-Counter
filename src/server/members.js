import {Factory, trait} from "miragejs";
import faker from "faker";
import moment from "moment";

export const MemberFactory = Factory.extend({
  id: (i) => parseInt(i, 10),

  achternaam() {
    return faker.name.lastName();
  },

  voornaam() {
    return faker.name.firstName();
  },

  tussenvoegsel(i) {
    if (i % 3 === 0) {
      return "de";
    }
    return "";
  },

  initialen() {
    return `${this.voornaam[0]}. ${this.achternaam[0]}.`;
  },

  latest_purchase_at(i) {
    if (i % 10 === 0) {
      return null;
    }
    return moment(faker.date.recent()).format("YYYY-MM-DD HH:MM:SS");
  },
  geboortedatum(i) {
    const birthdate =
      i % 5 === 0
        ? faker.date.past(2, moment().subtract(15, "years"))
        : faker.date.past(10, moment().subtract(18, "years"));

    return moment(birthdate).format("YYYY-MM-DD");
  },

  minor: trait({
    birthdate() {
      const birthdate = faker.date.past(2, moment().subtract(15, "years"));

      return moment(birthdate).format("YYYY-MM-DD");
    },
  }),

  withCommittee: trait({
    afterCreate(member, server) {},
  }),

  small_button: trait({
    button_height: 40,
    button_width: 70,
  }),

  button_height(i) {
    if (i === 100) {
      return 70;
    }
    return null;
  },
  button_width(i) {
    if (i === 100) {
      return 70;
    }
    return null;
  },
  bijnaam(i) {
    const nicknames = [null, null, null, null, null, "hoi"];

    return nicknames[i % nicknames.length];
  },
  afbeelding(i) {
    const backgrounds = [
      null,
      "https://old.professorfrancken.nl/database/streep/afbeeldingen/c538yFPOCdcXhZ6Xqz2l.jpg",
      null,
      null,
      null,
    ];

    return backgrounds[i % backgrounds.length];
  },
  kleur(i) {
    const colors = [null, null, null, "#e50000"];

    return colors[i % colors.length];
  },
  prominent: null,
});
