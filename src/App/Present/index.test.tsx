import {rest} from "msw";
import {setupServer} from "msw/lib/node";
import {render} from "test-utils";
import PresentScreen from "./index";

describe("Present screen", () => {
  const server = setupServer(
    rest.get("https://borrelcie.vodka/present/data.php", (req, res, ctx) => {
      return res(ctx.json(["Mark"]));
    })
  );

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it("Shows members that are present in the members room", async () => {
    const {findByRole, getByText, getByRole} = render(<PresentScreen />, {
      storeState: {members: [{id: 1403, fullname: "John Snow", cosmetics: {}}]},
    });

    expect(getByText("Sponsored by", {exact: false})).toBeInTheDocument();
    expect(await findByRole("button", {name: /John Snow/})).toBeInTheDocument();
  });
});
