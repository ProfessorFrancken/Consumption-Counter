import {useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "react-router";
import {useSelectMember} from "../../components/orders-context";
import {useCommittees, CommitteeMember} from "queries/committees";
import {groupBy} from "lodash";
import {MemberType} from "../../queries/members";
import {NavLink} from "react-router-dom";
import Member from "./../../components/member-button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

type Props = {
  compucie: MemberType[];
  scriptcie: MemberType[];
  selectMember: (member: MemberType) => void;
  reloadApplication: () => void;
};

const Compucie = ({compucie, scriptcie, selectMember, reloadApplication}: Props) => (
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
          firstName: "",
          surname: "",
          fullname: "Refresh",
          age: 101,
          prominent: 0,
          latest_purchase_at: new Date(),
          cosmetics: undefined,
        }}
        onClick={() => reloadApplication()}
      />

      <Member
        member={{
          id: 1098,
          firstName: "",
          surname: "",
          fullname: "Guest",
          age: 101,
          prominent: 0,
          latest_purchase_at: new Date(),
          cosmetics: undefined,
        }}
        onClick={selectMember}
      />

      <Member
        member={{
          id: 1098,
          firstName: "",
          surname: "",
          fullname: "Overdue",
          age: 101,
          prominent: 0,
          latest_purchase_at: new Date(),
          cosmetics: undefined,
        }}
        onClick={selectMember}
      />

      <div>
        {/* This div is deliberately left empty so that the settings
               button will be placed at the right most part of the grid
             */}
      </div>
      <div>
        {/* This div is deliberately left empty so that the settings
               button will be placed at the right most part of the grid
             */}
      </div>
      <NavLink to="/settings" className="tile button">
        <FontAwesomeIcon icon={"cogs"} size="lg" />
      </NavLink>
    </nav>
  </div>
);

const useCompucie = () => {
  const {committeeMembers = []} = useCommittees();
  const committees = groupBy(
    committeeMembers.filter((member: CommitteeMember) => {
      return ["Compucie", "s[ck]rip(t|t?c)ie"].includes(member.committee.name);
    }),
    (member: CommitteeMember) => member.committee.name
  );

  return {
    compucie: (committees["Compucie"] || []).map(({member}) => member) as MemberType[],
    scriptcie: (committees["s[ck]rip(t|t?c)ie"] || []).map(
      ({member}) => member
    ) as MemberType[],
  };
};

const CompucieScreen = () => {
  const {compucie, scriptcie} = useCompucie();
  const selectMember = useSelectMember();
  const navigate = useNavigate();
  const client = useQueryClient();

  return (
    <Compucie
      compucie={compucie}
      scriptcie={scriptcie}
      selectMember={selectMember}
      reloadApplication={() => {
        client.invalidateQueries();
        client.refetchQueries();
        navigate("/loading");
      }}
    />
  );
};

export default CompucieScreen;
