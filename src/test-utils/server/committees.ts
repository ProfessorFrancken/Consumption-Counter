// @ts-expect-error ts-migrate(2305) FIXME: Module '"miragejs"' has no exported member 'associ... Remove this comment to see the full error message
import {Factory, association} from "miragejs";
import {ApiCommmitteesResponse} from "../../queries/committees";
import {ArrayElement} from "../../types";

export const committeeFactoryDefinition = {
  id(i: number) {
    return i % 40;
  },
  name(i: any) {
    if (i % 40 === 1) {
      return "Compucie";
    }
    if (i % 40 === 2) {
      return "s[ck]rip(t|t?c)ie";
    }
    return `Committee ${i % 40}`;
  },
};
export const CommitteeFactory = Factory.extend(committeeFactoryDefinition);

export const committeeMemberFactoryDefinition = {
  title(i: number) {
    const functions = ["", "", "", "Treasurer", "President"];
    return functions[i % functions.length];
  },

  committee: association(),
  member: association(),

  year(i: number) {
    return 2018 + (i % 5);
  },
};

export const CommitteeMemberFactory = Factory.extend(committeeMemberFactoryDefinition);

type ApiCommitteeMember = ArrayElement<ApiCommmitteesResponse["committees"]>;
type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

const functions = ["", "", "", "Treasurer", "President"];
export const getCommitteeMemberApi = (
  committeeMember: AtLeast<ApiCommitteeMember, "commissie_id" | "lid_id">
): ApiCommitteeMember => {
  const idx = Number(committeeMember.lid_id) ?? 0;

  return {
    naam: committeeFactoryDefinition.name(idx),
    jaar: new Date().getFullYear(),
    functie: functions[idx % functions.length],
    ...committeeMember,
  };
};
