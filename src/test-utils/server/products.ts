import {Factory} from "miragejs";
import {faker} from "@faker-js/faker";

export const productFactoryDefinition = {
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
  beschikbaar: true,
  positie: 1,
  categorie(i: any): "Bier" | "Fris" | "Eten" {
    const categories = ["Bier", "Fris", "Eten"];

    return categories[i % categories.length] as "Bier" | "Fris" | "Eten";
  },
  prijs() {
    return faker.number.float({min: 0.01, max: 5.0});
  },
  naam() {
    return faker.commerce.product();
  },
};

export const ProductFactory = Factory.extend(productFactoryDefinition);
