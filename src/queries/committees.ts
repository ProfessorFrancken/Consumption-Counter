import {queryOptions, useQuery} from "@tanstack/react-query";
import api from "api";
import {useNavigate} from "react-router";
import {uniqBy} from "lodash";
import {MemberType} from "../queries/members";
import {useMembers} from "./members";
import {useCallback, useMemo} from "react";

type Committee = {
  id: number;
  name: string;
};

export type CommitteeMember = {
  member_id: number;
  year: number;
  function: string;
  committee: Committee;
  member?: MemberType;
};

export const committeeMembersQueryOptions = () => {
  return queryOptions({
    queryKey: ["committees"],
    queryFn: async () => {
      const response = await api.get<{
        committees: {
          commissie_id: string; // number
          functie: string;
          jaar: number;
          lid_id: string; // number
          naam: string;
        }[];
      }>("/committees");

      return response.committees.map((member): CommitteeMember => {
        return {
          member_id: parseInt(member.lid_id, 10),
          year: member.jaar,
          function: member.functie,
          committee: {
            id: parseInt(member.commissie_id, 10),
            name: member.naam,
          },
        };
      });
    },
    staleTime: Infinity,
  });
};

const useCommitteeMembersQuery = () => {
  return useQuery(committeeMembersQueryOptions());
};

export const useCommittees = () => {
  const navigate = useNavigate();
  const {members} = useMembers();

  const committeesQuery = useCommitteeMembersQuery();

  const selectCommittee = useCallback(
    (committee: Committee) => {
      navigate(`/committees/${committee.id}`);
    },
    [navigate]
  );

  const committeeMembers: CommitteeMember[] = useMemo(() => {
    return (committeesQuery.data ?? [])
      .map((member) => {
        return {
          ...member,
          member: members.find(({id}: MemberType) => id === member.member_id),
        };
      })
      .filter(({member}) => member !== undefined);
  }, [members, committeesQuery.data]);

  const committees = useMemo(() => {
    return uniqBy(
      committeeMembers.reduce(
        (committees: Committee[], member: CommitteeMember) => [
          ...committees,
          member.committee,
        ],
        [] as Committee[]
      ),
      (committee: Committee) => committee.id
    );
  }, [committeeMembers]);

  return {
    committeesQuery,
    selectCommittee,
    committees,
    committeeMembers,
  };
};

export const useCommitteeMembers = (committeeId: number): MemberType[] => {
  const now = new Date();
  const {committeeMembers = []} = useCommittees();
  const {members} = useMembers();

  return uniqBy(
    committeeMembers
      .filter((member) => member.committee.id === committeeId)
      .filter((member) =>
        [now.getFullYear() - 1, now.getFullYear()].includes(member.year)
      )
      .map((activeMember: CommitteeMember) => ({
        committee_id: activeMember.committee.id,
        ...members.find((member: MemberType) => member.id === activeMember.member_id)!,
      }))
      .filter((member: MemberType): member is MemberType => member.id !== undefined),
    (member) => member.id
  );
};
