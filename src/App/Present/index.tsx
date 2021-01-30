import React from "react";
import {useDispatch, useSelector} from "react-redux";
import Members, {MemberType} from "./../Members/Members";
import {selectMember} from "../../actions";
import nedap from "./../../assets/nedap-logo.png";

type PresentMemberType = {
  francken_id: string;
  name: string;
  buixieval: string;
  screen: boolean;
};
const names: PresentMemberType[] = [
  {francken_id: "1403", name: "Mark", buixieval: "pink", screen: true},
];

const handleResponse = (response: any) => {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }
  return response.json();
};

const useFetchPresentMembers = (members: MemberType[]) => {
  const [presentMembers, setPresentMembers] = React.useState<string[]>([]);
  React.useEffect(() => {
    fetch(`https://borrelcie.vodka/present/data.php`)
      .then(handleResponse)
      .then(
        (members) => setPresentMembers(members),
        () => setPresentMembers([])
      );
  });

  return presentMembers
    .map((memberName: string) => {
      return names.find((name) => name.name === memberName);
    })
    .filter((member): member is PresentMemberType => member !== undefined)
    .map((presentMember: PresentMemberType) => {
      return members.find(
        (member: MemberType) => member.id === parseInt(presentMember.francken_id, 10)
      );
    })
    .filter(
      (member: MemberType | undefined): member is MemberType => member !== undefined
    );
};

type PresentProps = {
  members: MemberType[];
  selectMember: (member: MemberType) => void;
};

const Present = ({members, selectMember}: PresentProps) => {
  const presentMembers = useFetchPresentMembers(members);

  return (
    <div className="d-flex flex-column justify-content-between h-100">
      <Members members={presentMembers} selectMember={selectMember} />
      <div className="text-right">
        Sponsored by
        <img
          src={nedap}
          className="ml-3 img-fluid"
          alt="Logo of Nedap"
          style={{width: "150px"}}
        />
      </div>
    </div>
  );
};

const PresentScreen = () => {
  const dispatch = useDispatch();
  const members = useSelector((state: any) => state.members);

  return (
    <Present
      selectMember={(member: MemberType) => dispatch(selectMember(member))}
      members={members}
    />
  );
};

export default PresentScreen;
