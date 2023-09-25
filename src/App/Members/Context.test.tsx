import * as React from "react";
import {render} from "@testing-library/react";
import {InfrastructureProviders} from "Root";
import {useMembers, MembersProvider} from "App/Members/Context";
import moment from "moment";
import {setupServer} from "msw/lib/node";
import {rest} from "msw";

describe("Member context", () => {
  const SelectMember: React.FC = () => {
    const {members} = useMembers();

    if (members === undefined) {
      return null;
    }

    return (
      <ul>
        {members.map((member, idx) => (
          <li key={idx}>
            {member.fullname} - {member.age}
          </li>
        ))}
      </ul>
    );
  };

  const members = [
    {
      id: 314,
      voornaam: "John",
      initialen: "",
      tussenvoegsel: "",
      achternaam: "Snow",
      geboortedatum: moment().subtract(33, "years").format("YYYY-MM-DD"),
      prominent: null,
      kleur: null,
      afbeelding: null,
      bijnaam: null,
      button_width: null,
      button_height: null,
      latest_purchase_at: "2018-01-01 00:00:00",
    },
    {
      id: 315,
      voornaam: "Eddard",
      initialen: "",
      tussenvoegsel: "the",
      achternaam: "Stark",
      geboortedatum: null,
      prominent: null,
      kleur: null,
      afbeelding: "utnCWM87tZclyENVrG03.jpg",
      bijnaam: null,
      button_width: null,
      button_height: null,
      latest_purchase_at: "2018-01-01 00:00:00",
    },
  ];

  const server = setupServer(
    rest.get("*/members", (req, res, ctx) => {
      return res(ctx.json({members}));
    })
  );

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it("Fetches a list of members", async () => {
    const {findByText} = render(
      <InfrastructureProviders>
        <MembersProvider>
          <SelectMember />
        </MembersProvider>
      </InfrastructureProviders>
    );

    expect(await findByText("John Snow - 33")).toBeInTheDocument();

    // It defaults to age of 0 so that someone with an unkown birthday
    // won't be able to buy beer
    expect(await findByText("Eddard the Stark - 0")).toBeInTheDocument();
  });

  it("Requires the MembersProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation();
    expect(() => render(<SelectMember />)).toThrow();
    expect(spy).toHaveBeenCalledTimes(3);

    spy.mockReset();
    spy.mockRestore();
  });

  // it only shows current active members
});
