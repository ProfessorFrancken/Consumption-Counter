import React from "react";
import {QueryObserverResult, useQuery} from '@tanstack/react-query';
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
      const mapProducts = (product: any): Product => {
        return {
          id: parseInt(product.id, 10),
          name: product.naam as string,

          // Note we parse the price and then convert it to fulll cents
          price: 100 * parseFloat(product.prijs),
          position: parseInt(product.positie, 10),
          category: product.categorie as "Bier" | "Fris" | "Eten",
          image: product.afbeelding as string,
          splash_image: product.splash_afbeelding as string,
          age_restriction: product.categorie === "Bier" ? 18 : null,
        };
      };

      const response = await api.get("/products");
      return response.products.map(mapProducts);
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
