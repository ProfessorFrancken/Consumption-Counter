import {defaultMembers} from "App/MockedState";
import {render, fireEvent, getProduct} from "test-utils";
import {Product, OrderContext} from "./OrdersContext";
import Products from "./Products";

it("renders without crashing", () => {
  render(<Products />);
});

it("adds products to an order when clicked", async () => {
  const addToOrder = jest.fn();

  const hertogJan: Product = {
    id: 1,
    name: "Hertog-Jan",
    image: "",
    age_restriction: 18,
    category: "Bier",
    position: 0,
    price: 1,
    splash_image: "",
  };

  const makeOrder = jest.fn();
  const value = {
    products: {
      Bier: [hertogJan],
      Fris: [],
      Eten: [],
    },
    addProductToOrder: addToOrder,
    reset: () => {},
    order: {products: [], member: undefined},
    makeOrder,
  };

  const products = (
    <OrderContext.Provider value={value}>
      <Products />
    </OrderContext.Provider>
  );

  const kinderBueno = getProduct({name: "Kinder Bueno", id: 2});
  const screen = render(products, {
    routes: ["?memberId=1"],
    storeState: {
      products: {
        Bier: [hertogJan],
        Fris: [],
        Eten: [kinderBueno],
      },
    },
  });

  // Since this component uses a long press event, we need to simulate mouse down and up
  fireEvent.mouseDown(screen.getByLabelText("Buy Kinder Bueno"));
  fireEvent.mouseUp(screen.getByLabelText("Buy Kinder Bueno"));

  expect(makeOrder).toBeCalledWith({
    products: [kinderBueno],
  });
});
