import * as React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import {useProducts, ProductsProvider} from "./ProductsContext";
import {InfrastructureProviders} from "Root";
import {setupServer} from "msw/lib/node";
import {rest} from "msw";
import {useOrder} from "./OrdersContext";
import {render as renderApp, getProduct, getMember} from "test-utils";

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

  const server = setupServer(
    rest.get("*/products", (req, res, ctx) => {
      return res(ctx.json({products}));
    })
  );

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it("Selects a member when they do not have a latest purchse", async () => {
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

  it("Doensn't allow an order without a member", async () => {
    const MakeOrder: React.FC = () => {
      const [failed, setFailed] = React.useState(false);
      const {makeOrderMutation} = useOrder();

      const onClick = () => {
        makeOrderMutation
          // @ts-expect-error TODO we can remove this test now, but let's keep it until we
          // are certain that the interface won't change
          .mutateAsync({products: [getProduct()], member: undefined})
          .catch(() => {
            setFailed(true);
          });
      };

      if (failed) {
        return <div>Failed</div>;
      }

      return <button onClick={onClick}>Make order</button>;
    };

    const {getByRole, getByText} = renderApp(<MakeOrder />);

    fireEvent.click(getByRole("button"));

    expect(await screen.findByText("Failed")).toBeInTheDocument();
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
