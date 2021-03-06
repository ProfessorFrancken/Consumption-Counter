import * as React from "react";
import {fireEvent, render} from "@testing-library/react";
import {render as renderApp} from "test-utils";
import {useQueuedOrders} from "./QueuedOrdersContext";
import moxios from "moxios";

describe("QueuedOrders context", () => {
  afterEach(() => {
    localStorage.removeItem("plus_one_order_queue");
  });

  const QueueOrder: React.FC = () => {
    const {queuedOrders} = useQueuedOrders();

    if (queuedOrders === undefined) {
      return null;
    }

    return (
      <ul>
        {queuedOrders.map((queuedOrder, idx) => (
          <li key={idx}>{queuedOrder.order.member.fullname}</li>
        ))}
      </ul>
    );
  };

  it("Requires the QueuedOrdersProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation();
    expect(() => render(<QueueOrder />)).toThrow();
    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockReset();
    spy.mockRestore();
  });

  it("Doensn't allow an order without a member", () => {
    const MakeOrder: React.FC = () => {
      const [failed, setFailed] = React.useState(false);
      const {makeOrder} = useQueuedOrders();

      const onClick = () => {
        try {
          makeOrder({member: undefined, products: []});
        } catch {
          setFailed(true);
        }
      };

      if (failed) {
        return <div>Failed</div>;
      }

      return <button onClick={onClick}>Make order</button>;
    };

    const {getByRole, getByText} = renderApp(<MakeOrder />);

    fireEvent.click(getByRole("button"));

    expect(getByText("Failed")).toBeInTheDocument();
  });

  it("Requeues an order if buying the order failed", async () => {
    moxios.install();
    const base_api = process.env.REACT_APP_API_SERVER;
    moxios.stubRequest(`${base_api}/orders`, {
      status: 500,
    });

    const MakeOrder: React.FC = () => {
      const {buyOrder, queuedOrders} = useQueuedOrders();

      const onClick = () => {
        buyOrder(queuedOrders[0].order);
      };

      return (
        <div>
          <button onClick={onClick}>Buy order</button>
          <ul>
            {queuedOrders.map((queuedOrder) => (
              <li key={queuedOrder.order.ordered_at}>Fails: {queuedOrder.fails}</li>
            ))}
          </ul>
        </div>
      );
    };

    const state = {
      storeState: {
        order: {member: undefined, products: []},
        queuedOrders: [
          {
            state: "queued",
            fails: 1,
            order: {
              member: {id: 1, firstName: "John", surname: "Snow"},
              products: [],
              ordered_at: 1,
            },
          },
        ],
      },
    };

    const {getByRole, findByText} = renderApp(<MakeOrder />, state);

    fireEvent.click(getByRole("button"));

    expect(await findByText("Fails: 2")).toBeInTheDocument();
  });
});
