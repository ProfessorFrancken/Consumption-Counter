import React, {useEffect} from "react";
import {queryOptions, useQuery} from "@tanstack/react-query";
import api from "../api";

export type ApiProductsResponse = {
  products: Array<{
    id: number;
    naam: string;
    prijs: number;
    categorie: "Bier" | "Eten" | "Fris";
    positie: number;
    beschikbaar: boolean;
    afbeelding: string;
    btw: string;
    eenheden: number;
    created_at: string;
    updated_at: string;
    product_id: number;
    splash_afbeelding: string | null;
    kleur: string | null;
  }>;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  position: number;
  category: "Bier" | "Fris" | "Eten";
  image: string;
  splash_image: string;
  age_restriction: number | null;
};

export const productsQueryOptions = () => {
  return queryOptions({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get<ApiProductsResponse>("/products");

      return response.products.map((product): Product => {
        return {
          id: parseInt(product.id as unknown as string, 10),
          name: product.naam as string,

          // Note we parse the price and then convert it to fulll cents
          price: 100 * parseFloat(product.prijs as unknown as string),
          position: parseInt(product.positie as unknown as string, 10),
          category: product.categorie as "Bier" | "Fris" | "Eten",
          image: product.afbeelding as string,
          splash_image: product.splash_afbeelding as string,
          age_restriction: product.categorie === "Bier" ? 18 : null,
        };
      });
    },
    staleTime: Infinity,
  });
};

export const useProductsQuery = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setImages] = React.useState<HTMLImageElement[]>([]);

  const query = useQuery(productsQueryOptions());

  useEffect(() => {
    if (!query.data) {
      return;
    }
    return;

    const products = query.data ?? [];

    const images = products.map((product) => {
      let img = new Image();
      img.src = product.image;
      return img;
    });

    setImages(images);
  }, [query.data]);

  return query;
};
