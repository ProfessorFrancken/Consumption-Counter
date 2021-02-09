import React from "react";
import {QueryObserverResult, useQuery} from "react-query";
import api from "api";
import {useHistory} from "react-router";
import {groupBy, uniqBy} from "lodash";
import {MemberType} from "App/Members/Members";
import {useSelector} from "react-redux";

type Committee = {
  id: number;
  name: string;
};

type CommitteeMember = {
  member_id: number;
  year: number;
  function: string;
  committee: Committee;
  member?: MemberType;
};

const useFetchCommitteeMembers = (committeeMembers?: CommitteeMember[]) => {
  return useQuery<CommitteeMember[]>({
    queryKey: ["committees"],
    queryFn: async () => {
      const mapCommittee = (member: any): CommitteeMember => {
        return {
          member_id: parseInt(member.lid_id, 10),
          year: member.jaar,
          function: member.functie,
          committee: {
            id: parseInt(member.commissie_id, 10),
            name: member.naam,
          },
        };
      };

      const response = await api.get("/committees");
      return response.committees.map(mapCommittee);
    },
    enabled: committeeMembers === undefined,
  });
};

type State = {
  committeesQuery: QueryObserverResult<CommitteeMember[]>;
  committees: Committee[] | undefined;
  committeeMembers: CommitteeMember[] | undefined;
  selectCommittee: (committee: Committee) => void;
};
const CommitteesContext = React.createContext<State | undefined>(undefined);
export const CommitteesProvider: React.FC<{committeeMembers?: CommitteeMember[]}> = ({
  committeeMembers: defaultCommitteeMembers,
  children,
  ...props
}) => {
  const {push} = useHistory();
  const members = useSelector((state: any) => state.members);

  const committeesQuery = useFetchCommitteeMembers(defaultCommitteeMembers);

  const selectCommittee = (committee: Committee) => {
    push(`/committees/${committee.id}`);
  };

  const committeeMembers: CommitteeMember[] = (
    defaultCommitteeMembers ??
    committeesQuery.data ??
    []
  )
    .map((member) => {
      return {
        ...member,
        member: members.find(({id}: MemberType) => id === member.member_id),
      };
    })
    .filter(({member}) => member !== undefined);

  const committees = uniqBy(
    committeeMembers.reduce(
      (committees: Committee[], member: CommitteeMember) => [
        ...committees,
        member.committee,
      ],
      [] as Committee[]
    ),
    (committee: Committee) => committee.id
  );

  return (
    <CommitteesContext.Provider
      value={{
        committeesQuery,
        selectCommittee,
        committees,
        committeeMembers,
        ...props,
      }}
    >
      {children}
    </CommitteesContext.Provider>
  );
};

export const useCommittees = () => {
  const context = React.useContext(CommitteesContext);

  if (!context) {
    throw new Error(`useCommittees must be used within a CommitteesContext`);
  }

  return context;
};

export const useExistingCommitteeMembers = () => {};
export const useCommitteeMembers = (committeeId: number): MemberType[] => {
  const now = new Date();
  const {committeeMembers = []} = useCommittees();
  const members = useSelector((state: any) => state.members);

  return uniqBy(
    committeeMembers
      .filter((member) => member.committee.id === committeeId)
      .filter((member) =>
        [now.getFullYear() - 1, now.getFullYear()].includes(member.year)
      )
      .map((activeMember: any) => ({
        committee_id: activeMember.committee.id,
        ...members.find((member: MemberType) => member.id === activeMember.member_id),
      }))
      .filter((member: MemberType) => member.id !== undefined),
    (member) => member.id
  );
};

export const useCompucie = () => {
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
