import {Factory} from "miragejs";
import {faker} from "@faker-js/faker";

export const ProductFactory = Factory.extend({
  id: (i: any) => parseInt(i, 10),
  product_id() {
    // @ts-expect-error huh
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
    return faker.commerce.price({min: 0.01, max: 5.0, dec: 4});
  },
  naam() {
    return faker.commerce.product();
  },
});
