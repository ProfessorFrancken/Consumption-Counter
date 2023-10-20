import {screen, within} from "@testing-library/react";
import Footer from "./footer";
import {render} from "test-utils";
import {setupServer} from "msw/node";
import {rest} from "msw";

const server = setupServer(
  rest.get("*/sponsors", (req, res, ctx) => {
    return res(
      ctx.json({
        sponsors: [
          {name: "S[ck]rip(t|t?c)ie", image: ""},
          {name: "Compucie", image: ""},
          {name: "Borrelcie", image: ""},
        ],
      })
    );
  })
);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

it("renders without crashing", async () => {
  render(<Footer />);

  expect(
    screen.getByLabelText("Partners sponsoring the consumption counter")
  ).toBeInTheDocument();
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();

  const sponsors = screen.getByRole("list", {
    name: "Partners sponsoring the consumption counter",
  });
  expect(await within(sponsors).findAllByRole("listitem")).toHaveLength(3);
});
