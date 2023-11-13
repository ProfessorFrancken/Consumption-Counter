import GoBack from "./go-back";
import {render, fireEvent, screen} from "../../../test-utils";

afterEach(() => {
  localStorage.removeItem("plus_one_order_queue");
});

describe("<GoBack />", () => {
  it("renders", () => {
    const storeState = {queuedOrder: null};
    const routes = ["/products"];

    render(<GoBack />, {storeState, routes});

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("Go back");
  });

  it("doesn't render on the frontpage if no order is queued", () => {
    const storeState = {queuedOrder: null};
    const routes = ["/"];

    render(<GoBack />, {storeState, routes});

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("goes back to a previous customer", () => {
    const storeState = {
      queuedOrder: {
        ordered_at: 1,
        order: {
          ordered_at: 1,
          member: {
            id: 1,
            firstName: "John",
            surname: "Snow",
            fullname: "John Snow",
            age: 18,
            prominent: null,
            latest_purchase_at: new Date(),
            cosmetics: {
              color: null,
              image: null,
              nickname: null,
              button: {
                width: null,
                height: null,
              },
            },
          },
          products: [],
        },
      },
    };
    render(<GoBack />, {storeState});

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("John Snow");
  });
});
