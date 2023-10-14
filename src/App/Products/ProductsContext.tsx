import React from "react";
import {QueryObserverResult, useQuery} from "@tanstack/react-query";
import api from "api";
import {Product} from "./OrdersContext";

const useFetchProducts = (products?: Product[]) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setImages] = React.useState<HTMLImageElement[]>([]);

  const preLoadImages = (products: Product[]) => {
    const images = products.map((product) => {
      let img = new Image();
      img.src = product.image;
      return img;
    });

    setImages(images);
  };

  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get<{
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
      }>("/products");

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
    onSuccess: preLoadImages,
    enabled: products === undefined,
    initialData: products,
  });
};

type State = {
  productsQuery: QueryObserverResult<Product[]>;
  products: Product[] | undefined;
};
const ProductsContext = React.createContext<State | undefined>(undefined);
export const ProductsProvider: React.FC<{
  products?: Product[];
  children: React.ReactNode;
}> = ({products: defaultProducts, children, ...props}) => {
  const productsQuery = useFetchProducts(defaultProducts);

  return (
    <ProductsContext.Provider
      value={{
        productsQuery,
        products: defaultProducts ?? productsQuery.data,
        ...props,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = React.useContext(ProductsContext);

  if (!context) {
    throw new Error(`useProducts must be used within a ProductsContext`);
  }

  return context;
};
