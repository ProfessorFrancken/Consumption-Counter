// @ts-expect-error ts-migrate(2305) FIXME: Module '"miragejs"' has no exported member 'associ... Remove this comment to see the full error message
import {Factory, association} from "miragejs";

export const CommitteeFactory = Factory.extend({
  id(i: any) {
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
    return parseInt(i % 40, 10);
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
});

export const CommitteeMemberFactory = Factory.extend({
  title(i: any) {
    const functions = ["", "", "", "Treasurer", "President"];
    return functions[i % functions.length];
  },

  committee: association(),
  member: association(),

  year(i: any) {
    return 2018 + (i % 5);
  },
});
