// @ts-expect-error ts-migrate(2305) FIXME: Module '"miragejs"' has no exported member 'associ... Remove this comment to see the full error message
import {Factory, association} from "miragejs";

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
