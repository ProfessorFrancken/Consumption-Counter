import React from "react";
import PropTypes from "prop-types";
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import {NavLink} from "react-router-dom";
import Member from "App/Members/MemberButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TempleCountButton from "./TempleCountButton";

type Props = {
  compucie: MemberPropType[];
  scriptcie: MemberPropType[];
};

const Compucie = ({
  compucie,
  scriptcie,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'selectMember' does not exist on type 'Pr... Remove this comment to see the full error message
  selectMember,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'toSettings' does not exist on type 'Prop... Remove this comment to see the full error message
  toSettings,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'reloadApplication' does not exist on typ... Remove this comment to see the full error message
  reloadApplication,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'decreaseTempleCount' does not exist on t... Remove this comment to see the full error message
  decreaseTempleCount,
}: Props) => (
  <div className="d-flex flex-column justify-content-stretch h-100">
    <nav className="compucie tilesGrid" style={{flexShrink: 1}}>
      {[...compucie, ...scriptcie].map((member) => (
        <Member member={member} key={member.id} onClick={selectMember} />
      ))}
    </nav>

    <nav className="tilesGrid compucie-buttons" style={{flexShrink: 4, marginTop: "1em"}}>
      <Member
        member={{
          id: -1,
          fullname: "Refresh",
          age: 101,
          prominent: 0,
          latest_purchase_at: new Date(),
          cosmetics: {},
        }}
        onClick={() => reloadApplication()}
      />

      <Member
        member={{
          id: 1098,
          fullname: "Guest",
          age: 101,
          prominent: 0,
          latest_purchase_at: new Date(),
          cosmetics: {},
        }}
        onClick={selectMember}
      />

      <Member
        member={{
          id: 1098,
          fullname: "Overdue",
          age: 101,
          prominent: 0,
          latest_purchase_at: new Date(),
          cosmetics: {},
        }}
        onClick={selectMember}
      />

      {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ decreaseTempleCount: any; }' is not assign... Remove this comment to see the full error message */}
      <TempleCountButton decreaseTempleCount={decreaseTempleCount} />
      <div>
        {/* This div is deliberately left empty so that the settings
               button will be placed at the right most part of the grid
             */}
      </div>
      <NavLink exact to="/settings" className="tile button">
        <FontAwesomeIcon icon={"cogs"} size="lg" />
      </NavLink>
    </nav>
  </div>
);

type MemberPropType = {
  id: number;
  firstName: string;
  surname: string;
};

const MemberPropType: PropTypes.Requireable<MemberPropType> = PropTypes.shape({
  id: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  surname: PropTypes.string.isRequired,
});

export default Compucie;
