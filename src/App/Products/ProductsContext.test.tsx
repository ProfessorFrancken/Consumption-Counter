import * as React from "react";
import {render} from "@testing-library/react";
import {useProducts, ProductsProvider} from "./ProductsContext";
import moxios from "moxios";
import {InfrastructureProviders} from "Root";

describe("Product context", () => {
  const SelectProduct: React.FC = () => {
    const {products} = useProducts();

    if (products === undefined) {
      return <span>Hoi</span>;
    }

    return (
      <ul>
        {products.map((product, idx) => (
          <li key={idx}>{product.name}</li>
        ))}
      </ul>
    );
  };

  it("Selects a member when they do not have a latest purchse", async () => {
    // TODO: replace by msw or miragejs
    moxios.install();
    const base_api = process.env.REACT_APP_API_SERVER;
    moxios.stubRequest(`${base_api}/products`, {
      response: {products},
      headers: {"content-type": "application/json"},
    });

    const {findByText} = render(
      <InfrastructureProviders>
        <ProductsProvider>
          <SelectProduct />
        </ProductsProvider>
      </InfrastructureProviders>
    );

    expect(await findByText("Hertog Jan")).toBeInTheDocument();
    expect(await findByText("Grolsch")).toBeInTheDocument();
    expect(await findByText("Heineken")).toBeInTheDocument();
  });

  it("Requires the ProductsProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation();
    expect(() => render(<SelectProduct />)).toThrow();
    expect(spy).toHaveBeenCalledTimes(3);

    spy.mockReset();
    spy.mockRestore();
  });
});

const products = [
  {
    id: 1,
    naam: "Hertog Jan",
    prijs: "0.6500",
    categorie: "Bier",
    positie: 999,
    beschikbaar: 1,
    afbeelding: "",
    splash_afbeelding: "",
    kleur: null,
  },
  {
    id: 3,
    naam: "Grolsch",
    prijs: "0.6500",
    categorie: "Eten",
    positie: 999,
    beschikbaar: 1,
    afbeelding: "",
    splash_afbeelding: null,
    kleur: null,
  },
  {
    id: 2,
    naam: "Heineken",
    prijs: "0.6000",
    categorie: "Fris",
    positie: 999,
    beschikbaar: 0,
    afbeelding: "",
    splash_afbeelding: null,
    kleur: null,
  },
];
