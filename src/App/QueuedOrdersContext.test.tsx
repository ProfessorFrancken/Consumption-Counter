import * as React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import {render as renderApp} from "test-utils";
import {useQueuedOrders} from "./QueuedOrdersContext";
import {rest} from "msw";
import {setupServer} from "msw/lib/node";

describe("QueuedOrders context", () => {
  afterEach(() => {
    localStorage.removeItem("plus_one_order_queue");
  });

  const server = setupServer(
    rest.post("*/orders", (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
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
    expect(spy).toHaveBeenCalledTimes(3);

    spy.mockReset();
    spy.mockRestore();
  });

  it("Requeues an order if buying the order failed", async () => {
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

    renderApp(<MakeOrder />, state);

    fireEvent.click(screen.getByRole("button"));

    expect(await screen.findByText("Fails: 2")).toBeInTheDocument();
  });
});
