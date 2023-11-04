import {Factory} from "miragejs";
import {faker} from "@faker-js/faker";
import {ApiProductsResponse} from "queries/products";
import {ArrayElement} from "types";

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

export type ApiProduct = ArrayElement<ApiProductsResponse["products"]>;
export const getProductApi = (product: Partial<ApiProduct>): ApiProduct => {
  const idx = product.id ?? 0;
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
    ...product,
  };
};

export const ProductFactory = Factory.extend(productFactoryDefinition);
