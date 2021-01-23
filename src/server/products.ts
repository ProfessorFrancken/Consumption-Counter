import {Factory} from "miragejs";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'fake... Remove this comment to see the full error message
import faker from "faker";

export const ProductFactory = Factory.extend({
  id: (i: any) => parseInt(i, 10),
  product_id() {
    return this.id;
  },
  kleur: null,
  splash_afbeelding(i: any) {
    if (i % 5 === 0) {
      return "https://old.professorfrancken.nl/database/streep/afbeeldingen/33hu4fj5sXIkUHnW821p.png";
    }
    return null;
  },
  updated_at: "2018-07-12 13:43:31",
  created_at: "0000-00-00 00:00:00",
  eenheden: 0,
  btw: "0.2100",
  afbeelding(i: any) {
    const images = [
      "https://old.professorfrancken.nl/database/streep/afbeeldingen/wCwnyLXTVdPEnKRXjw9I.png",
      "https://old.professorfrancken.nl/database/streep/afbeeldingen/Kvg0C3298rDYqhfA1dqS.jpg",
      "https://old.professorfrancken.nl/database/streep/afbeeldingen/MWpgAvc1MxIVOGU3HSHj.jpg",
    ];
    return images[i % images.length];
  },
  beschikbaar: 1,
  positie: 1,
  categorie(i: any) {
    const categories = ["Bier", "Fris", "Eten"];

    return categories[i % categories.length];
  },
  prijs() {
    return faker.commerce.price(0.01, 5.0, 4);
  },
  naam(i: any) {
    return faker.commerce.product();
  },
});
